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
/**
 * Erfasst beide Schreibweisen: `<mj-preview>Text</mj-preview>` und die
 * selbstschließende `<mj-preview/>`.
 *
 * GrapesJS serialisiert einen leeren Knoten selbstschließend. Ein Muster, das
 * nur die Paarform kennt, findet ihn dann nicht — `setPreheaderIn` legt einen
 * zweiten an, und **MJML nimmt den letzten**. Ergebnis: eine Mail ganz ohne
 * Vorschauzeile, obwohl im Formular eine steht. Genau so ist es passiert.
 */
const PREVIEW_PATTERN = /<mj-preview\b[^>]*(?:\/>|>([\s\S]*?)<\/mj-preview>)/i;
const PREVIEW_PATTERN_ALL = new RegExp(PREVIEW_PATTERN.source, 'gi');

/** Liest den Preheader aus einer MJML-Quelle. Leerer String, wenn keiner da ist. */
export function extractPreheader(mjml: string): string {
    // Den letzten nicht-leeren Knoten nehmen: MJML wertet ebenfalls den letzten
    // aus, und in einem beschädigten Dokument steht der gefüllte womöglich
    // vor einem leeren.
    let gefunden = '';

    for (const treffer of mjml.matchAll(PREVIEW_PATTERN_ALL)) {
        const inhalt = treffer[1]?.trim() ?? '';

        if (inhalt !== '') {
            gefunden = inhalt;
        }
    }

    return gefunden;
}

/**
 * Schreibt den Preheader in eine MJML-Quelle.
 *
 * Entfernt **alle** vorhandenen `mj-preview`-Knoten und setzt genau einen neu.
 * Das repariert nebenbei Dokumente, in denen durch den Fehler oben schon zwei
 * gelandet sind.
 *
 * Fehlt der Kopfbereich, entsteht er mit.
 */
export function setPreheaderIn(mjml: string, text: string): string {
    const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const node = `<mj-preview>${escaped}</mj-preview>`;

    const bereinigt = mjml.replace(PREVIEW_PATTERN_ALL, '');

    if (bereinigt.includes('<mj-head>')) {
        return bereinigt.replace('<mj-head>', `<mj-head>${node}`);
    }

    return bereinigt.replace('<mj-body', `<mj-head>${node}</mj-head><mj-body`);
}
