import grapesjs from 'grapesjs';
import mjmlPlugin from 'grapesjs-mjml';

import { locales } from './i18n';
import { BRAND_COLORS, FONT_STACKS, STARTER_MJML } from './theme';
import type { MailBuilderHtml, MailBuilderInstance, MailBuilderOptions } from './types';
import { insertVariable, normalizeVariables, registerVariablesRteAction } from './variables';

/** Blocks we expose, in the order they appear in the sidebar. */
const BLOCKS = [
    'mj-1-column',
    'mj-2-columns',
    'mj-3-columns',
    'mj-text',
    'mj-button',
    'mj-image',
    'mj-divider',
    'mj-spacer',
    'mj-social-group',
    'mj-navbar',
    'mj-hero',
    'mj-table',
    'mj-raw',
];

type MjmlPluginFn = (editor: unknown, options?: Record<string, unknown>) => void;

/**
 * `grapesjs-mjml` ships as UMD, so depending on who does the bundling the
 * import is either the function itself or a namespace holding it under
 * `default`. Passing the reference straight to GrapesJS hid this; calling it
 * ourselves does not.
 */
function resolveMjmlPlugin(): MjmlPluginFn {
    const candidate = mjmlPlugin as unknown as MjmlPluginFn & { default?: MjmlPluginFn };

    if (typeof candidate === 'function') {
        return candidate;
    }

    if (typeof candidate?.default === 'function') {
        return candidate.default;
    }

    throw new Error('grapesjs-mjml konnte nicht geladen werden.');
}

type MjmlCompileResult = {
    html?: string;
    errors?: Array<{ line?: number; message?: string; formattedMessage?: string; tagName?: string }>;
};

export function createMailBuilder(options: MailBuilderOptions): MailBuilderInstance {
    const {
        container,
        mjml,
        variables,
        onUploadImage,
        onChange,
        onReady,
        theme = 'light',
        brandColors = BRAND_COLORS,
        fonts = {},
        locale = 'de',
        grapesConfig = {},
    } = options;

    const normalizedVariables = normalizeVariables(variables);

    container.classList.add('pm-mail-builder', `pm-mail-builder--${theme}`);

    const editor = grapesjs.init({
        container,
        height: '100%',
        width: 'auto',
        fromElement: false,
        // The host app owns persistence — we hand it MJML and it decides.
        storageManager: false,
        undoManager: { trackSelection: false },
        colorPicker: { palette: [brandColors] },
        assetManager: {
            // Custom handler below; GrapesJS' own upload endpoint stays off.
            upload: false,
            autoAdd: true,
            uploadFile: onUploadImage
                ? async (event: DragEvent): Promise<void> => {
                      // Either a drop onto the asset manager or a file input change.
                      const input = event.target as HTMLInputElement | null;
                      const files = event.dataTransfer?.files ?? input?.files;

                      if (!files?.length) {
                          return;
                      }

                      try {
                          const urls = await Promise.all(Array.from(files).map((file) => onUploadImage(file)));
                          editor.AssetManager.add(urls);
                      } catch (error: unknown) {
                          editor.log(
                              error instanceof Error ? error.message : 'Bild konnte nicht hochgeladen werden.',
                              { level: 'error' },
                          );
                      }
                  }
                : undefined,
        },
        // Locale has to be part of the init config: GrapesJS renders its panels
        // during init, so messages added afterwards arrive too late and the
        // buttons keep their English titles.
        i18n: {
            locale: locale in locales ? locale : 'en',
            messages: locales,
        },
        // Options are passed by calling the plugin ourselves. `pluginsOpts`
        // is keyed by plugin *name*; a function used as a key stringifies to
        // its own source and never matches, so the options were silently
        // dropped and the default block set showed up instead.
        plugins: [
            (instance) =>
                resolveMjmlPlugin()(instance, {
                    blocks: BLOCKS,
                    fonts,
                    useCustomTheme: false,
                }),
        ],
        ...grapesConfig,
    });

    // Web-safe stacks only — see the bulletproof standard.
    const typography = editor.StyleManager.getSector('typography');
    const fontProperty = typography?.getProperty('font-family');
    if (fontProperty) {
        fontProperty.set('options', FONT_STACKS);
    }

    registerVariablesRteAction(editor, normalizedVariables);

    const instance: MailBuilderInstance = {
        editor,

        getMjml(): string {
            return String(editor.Commands.run('mjml-code') ?? '');
        },

        getHtml(): MailBuilderHtml {
            const result = editor.Commands.run('mjml-code-to-html') as MjmlCompileResult | undefined;

            return {
                html: result?.html ?? '',
                errors: (result?.errors ?? []).map((error) => ({
                    line: error.line,
                    tagName: error.tagName,
                    message: error.formattedMessage ?? error.message ?? 'Unbekannter MJML-Fehler',
                })),
            };
        },

        loadMjml(source: string): void {
            // Mirrors the plugin's own import command: clear the wrapper first,
            // otherwise the new design is appended to the old one.
            editor.Components.getWrapper()?.set('content', '');
            editor.setComponents(source.trim());
            editor.UndoManager.clear();
        },

        isEmpty(): boolean {
            const body = editor.Components.getWrapper()?.components();

            return !body || body.length === 0;
        },

        insertVariable(key: string): void {
            insertVariable(editor, key);
        },

        destroy(): void {
            editor.destroy();
            container.classList.remove('pm-mail-builder', `pm-mail-builder--${theme}`);
        },
    };

    instance.loadMjml(mjml?.trim() ? mjml : STARTER_MJML);

    if (onChange) {
        editor.on('update', () => onChange({ mjml: instance.getMjml() }));
    }

    editor.onReady(() => onReady?.(instance));

    return instance;
}
