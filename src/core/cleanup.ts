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

/**
 * Die Vorschauzeile, die MJML aus `<mj-preview>` erzeugt, versteckt sich mit
 * sieben Eigenschaften gleichzeitig:
 *
 *   display:none; font-size:1px; color:…; line-height:1px;
 *   max-height:0px; max-width:0px; opacity:0; overflow:hidden;
 *
 * `display:none` verbirgt sie; `max-height:0` und `overflow:hidden` sind die
 * Rückfallebene für Programme, die `display:none` ignorieren. `opacity:0` und
 * `max-width:0` tragen darüber hinaus nichts bei — ein Element ohne Höhe und
 * mit verstecktem Überlauf ist bereits unsichtbar.
 *
 * `opacity` wird von 37 % der Mailprogramme nicht unterstützt und ist damit
 * der größte einzelne Posten im caniemail-Check. Gemessen an einer echten
 * Belegmail: 85,3 % → 89,6 %.
 *
 * Bewusst doppelt eng gefasst: nur innerhalb eines `style`-Attributs, das
 * selbst `display:none` enthält, und nur bei exakt dem Wert null. Ein
 * `opacity:0` an anderer Stelle könnte Absicht sein — hier verbirgt schon
 * `display:none`, es ist also nachweislich wirkungslos.
 */
const VERSTECKTES_ELEMENT = /style="([^"]*display\s*:\s*none[^"]*)"/gi;
const UEBERFLUESSIGES_VERSTECKEN = /\s*(?:opacity\s*:\s*0(?:\.0+)?|max-width\s*:\s*0(?:px|%)?)\s*;/gi;

export function stripNoOpDeclarations(html: string): string {
    return html
        .replace(NO_OP_DECLARATIONS, '')
        .replace(WORD_BREAK, 'word-wrap:break-word')
        .replace(VERSTECKTES_ELEMENT, (_treffer, stile: string) => `style="${stile.replace(UEBERFLUESSIGES_VERSTECKEN, '')}"`);
}
