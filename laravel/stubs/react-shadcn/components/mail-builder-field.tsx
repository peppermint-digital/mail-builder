import { MailBuilder, type MailBuilderHandle } from '@peppermint-digital/mail-builder/react';
import '@peppermint-digital/mail-builder/styles.css';
import { useCallback, useImperativeHandle, useRef, type Ref } from 'react';

/**
 * Thin host-side wrapper around the mail builder.
 *
 * Published by `php artisan mail-builder:install` — adjust freely, it is your
 * file now. The one thing worth keeping is the save contract: the editor hands
 * you MJML *and* compiled HTML, and both belong in the database together.
 */
export interface MailBuilderFieldHandle {
    /** Call on submit. Returns null when the design failed to compile. */
    collect(): { mjml: string; html: string } | null;
}

interface Props {
    /** Persisted MJML source. Empty string starts from the blank template. */
    value: string;
    onChange?: (mjml: string) => void;
    /** `{ contact_first_name: 'Vorname des Kontakts', … }` */
    variables?: Record<string, string>;
    /** Must resolve to a publicly reachable image URL. */
    onUploadImage: (file: File) => Promise<string>;
    onCompileError?: (errors: string[]) => void;
    theme?: 'light' | 'dark';
    height?: string;
    ref?: Ref<MailBuilderFieldHandle>;
}

export function MailBuilderField({
    value,
    onChange,
    variables,
    onUploadImage,
    onCompileError,
    theme = 'light',
    height = '70vh',
    ref,
}: Props) {
    const builder = useRef<MailBuilderHandle>(null);

    const collect = useCallback((): { mjml: string; html: string } | null => {
        const instance = builder.current;

        if (!instance) {
            return null;
        }

        const { html, errors } = instance.getHtml();

        if (errors.length > 0) {
            onCompileError?.(errors.map((error) => error.message));

            return null;
        }

        return { mjml: instance.getMjml(), html };
    }, [onCompileError]);

    useImperativeHandle(ref, () => ({ collect }), [collect]);

    return (
        <MailBuilder
            ref={builder}
            value={value}
            onChange={onChange}
            variables={variables}
            onUploadImage={onUploadImage}
            theme={theme}
            height={height}
        />
    );
}
