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
    // replace <br> / <br/> / <div> with newlines
    let text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?(div|p)[^>]*>/gi, "\n");
    // remove all other tags
    text = text.replace(/<[^>]+>/g, "");
    // decode common HTML entities
    text = text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
    // collapse whitespace
    return text.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Parse an .apkg file and return an array of { question, answer }.
 */
export async function parseApkg(file: File): Promise<ParsedCard[]> {
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    // find the sqlite database — could be "collection.anki2" or "collection.anki21"
    const dbEntry =
        zip.file("collection.anki2") ??
        zip.file("collection.anki21");

    if (!dbEntry) {
        throw new Error("Invalid .apkg file: no database found");
    }

    const dbBuf = await dbEntry.async("arraybuffer");

    // load sql.js with the CDN-hosted wasm file
    const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
    });

    const db: Database = new SQL.Database(new Uint8Array(dbBuf));

    try {
        const results = db.exec("SELECT flds FROM notes");

        if (!results.length || !results[0].values.length) {
            return [];
        }

        const cards: ParsedCard[] = [];

        for (const row of results[0].values) {
            const flds = String(row[0]);
            // Anki separates fields with \x1f (unit separator)
            const parts = flds.split("\x1f");

            const question = stripHtml(parts[0] || "");
            const answer = stripHtml(parts[1] || "");

            if (question && answer) {
                cards.push({ question, answer });
            }
        }

        return cards;
    } finally {
        db.close();
    }
}
