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
 * Blank starter shown when a template has no design yet. Deliberately minimal:
 * a preheader, one section, one text block. Anything more and users delete
 * more than they build.
 */
export const STARTER_MJML = `<mjml>
  <mj-head>
    <mj-preview></mj-preview>
    <mj-attributes>
      <mj-all font-family="${DEFAULT_FONT}" />
      <mj-text font-size="15px" line-height="1.5" color="${DEFAULT_TEXT_COLOR}" />
      <mj-section padding="0px" />
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
