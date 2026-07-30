/**
 * Defaults that keep generated mails inside the bulletproof HTML standard:
 * 600px body width, web-safe font stack, light colour scheme, no gradients or
 * shadows. See the Peppermint wiki article "E-Mail-Template-Standard".
 */

/** Peppermint brand swatches offered in every colour picker. */
export const BRAND_COLORS = [
    '#0f766e',
    '#14b8a6',
    '#5eead4',
    '#0f172a',
    '#334155',
    '#64748b',
    '#e2e8f0',
    '#f8fafc',
    '#ffffff',
    '#b91c1c',
    '#c2410c',
    '#a16207',
];

/**
 * Web-safe stacks only. OS-specific stacks (`-apple-system`) render
 * differently on Mac and Windows, which is exactly what we do not want.
 */
export const FONT_STACKS = [
    { value: 'Arial, Helvetica, sans-serif', name: 'Arial' },
    { value: 'Helvetica, Arial, sans-serif', name: 'Helvetica' },
    { value: 'Georgia, "Times New Roman", serif', name: 'Georgia' },
    { value: '"Times New Roman", Times, serif', name: 'Times New Roman' },
    { value: 'Verdana, Geneva, sans-serif', name: 'Verdana' },
    { value: 'Tahoma, Verdana, sans-serif', name: 'Tahoma' },
    { value: '"Trebuchet MS", Helvetica, sans-serif', name: 'Trebuchet MS' },
    { value: '"Courier New", Courier, monospace', name: 'Courier New' },
];

export const BODY_WIDTH = '600px';
export const DEFAULT_FONT = 'Arial, Helvetica, sans-serif';
export const DEFAULT_TEXT_COLOR = '#334155';
export const DEFAULT_BODY_BACKGROUND = '#f1f5f9';

/**
 * The house defaults every design must carry.
 *
 * GrapesJS does not round-trip `mj-attributes` — it parses the design into
 * components and the head block is gone on the way back out. Without it MJML
 * falls back to its own default font (Ubuntu) and injects a Google Fonts
 * `<link>` plus an `@import`, both of which a majority of mail clients drop.
 * That is a direct hit on the bulletproof standard, so the block is re-applied
 * on every read (see `ensureHouseDefaults`).
 */
/**
 * Die Hausregeln, einzeln nach Tag. Einzeln, weil ein Design nachträglich um
 * eine fehlende Regel ergänzt werden muss — siehe `ensureHouseDefaults`.
 */
export const HOUSE_RULES: ReadonlyArray<readonly [tag: string, rule: string]> = [
    ['mj-all', `<mj-all font-family="${DEFAULT_FONT}"></mj-all>`],
    ['mj-text', `<mj-text font-size="15px" line-height="1.5" color="${DEFAULT_TEXT_COLOR}"></mj-text>`],
    // border-radius="0": MJML rundet Buttons per Default mit 3px ab. Regel 4 des
    // Peppermint-Standards verbietet border-radius — Outlooks Word-Engine
    // ignoriert es ohnehin, sodass die Ecken je Client unterschiedlich
    // aussehen. Eckig ist überall gleich.
    ['mj-button', `<mj-button font-family="${DEFAULT_FONT}" border-radius="0"></mj-button>`],
];

export const HOUSE_ATTRIBUTES = `<mj-attributes>${HOUSE_RULES.map(([, rule]) => rule).join('')}</mj-attributes>`;

const ATTRIBUTES_BLOCK = /<mj-attributes\b[^>]*>([\s\S]*?)<\/mj-attributes>/i;

/**
 * Stellt sicher, dass die Hausregeln im Design stehen — in ihrer **aktuellen**
 * Fassung.
 *
 * Jede Regel wird ersetzt, wenn ihr Tag schon im Block steht, und sonst
 * ergänzt. Nur auf Existenz zu prüfen reicht nicht: Bestandsdesigns trugen
 * bereits ein `<mj-button font-family="…">` aus einer früheren Fassung, und ein
 * später hinzugefügtes `border-radius="0"` wäre nie angekommen. Genau daran ist
 * dieser Code zweimal gescheitert.
 *
 * Der Block gehört uns — es gibt keine Oberfläche, in der jemand
 * `mj-attributes` von Hand pflegt. Deshalb dürfen unsere Regeln gewinnen.
 * Fremde Regeln mit anderen Tags bleiben erhalten.
 */
export function ensureHouseDefaults(mjml: string): string {
    const block = ATTRIBUTES_BLOCK.exec(mjml);

    if (block === null) {
        return mjml.includes('<mj-head>')
            ? mjml.replace('<mj-head>', `<mj-head>${HOUSE_ATTRIBUTES}`)
            : mjml.replace('<mj-body', `<mj-head>${HOUSE_ATTRIBUTES}</mj-head><mj-body`);
    }

    let inhalt = block[1];

    for (const [tag, rule] of HOUSE_RULES) {
        const vorhanden = new RegExp(`<${tag}\\b[^>]*>(?:[\\s\\S]*?</${tag}>)?`, 'i');

        inhalt = vorhanden.test(inhalt) ? inhalt.replace(vorhanden, rule) : rule + inhalt;
    }

    return mjml.replace(block[0], `<mj-attributes>${inhalt}</mj-attributes>`);
}

/**
 * Blank starter shown when a template has no design yet. Deliberately minimal:
 * a preheader, one section, one text block. Anything more and users delete
 * more than they build.
 *
 * Every tag is closed explicitly. Self-closing MJML (`<mj-all … />`) is read by
 * the HTML parser as an *open* tag, so everything that follows ends up nested
 * inside it — silently, in the case of `mj-attributes`.
 */
export const STARTER_MJML = `<mjml>
  <mj-head>
    <mj-preview></mj-preview>
    <mj-attributes>
      <mj-all font-family="${DEFAULT_FONT}"></mj-all>
      <mj-text font-size="15px" line-height="1.5" color="${DEFAULT_TEXT_COLOR}"></mj-text>
      <mj-section padding="0px"></mj-section>
    </mj-attributes>
  </mj-head>
  <mj-body width="${BODY_WIDTH}" background-color="${DEFAULT_BODY_BACKGROUND}">
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-text>Hallo {{ contact_first_name }},</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
