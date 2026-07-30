import { BODY_WIDTH, DEFAULT_BODY_BACKGROUND, HOUSE_ATTRIBUTES } from './theme';

export interface MailBuilderStarter {
    id: string;
    name: string;
    description: string;
    mjml: string;
}

/**
 * Placeholder image, embedded rather than linked.
 *
 * A hosted placeholder service would not just sit in the editor — it would
 * ship to the recipient's inbox if nobody swaps the image, handing a third
 * party a read receipt. This is a plain grey box, 122 characters, no request.
 */
const PLACEHOLDER_IMAGE =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAIAAABxZ0isAAAAEUlEQVR42mM4ffUhVsQwkBIANJN4MX0x2HIAAAAASUVORK5CYII=';

/**
 * Every tag is closed explicitly. Self-closing MJML is parsed as an *open* tag
 * by the HTML parser and swallows its siblings — see `useXmlParser` in
 * editor.ts for the same trap on the import side.
 */
function wrap(sections: string): string {
    return `<mjml>
  <mj-head>
    <mj-preview></mj-preview>
    ${HOUSE_ATTRIBUTES}
  </mj-head>
  <mj-body width="${BODY_WIDTH}" background-color="${DEFAULT_BODY_BACKGROUND}">
${sections}
  </mj-body>
</mjml>`;
}

const HEADER_BAR = `    <mj-section background-color="#0f766e" padding="18px 24px">
      <mj-column>
        <mj-text color="#ffffff" font-size="18px" font-weight="bold">{{ brand_name }}</mj-text>
      </mj-column>
    </mj-section>`;

const SIGNATURE = `    <mj-section background-color="#ffffff" padding="0 24px 24px 24px">
      <mj-column>
        <mj-divider border-color="#e2e8f0" border-width="1px"></mj-divider>
        <mj-text font-size="13px" color="#64748b">{{ brand_signature }}</mj-text>
      </mj-column>
    </mj-section>`;

/**
 * Offered when a template has no design yet. Deliberately few and short —
 * a long gallery means people scroll instead of starting, and every block
 * they have to delete is friction.
 */
export const STARTERS: MailBuilderStarter[] = [
    {
        id: 'blank',
        name: 'Leer',
        description: 'Nur eine weiße Fläche zum Selbstbauen.',
        mjml: wrap(`    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-text>Hallo {{ contact_first_name }},</mj-text>
      </mj-column>
    </mj-section>`),
    },
    {
        id: 'plain-message',
        name: 'Einfache Nachricht',
        description: 'Anrede, Text und Signatur — für persönlich wirkende Erstansprachen.',
        mjml: wrap(`    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-text>Hallo {{ contact_first_name }},</mj-text>
        <mj-text>kurz zu {{ company_name }}: [hier Ihr Anliegen in ein, zwei Sätzen].</mj-text>
        <mj-text>Hätten Sie diese Woche 15 Minuten Zeit für ein kurzes Gespräch?</mj-text>
      </mj-column>
    </mj-section>
${SIGNATURE}`),
    },
    {
        id: 'header-cta',
        name: 'Kopfbereich mit Button',
        description: 'Farbiger Kopf, Fließtext und ein Handlungsaufruf.',
        mjml: wrap(`${HEADER_BAR}
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold">Hallo {{ contact_first_name }},</mj-text>
        <mj-text>[Ihr Anliegen in zwei bis drei Sätzen — was hat {{ company_name }} davon?]</mj-text>
        <mj-button background-color="#0f766e" color="#ffffff" href="https://">Termin vereinbaren</mj-button>
      </mj-column>
    </mj-section>
${SIGNATURE}`),
    },
    {
        id: 'two-column',
        name: 'Zweispaltig',
        description: 'Text neben Bild — für Angebote mit einem visuellen Anker.',
        mjml: wrap(`${HEADER_BAR}
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column width="55%">
        <mj-text font-size="18px" font-weight="bold">Hallo {{ contact_first_name }},</mj-text>
        <mj-text>[Kurzer Absatz zu Ihrem Angebot für {{ company_name }}.]</mj-text>
        <mj-button background-color="#0f766e" color="#ffffff" href="https://" align="left">Mehr erfahren</mj-button>
      </mj-column>
      <mj-column width="45%">
        <mj-image src="${PLACEHOLDER_IMAGE}" alt="Bild ersetzen" width="260px"></mj-image>
      </mj-column>
    </mj-section>
${SIGNATURE}`),
    },
];

export function findStarter(id: string): MailBuilderStarter | undefined {
    return STARTERS.find((starter) => starter.id === id);
}

/** Fallbacks used by the editor when no starter is picked. */
export const DEFAULT_STARTER_ID = 'plain-message';

export { extractPreheader, setPreheaderIn } from './preheader';
export { ensureHouseDefaults, HOUSE_ATTRIBUTES, HOUSE_RULES } from './theme';
export { stripNoOpDeclarations } from './cleanup';
export { mjmlFromProse } from './prose';
export type { ProseToMjmlOptions } from './prose';
