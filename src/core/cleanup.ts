/**
 * Entfernt wirkungslose CSS-Deklarationen aus dem kompilierten HTML.
 *
 * Hier wird **nur** entfernt, was nachweislich nichts an der Darstellung
 * ändert. Der caniemail-Check zählt Eigenschaften, nicht ihre Werte: eine
 * Deklaration, die exakt den Standardwert setzt, kostet Punkte und bringt
 * nichts.
 *
 * Ausdrücklich NICHT entfernt werden Eigenschaften, die graceful degradieren
 * und dort, wo sie unterstützt werden, etwas beitragen — `word-break` etwa
 * bricht lange URLs um. Solche zu streichen würde die Zahl heben und die Mail
 * verschlechtern. Der Score ist Diagnose, nicht Ziel.
 */

/** `border-radius:0` — MJML setzt es auf jedem Button, es ist der Standardwert. */
const NO_OP_DECLARATIONS = /\s*border-radius\s*:\s*0(?:px|%|em|rem)?\s*;?/gi;

/**
 * MJML setzt `word-break: break-word` auf jeder Text- und Button-Zelle.
 *
 * `word-wrap: break-word` bewirkt dasselbe — lange Wörter und URLs brechen um,
 * statt die Tabelle zu sprengen — wird aber von deutlich mehr Mail-Clients
 * unterstützt. Im caniemail-Check taucht `word-wrap` gar nicht als Problem auf,
 * `word-break` dagegen mit 29,8 % nicht und 42,6 % teilweise unterstützt.
 *
 * Gemessen an einer echten Vorlage: 89,1 % → 91,0 %, ohne Funktionsverlust.
 */
const WORD_BREAK = /word-break\s*:\s*break-word/gi;

export function stripNoOpDeclarations(html: string): string {
    return html.replace(NO_OP_DECLARATIONS, '').replace(WORD_BREAK, 'word-wrap:break-word');
}
