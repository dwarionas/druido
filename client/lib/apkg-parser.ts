import JSZip from "jszip";
import initSqlJs, { type Database } from "sql.js";

export interface ParsedCard {
    question: string;
    answer: string;
}

/**
 * Strip HTML tags, decode entities, and collapse whitespace.
 */
function stripHtml(html: string): string {
    let text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?(div|p)[^>]*>/gi, "\n");
    text = text.replace(/<[^>]+>/g, "");
    text = text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
    return text.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Try to extract cards from a SQLite database buffer.
 * Handles both the old `notes` table format and checks for
 * other table structures that newer Anki versions might use.
 */
function extractCardsFromDb(db: Database): ParsedCard[] {
    const cards: ParsedCard[] = [];

    // check which tables exist
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = tables.length ? tables[0].values.map((r) => String(r[0])) : [];

    // try the standard `notes` table first (Anki 2.0 / 2.1)
    if (tableNames.includes("notes")) {
        const results = db.exec("SELECT flds FROM notes");
        if (results.length && results[0].values.length) {
            for (const row of results[0].values) {
                const flds = String(row[0]);
                const parts = flds.split("\x1f");
                const question = stripHtml(parts[0] || "");
                const answer = stripHtml(parts[1] || "");
                if (question && answer) {
                    cards.push({ question, answer });
                }
            }
        }
    }

    // some exports have a `cards` + `notes` join
    // try cards -> notes via nid if we got nothing and both tables exist
    if (cards.length === 0 && tableNames.includes("cards") && tableNames.includes("notes")) {
        const results = db.exec(
            "SELECT n.flds FROM cards c JOIN notes n ON c.nid = n.id GROUP BY n.id"
        );
        if (results.length && results[0].values.length) {
            for (const row of results[0].values) {
                const flds = String(row[0]);
                const parts = flds.split("\x1f");
                const question = stripHtml(parts[0] || "");
                const answer = stripHtml(parts[1] || "");
                if (question && answer) {
                    cards.push({ question, answer });
                }
            }
        }
    }

    return cards;
}

/**
 * Parse an .apkg file and return an array of { question, answer }.
 *
 * Supports multiple Anki export formats:
 * - Legacy: collection.anki2 (SQLite)
 * - Newer: collection.anki21 (SQLite)
 * - Modern (2.1.50+): may contain multiple .sqlite files or data directory
 */
export async function parseApkg(file: File): Promise<ParsedCard[]> {
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
    });

    // list all files in the archive for debugging
    const fileNames = Object.keys(zip.files);
    console.log("[apkg] files in archive:", fileNames);

    // strategy 1: classic database files
    const dbCandidates = [
        "collection.anki2",
        "collection.anki21",
    ];

    for (const name of dbCandidates) {
        const entry = zip.file(name);
        if (entry) {
            const dbBuf = await entry.async("arraybuffer");
            const db = new SQL.Database(new Uint8Array(dbBuf));
            try {
                const cards = extractCardsFromDb(db);
                if (cards.length > 0) return cards;
            } finally {
                db.close();
            }
        }
    }

    // strategy 2: modern format — try any .sqlite file in the archive
    const sqliteFiles = fileNames.filter(
        (n) => n.endsWith(".sqlite") || n.endsWith(".sqlite3") || n.endsWith(".db")
    );
    for (const name of sqliteFiles) {
        const entry = zip.file(name);
        if (entry) {
            const dbBuf = await entry.async("arraybuffer");
            const db = new SQL.Database(new Uint8Array(dbBuf));
            try {
                const cards = extractCardsFromDb(db);
                if (cards.length > 0) return cards;
            } finally {
                db.close();
            }
        }
    }

    // strategy 3: brute-force — try every file that isn't media
    for (const name of fileNames) {
        if (name === "media" || name.match(/^\d+$/) || name.endsWith(".json")) continue;
        if (dbCandidates.includes(name) || sqliteFiles.includes(name)) continue;

        const entry = zip.file(name);
        if (!entry || entry.dir) continue;

        try {
            const dbBuf = await entry.async("arraybuffer");
            // quick check: SQLite files start with "SQLite format 3"
            const header = new Uint8Array(dbBuf.slice(0, 16));
            const headerStr = new TextDecoder().decode(header);
            if (!headerStr.startsWith("SQLite format 3")) continue;

            const db = new SQL.Database(new Uint8Array(dbBuf));
            try {
                const cards = extractCardsFromDb(db);
                if (cards.length > 0) return cards;
            } finally {
                db.close();
            }
        } catch {
            // not a valid sqlite file, skip
        }
    }

    console.warn("[apkg] no cards found in any database within the archive");
    return [];
}
