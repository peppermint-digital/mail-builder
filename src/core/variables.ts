import type { Editor } from 'grapesjs';
import type { MailBuilderVariable } from './types';

/** Accepts both the rich array form and a plain `{ key: label }` map. */
export function normalizeVariables(
    input: MailBuilderVariable[] | Record<string, string> | undefined,
): MailBuilderVariable[] {
    if (!input) {
        return [];
    }

    if (Array.isArray(input)) {
        return input.filter((variable) => Boolean(variable?.key));
    }

    return Object.entries(input).map(([key, label]) => ({ key, label }));
}

export function tokenFor(key: string): string {
    return `{{ ${key} }}`;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Inserts a placeholder token at the caret when a text block is being edited,
 * and falls back to appending it to the selected text block otherwise. Silently
 * does nothing when neither applies — there is no sensible target then.
 */
export function insertVariable(editor: Editor, key: string): void {
    const token = tokenFor(key);
    const rte = editor.RichTextEditor as unknown as {
        insertHTML?: (content: string, opts?: Record<string, unknown>) => void;
    };

    if (typeof editor.getEditing === 'function' && editor.getEditing() && rte?.insertHTML) {
        rte.insertHTML(token, { select: false });

        return;
    }

    const selected = editor.getSelected();

    if (selected?.is?.('text')) {
        const current = String(selected.get('content') ?? '');
        selected.set('content', current ? `${current} ${token}` : token);
    }
}

/**
 * Adds a "Platzhalter" dropdown to the rich-text toolbar. Rendering the action
 * as a `<select>` is GrapesJS's own pattern for multi-choice RTE actions —
 * a button would need a second popover layer we do not want here.
 */
export function registerVariablesRteAction(editor: Editor, variables: MailBuilderVariable[]): void {
    if (variables.length === 0) {
        return;
    }

    const options = variables
        .map((variable) => `<option value="${escapeHtml(variable.key)}">${escapeHtml(variable.label)}</option>`)
        .join('');

    editor.RichTextEditor.add('peppermint-variables', {
        icon: `<select class="gjs-field pm-variable-select" style="min-width:9rem">
                 <option value="">Platzhalter …</option>
                 ${options}
               </select>`,
        event: 'change',
        attributes: { title: 'Platzhalter einfügen' },
        result: (rte: unknown, action: unknown) => {
            const select = (action as { btn?: HTMLElement })?.btn?.firstElementChild as HTMLSelectElement | null;

            if (!select?.value) {
                return;
            }

            (rte as { insertHTML?: (c: string, o?: Record<string, unknown>) => void }).insertHTML?.(
                tokenFor(select.value),
                { select: false },
            );

            select.value = '';
        },
    } as never);
}
