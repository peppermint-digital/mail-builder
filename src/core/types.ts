import type { Editor } from 'grapesjs';

/**
 * A placeholder the host application can substitute at render time, e.g.
 * `{{ contact_first_name }}`. The builder only ever inserts the token — the
 * actual replacement happens server-side (see the Laravel package's
 * PlaceholderRenderer).
 */
export interface MailBuilderVariable {
    /** Token name without braces, e.g. `contact_first_name`. */
    key: string;
    /** Human readable label shown in the insert menu. */
    label: string;
    /** Optional sample value used by the preview. */
    sample?: string;
}

/** Result of compiling the current design to email HTML. */
export interface MailBuilderHtml {
    html: string;
    errors: MailBuilderError[];
}

export interface MailBuilderError {
    line?: number;
    message: string;
    tagName?: string;
}

export interface MailBuilderOptions {
    /** Element the editor mounts into. */
    container: HTMLElement;
    /** Initial MJML source. Falls back to a blank branded starter template. */
    mjml?: string;
    /**
     * Placeholders offered in the insert menu. Accepts either the rich array
     * form or a plain `{ key: label }` map (which is what the CRM's
     * `MailTemplate::STANDARD_VARIABLES` looks like).
     */
    variables?: MailBuilderVariable[] | Record<string, string>;
    /**
     * Called when the user picks or drops an image. Must resolve to a publicly
     * reachable URL. Without it, the image tools fall back to URL entry only.
     */
    onUploadImage?: (file: File) => Promise<string>;
    /** Fired on every design change (debounced by GrapesJS itself). */
    onChange?: (state: { mjml: string }) => void;
    /** Fired once the editor is interactive. */
    onReady?: (instance: MailBuilderInstance) => void;
    theme?: 'light' | 'dark';
    /** Swatches offered in every colour picker. Defaults to the Peppermint palette. */
    brandColors?: string[];
    /**
     * Web fonts to declare in the exported HTML head.
     * Keep this empty unless you accept the deliverability trade-off — the
     * bulletproof standard calls for web-safe stacks.
     */
    fonts?: Record<string, string>;
    /** BCP-47-ish locale key. Only `de` and `en` ship with translations. */
    locale?: string;
    /** Extra GrapesJS config merged over the defaults. Escape hatch. */
    grapesConfig?: Record<string, unknown>;
}

export interface MailBuilderInstance {
    /** Current design as MJML source — this is what you persist. */
    getMjml(): string;
    /** Compile the current design to email HTML. */
    getHtml(): MailBuilderHtml;
    /** Replace the whole design. */
    loadMjml(mjml: string): void;
    /** True when the body has no content blocks yet. */
    isEmpty(): boolean;
    /** Insert a `{{ token }}` at the current cursor position. */
    insertVariable(key: string): void;
    /** Tear down the editor and free listeners. */
    destroy(): void;
    /** Underlying GrapesJS editor. Use sparingly. */
    readonly editor: Editor;
}
