import JSZip from "jszip";
import initSqlJs, { type Database } from "sql.js";
import { decompress } from "fzstd";

export interface ParsedCard {
    question: string;
    answer: string;
}

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

function getSqliteDb(buf: ArrayBuffer, SQL: any): Database {
    let uint8: Uint8Array = new Uint8Array(buf);
    if (uint8.length >= 4) {
        const magic = new DataView(buf).getUint32(0, true);
        if (magic === 0xFD2FB528) {
            uint8 = decompress(uint8);
        }
    }
    return new SQL.Database(uint8);
}

function extractCardsFromDb(db: Database): ParsedCard[] {
    const cards: ParsedCard[] = [];

    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = tables.length ? tables[0].values.map((r) => String(r[0])) : [];

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

export async function parseApkg(file: File): Promise<ParsedCard[]> {
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
    });

    const fileNames = Object.keys(zip.files);

    const dbCandidates = [
        "collection.anki21b",
        "collection.anki21",
        "collection.anki2",
    ];

    for (const name of dbCandidates) {
        const entry = zip.file(name);
        if (entry) {
            const dbBuf = await entry.async("arraybuffer");
            const db = getSqliteDb(dbBuf, SQL);
            try {
                const cards = extractCardsFromDb(db);
                if (cards.length > 0) return cards;
            } finally {
                db.close();
            }
        }
    }

    const sqliteFiles = fileNames.filter(
        (n) => n.endsWith(".sqlite") || n.endsWith(".sqlite3") || n.endsWith(".db")
    );
    for (const name of sqliteFiles) {
        const entry = zip.file(name);
        if (entry) {
            const dbBuf = await entry.async("arraybuffer");
            const db = getSqliteDb(dbBuf, SQL);
            try {
                const cards = extractCardsFromDb(db);
                if (cards.length > 0) return cards;
            } finally {
                db.close();
            }
        }
    }

    for (const name of fileNames) {
        if (name === "media" || name.match(/^\d+$/) || name.endsWith(".json")) continue;
        if (dbCandidates.includes(name) || sqliteFiles.includes(name)) continue;

        const entry = zip.file(name);
        if (!entry || entry.dir) continue;

        try {
            const dbBuf = await entry.async("arraybuffer");
            const db = getSqliteDb(dbBuf, SQL);
            try {
                const cards = extractCardsFromDb(db);
                if (cards.length > 0) return cards;
            } finally {
                if (db && typeof db.close === "function") db.close();
            }
        } catch {
        }
    }

    return [];
}
