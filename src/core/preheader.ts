/**
 * Der Preheader — die versteckte Zeile, die Postfächer neben dem Betreff in der
 * Nachrichtenliste anzeigen.
 *
 * Ohne ihn zeigt die Vorschau den Anfang des Fließtexts, was bei einem Design
 * mit Kopfbereich gern die Bildbeschreibung oder eine Leerzeile ist. Regel 8
 * des Peppermint-Standards für bulletproof Mails.
 *
 * MJML rendert `mj-preview` als versteckten Block am Body-Anfang. Anders als
 * `mj-attributes` übersteht der Knoten den GrapesJS-Rundlauf, wird hier aber
 * beim Auslesen ohnehin deterministisch neu geschrieben.
 */
const PREVIEW_PATTERN = /<mj-preview\b[^>]*>([\s\S]*?)<\/mj-preview>/i;

/** Liest den Preheader aus einer MJML-Quelle. Leerer String, wenn keiner da ist. */
export function extractPreheader(mjml: string): string {
    return PREVIEW_PATTERN.exec(mjml)?.[1]?.trim() ?? '';
}

/**
 * Schreibt den Preheader in eine MJML-Quelle.
 *
 * Fehlt der `mj-preview`-Knoten, wird er im Kopfbereich angelegt; fehlt auch
 * der Kopfbereich, entsteht er mit.
 */
export function setPreheaderIn(mjml: string, text: string): string {
    const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const node = `<mj-preview>${escaped}</mj-preview>`;

    if (PREVIEW_PATTERN.test(mjml)) {
        return mjml.replace(PREVIEW_PATTERN, node);
    }

    if (mjml.includes('<mj-head>')) {
        return mjml.replace('<mj-head>', `<mj-head>${node}`);
    }

    return mjml.replace('<mj-body', `<mj-head>${node}</mj-head><mj-body`);
}
