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
export const HOUSE_ATTRIBUTES =
    '<mj-attributes>' +
    `<mj-all font-family="${DEFAULT_FONT}"></mj-all>` +
    `<mj-text font-size="15px" line-height="1.5" color="${DEFAULT_TEXT_COLOR}"></mj-text>` +
    // border-radius="0": MJML rundet Buttons per Default mit 3px ab. Regel 4 des
    // Peppermint-Standards verbietet border-radius — Outlooks Word-Engine
    // ignoriert es ohnehin, sodass die Ecken je Client unterschiedlich
    // aussehen. Eckig ist überall gleich.
    `<mj-button font-family="${DEFAULT_FONT}" border-radius="0"></mj-button>` +
    '</mj-attributes>';

/**
 * Guarantees the web-safe font block is present. Idempotent — a design that
 * already declares its own `mj-attributes` is left alone.
 */
export function ensureHouseDefaults(mjml: string): string {
    if (mjml.includes('<mj-attributes')) {
        return mjml;
    }

    if (mjml.includes('<mj-head>')) {
        return mjml.replace('<mj-head>', `<mj-head>${HOUSE_ATTRIBUTES}`);
    }

    return mjml.replace('<mj-body', `<mj-head>${HOUSE_ATTRIBUTES}</mj-head><mj-body`);
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
