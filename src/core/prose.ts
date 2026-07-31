import { HOUSE_ATTRIBUTES } from './theme';

/**
 * Verwandelt Fließtext-HTML in ein MJML-Design.
 *
 * Der KI-Erstkontaktvorschlag liefert Prosa als HTML (Absätze, Fettung, Links)
 * — kein MJML. Damit er im Baukasten landen kann, wird jeder Absatz zu einem
 * eigenen `mj-text`-Block. Einzelne Blöcke statt einem großen, weil sie sich so
 * verschieben, löschen und einzeln umformatieren lassen; ein Block wäre im
 * Baukasten ein unteilbarer Klotz.
 *
 * `mj-text` erlaubt Inline-HTML, die Auszeichnung der KI bleibt also erhalten.
 */

/** Zerlegt an Absatzgrenzen — `<p>`, `<div>`, `<br><br>` oder Leerzeilen. */
function splitIntoParagraphs(html: string): string[] {
    const normalised = html
        .replace(/<\/(?:p|div|h[1-6])\s*>/gi, '\n\n')
        .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n')
        .replace(/<(?:p|div|h[1-6])\b[^>]*>/gi, '');

    return normalised
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter((part) => part !== '' && part.replace(/<[^>]+>/g, '').trim() !== '')
        // Einzelne Zeilenumbrüche innerhalb eines Absatzes bleiben bedeutungstragend
        // — Adressblöcke und Signaturen leben davon. HTML würde sie zu Leerzeichen
        // zusammenfalten, deshalb hier explizit.
        //
        // Selbstschließend, nicht `<br>`: MJML wird als XML geparst. Ein offenes
        // `<br>` bricht das Dokument an Ort und Stelle ab — der Baukasten zeigte
        // statt der Vorlage „Opening and ending tag mismatch: br and mj-text"
        // (aufgefallen im CRM, 2026-07-30, bei jedem KI-Vorschlag aus Prosa).
        .map((part) => part.replace(/\n/g, '<br />'))
        .map(makeXmlSafe);
}

/**
 * Auszeichnung, die ein Absatz behalten darf. Alles andere ist im Fließtext
 * einer Mail entweder sinnlos oder gefährlich.
 */
const ERLAUBTE_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'a', 'span', 'br'];

const ERLAUBTES_TAG = new RegExp(`^</?(?:${ERLAUBTE_TAGS.join('|')})\\b[^<>]*/?>$`, 'i');

/**
 * Macht einen Absatz XML-tauglich, ohne die gewollte Auszeichnung zu verlieren.
 *
 * `mj-text` **soll** Inline-HTML tragen (fett, kursiv, Links) — blankes Escapen
 * wäre der falsche Ausweg. Zugleich wird MJML als **XML** geparst: ein einziges
 * fremdes oder offenes Tag reißt das ganze Dokument mit, und der Baukasten zeigt
 * statt der Vorlage einen Parserfehler.
 *
 * Beides zusammen geht nur über eine Positivliste: Was drauf steht, bleibt
 * Markup; alles andere wird zu sichtbarem Text. Ein Fließtext kann das Dokument
 * damit nicht mehr sprengen — im schlimmsten Fall sieht man Zeichen statt
 * Layout, und das ist reparierbar.
 *
 * Anlass: Ein KI-Vorschlag geriet als JSON-Blob mit `<mjml>`-Markup in diesen
 * Pfad; MJML brach mit „nicht wohlgeformt" ab (CRM-Bug #503, 2026-07-31). Zuvor
 * schon derselbe Fehler in klein mit offenem `<br>` (2026-07-30) — damals wurde
 * das Symptom behoben, nicht die Klasse.
 */
function makeXmlSafe(paragraph: string): string {
    // Erst die erlaubten Tags herausnehmen und merken, dann den verbleibenden
    // Text maskieren. Andersherum würde das Maskieren die Auszeichnung mitnehmen.
    //
    // Die Marke ist ein NUL-Byte: In Fließtext kommt es nicht vor. Eine blosse
    // Nummer („ 3 “) wäre fatal — „15 bis 20 Minuten“ würde beim Zurücksetzen
    // zerschossen.
    const platzhalter: string[] = [];
    const MARKE = '\u0000';

    const mitPlatzhaltern = paragraph.replace(/<[^<>]*>/g, (tag) => {
        if (! ERLAUBTES_TAG.test(tag)) {
            // Fremdes Tag: bleibt als Text stehen, wird unten mitmaskiert.
            return tag;
        }

        // Void-Elemente selbstschließend, sonst fehlt XML das Gegenstück.
        const normalisiert = /^<br\b/i.test(tag) ? '<br />' : tag;

        platzhalter.push(normalisiert);

        return `${MARKE}${platzhalter.length - 1}${MARKE}`;
    });

    const maskiert = mitPlatzhaltern
        // Bares `&` kodieren, bereits kodierte Entities in Ruhe lassen.
        .replace(/&(?!#?[a-z0-9]+;)/gi, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return maskiert.replace(
        new RegExp(`${MARKE}(\\d+)${MARKE}`, 'g'),
        (_treffer, index) => platzhalter[Number(index)],
    );
}

export interface ProseToMjmlOptions {
    preheader?: string;
    bodyWidth?: string;
    bodyBackground?: string;
    sectionBackground?: string;
}

export function mjmlFromProse(html: string, options: ProseToMjmlOptions = {}): string {
    const {
        preheader = '',
        bodyWidth = '600px',
        bodyBackground = '#f1f5f9',
        sectionBackground = '#ffffff',
    } = options;

    const paragraphs = splitIntoParagraphs(html);
    const blocks = (paragraphs.length > 0 ? paragraphs : [''])
        .map((paragraph) => `        <mj-text>${paragraph}</mj-text>`)
        .join('\n');

    return `<mjml>
  <mj-head>
    <mj-preview>${preheader.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</mj-preview>
    ${HOUSE_ATTRIBUTES}
  </mj-head>
  <mj-body width="${bodyWidth}" background-color="${bodyBackground}">
    <mj-section background-color="${sectionBackground}" padding="24px">
      <mj-column>
${blocks}
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
}
