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
        .filter((part) => part !== '' && part.replace(/<[^>]+>/g, '').trim() !== '');
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
