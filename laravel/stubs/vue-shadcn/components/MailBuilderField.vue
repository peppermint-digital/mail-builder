<script setup lang="ts">
/**
 * Thin host-side wrapper around the mail builder.
 *
 * Published by `php artisan mail-builder:install` — adjust freely, it is your
 * file now. The one thing worth keeping is the save contract: the editor hands
 * you MJML *and* compiled HTML, and both belong in the database together.
 */
import { MailBuilder } from '@peppermint-digital/mail-builder/vue';
import '@peppermint-digital/mail-builder/styles.css';
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        variables?: Record<string, string>;
        onUploadImage: (file: File) => Promise<string>;
        theme?: 'light' | 'dark';
        height?: string;
    }>(),
    { theme: 'light', height: '70vh', variables: () => ({}) },
);

const mjml = defineModel<string>({ default: '' });
const emit = defineEmits<{ compileError: [errors: string[]] }>();

const builder = ref<{
    getMjml(): string;
    getHtml(): { html: string; errors: Array<{ message: string }> };
} | null>(null);

/** Call on submit. Returns null when the design failed to compile. */
function collect(): { mjml: string; html: string } | null {
    if (!builder.value) {
        return null;
    }

    const { html, errors } = builder.value.getHtml();

    if (errors.length > 0) {
        emit(
            'compileError',
            errors.map((error) => error.message),
        );

        return null;
    }

    return { mjml: builder.value.getMjml(), html };
}

defineExpose({ collect });
</script>

<template>
    <MailBuilder
        ref="builder"
        v-model="mjml"
        :variables="props.variables"
        :on-upload-image="props.onUploadImage"
        :theme="props.theme"
        :height="props.height"
    />
</template>
