export { createMailBuilder } from './editor';
export { de, en, locales } from './i18n';
export {
    BODY_WIDTH,
    BRAND_COLORS,
    DEFAULT_BODY_BACKGROUND,
    DEFAULT_FONT,
    DEFAULT_TEXT_COLOR,
    ensureHouseDefaults,
    FONT_STACKS,
    HOUSE_ATTRIBUTES,
    STARTER_MJML,
} from './theme';
export { insertVariable, normalizeVariables, tokenFor } from './variables';
export type {
    MailBuilderError,
    MailBuilderHtml,
    MailBuilderInstance,
    MailBuilderOptions,
    MailBuilderVariable,
} from './types';
