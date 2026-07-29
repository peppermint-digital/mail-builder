<?php

namespace Peppermint\MailBuilder\Concerns;

use Peppermint\MailBuilder\Services\PlaceholderRenderer;
use Peppermint\MailBuilder\Support\MailBuilderSchema;

/**
 * Adds mail-builder behaviour to a template model.
 *
 * Expects two columns (see {@see MailBuilderSchema::addColumns()}):
 * - `mjml_source`  the editable design
 * - `editor_mode`  `rich` (legacy WYSIWYG) or `builder`
 *
 * The compiled HTML is *not* owned by this trait — it lives in whatever body
 * column the host model already uses, so every existing send path keeps
 * working untouched. Override {@see self::mailBuilderBodyColumn()} if yours is
 * not called `body`.
 */
trait HasMailBuilderDesign
{
    public function mailBuilderBodyColumn(): string
    {
        return 'body';
    }

    /** True when this template is edited with the drag & drop builder. */
    public function usesMailBuilder(): bool
    {
        return $this->getAttribute('editor_mode') === MailBuilderSchema::MODE_BUILDER;
    }

    /**
     * Stores a design coming from the editor: the MJML source plus the HTML it
     * compiled to. Both are written together — a design without its compiled
     * body would be unsendable, and a body without its design uneditable.
     */
    public function storeMailBuilderDesign(string $mjml, string $html): void
    {
        $this->setAttribute('mjml_source', $mjml);
        $this->setAttribute($this->mailBuilderBodyColumn(), $html);
        $this->setAttribute('editor_mode', MailBuilderSchema::MODE_BUILDER);
    }

    /**
     * Renders the template body with placeholders substituted.
     *
     * @param  array<string, string|null>  $replacements
     */
    public function renderMailBuilderBody(array $replacements, bool $stripUnknown = true): string
    {
        $body = (string) $this->getAttribute($this->mailBuilderBodyColumn());

        return app(PlaceholderRenderer::class)->renderHtml($body, $replacements, $stripUnknown);
    }

    /**
     * Placeholders used in this template that the given data does not cover.
     *
     * @param  array<string, string|null>  $replacements
     * @return list<string>
     */
    public function missingMailBuilderPlaceholders(array $replacements): array
    {
        return app(PlaceholderRenderer::class)->missingPlaceholders(
            (string) $this->getAttribute($this->mailBuilderBodyColumn()),
            $replacements,
        );
    }
}
