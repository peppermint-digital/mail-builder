import {
    defineComponent,
    h,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    type PropType,
} from 'vue';

import { createMailBuilder } from '../core/editor';
import type { MailBuilderInstance, MailBuilderVariable } from '../core/types';

/**
 * Vue 3 wrapper around the same core the React component uses. Supports
 * `v-model` on the MJML source.
 */
export const MailBuilder = defineComponent({
    name: 'MailBuilder',

    props: {
        modelValue: { type: String, default: '' },
        variables: {
            type: [Array, Object] as PropType<MailBuilderVariable[] | Record<string, string>>,
            default: () => ({}),
        },
        onUploadImage: {
            type: Function as PropType<(file: File) => Promise<string>>,
            default: undefined,
        },
        theme: { type: String as PropType<'light' | 'dark'>, default: 'light' },
        locale: { type: String, default: 'de' },
        brandColors: { type: Array as PropType<string[]>, default: undefined },
        height: { type: [String, Number], default: '70vh' },
    },

    emits: ['update:modelValue', 'ready', 'change'],

    setup(props, { emit, expose }) {
        const container = ref<HTMLDivElement | null>(null);
        const instance = ref<MailBuilderInstance | null>(null);
        /** Last MJML the editor produced — guards the modelValue sync below. */
        const lastEmitted = ref<string | undefined>(props.modelValue);

        onMounted(() => {
            if (!container.value) {
                return;
            }

            instance.value = createMailBuilder({
                container: container.value,
                mjml: props.modelValue,
                variables: props.variables,
                theme: props.theme,
                locale: props.locale,
                brandColors: props.brandColors,
                onUploadImage: props.onUploadImage,
                onChange: ({ mjml }) => {
                    lastEmitted.value = mjml;
                    emit('update:modelValue', mjml);
                    emit('change', mjml);
                },
                onReady: (ready) => emit('ready', ready),
            });
        });

        onBeforeUnmount(() => {
            instance.value?.destroy();
            instance.value = null;
        });

        watch(
            () => props.modelValue,
            (next) => {
                if (next === undefined || next === lastEmitted.value) {
                    return;
                }

                lastEmitted.value = next;
                instance.value?.loadMjml(next);
            },
        );

        expose({
            getMjml: () => instance.value?.getMjml() ?? '',
            getHtml: () => instance.value?.getHtml() ?? { html: '', errors: [] },
            loadMjml: (mjml: string) => instance.value?.loadMjml(mjml),
            insertVariable: (key: string) => instance.value?.insertVariable(key),
            isEmpty: () => instance.value?.isEmpty() ?? true,
            getInstance: () => instance.value,
        });

        // Two elements on purpose: GrapesJS overwrites the inline style of the
        // element it mounts into with `height: 100%`. Sizing that same element
        // would collapse it to zero, so the height lives on an outer wrapper
        // the editor never touches.
        return () =>
            h(
                'div',
                {
                    style: {
                        height: typeof props.height === 'number' ? `${props.height}px` : props.height,
                    },
                },
                [h('div', { ref: container, style: { height: '100%' } })],
            );
    },
});

export default MailBuilder;
export type { MailBuilderHtml, MailBuilderInstance, MailBuilderVariable } from '../core/types';
