import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { createMailBuilder } from '../core/editor';
import type {
    MailBuilderHtml,
    MailBuilderInstance,
    MailBuilderVariable,
} from '../core/types';

export interface MailBuilderProps {
    /**
     * MJML source. Treated as the *initial* design — the editor is far too
     * expensive to re-initialise on every keystroke, so it is not a fully
     * controlled input. Changing this to a value the editor did not itself
     * produce reloads the design.
     */
    value?: string;
    onChange?: (mjml: string) => void;
    variables?: MailBuilderVariable[] | Record<string, string>;
    /** Vorschauzeile für die Nachrichtenliste des Postfachs. */
    preheader?: string;
    onUploadImage?: (file: File) => Promise<string>;
    onReady?: (instance: MailBuilderInstance) => void;
    theme?: 'light' | 'dark';
    locale?: string;
    brandColors?: string[];
    height?: string | number;
    className?: string;
}

export interface MailBuilderHandle {
    getMjml(): string;
    getHtml(): MailBuilderHtml;
    loadMjml(mjml: string): void;
    insertVariable(key: string): void;
    getPreheader(): string;
    setPreheader(text: string): void;
    isEmpty(): boolean;
    getInstance(): MailBuilderInstance | null;
}

export const MailBuilder = forwardRef<MailBuilderHandle, MailBuilderProps>(function MailBuilder(
    {
        value,
        onChange,
        variables,
        onUploadImage,
        onReady,
        preheader,
        theme = 'light',
        locale = 'de',
        brandColors,
        height = '70vh',
        className,
    },
    ref,
) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<MailBuilderInstance | null>(null);
    /** Last MJML the editor produced — guards the value-prop sync below. */
    const lastEmittedRef = useRef<string | undefined>(value);

    // Callbacks live in refs so a re-render never tears down the editor.
    const onChangeRef = useRef(onChange);
    const onReadyRef = useRef(onReady);
    const onUploadImageRef = useRef(onUploadImage);
    onChangeRef.current = onChange;
    onReadyRef.current = onReady;
    onUploadImageRef.current = onUploadImage;

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const instance = createMailBuilder({
            container: containerRef.current,
            mjml: value,
            preheader,
            variables,
            theme,
            locale,
            brandColors,
            onUploadImage: (file) => {
                const handler = onUploadImageRef.current;

                return handler
                    ? handler(file)
                    : Promise.reject(new Error('Kein Upload-Handler konfiguriert.'));
            },
            onChange: ({ mjml }) => {
                lastEmittedRef.current = mjml;
                onChangeRef.current?.(mjml);
            },
            onReady: (ready) => onReadyRef.current?.(ready),
        });

        instanceRef.current = instance;

        return () => {
            instance.destroy();
            instanceRef.current = null;
        };
        // Mount once. Theme/locale/variable changes need a remount, which the
        // host triggers with a `key` — cheaper than diffing GrapesJS config.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reload only when the design changed outside of this editor.
    useEffect(() => {
        if (value === undefined || value === lastEmittedRef.current) {
            return;
        }

        lastEmittedRef.current = value;
        instanceRef.current?.loadMjml(value);
    }, [value]);

    useImperativeHandle(
        ref,
        () => ({
            getMjml: () => instanceRef.current?.getMjml() ?? '',
            getHtml: () => instanceRef.current?.getHtml() ?? { html: '', errors: [] },
            loadMjml: (mjml: string) => instanceRef.current?.loadMjml(mjml),
            insertVariable: (key: string) => instanceRef.current?.insertVariable(key),
            getPreheader: () => instanceRef.current?.getPreheader() ?? '',
            setPreheader: (text: string) => instanceRef.current?.setPreheader(text),
            isEmpty: () => instanceRef.current?.isEmpty() ?? true,
            getInstance: () => instanceRef.current,
        }),
        [],
    );

    // Two elements on purpose: GrapesJS overwrites the inline style of the
    // element it mounts into with `height: 100%`. Sizing that same element
    // would collapse it to zero, so the height lives on an outer wrapper the
    // editor never touches.
    return (
        <div className={className} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
            <div ref={containerRef} style={{ height: '100%' }} />
        </div>
    );
});

export type {
    MailBuilderError,
    MailBuilderHtml,
    MailBuilderInstance,
    MailBuilderVariable,
} from '../core/types';
export { STARTER_MJML, tokenFor } from '../core/index';
