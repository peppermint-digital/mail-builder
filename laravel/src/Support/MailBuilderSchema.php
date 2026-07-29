<?php

namespace Peppermint\MailBuilder\Support;

use Illuminate\Database\Schema\Blueprint;

/**
 * Blueprint helpers for the columns the mail builder needs.
 *
 * Deliberately *not* shipped as a package migration: the host application owns
 * its template table, and a package that silently alters a production table is
 * a footgun. Call these from your own migration instead.
 *
 * Both helpers are additive and database-agnostic (SQLite and MySQL).
 */
class MailBuilderSchema
{
    public const MODE_RICH = 'rich';

    public const MODE_BUILDER = 'builder';

    public const MODES = [self::MODE_RICH, self::MODE_BUILDER];

    /**
     * Adds the builder columns to an existing template table.
     *
     * `editor_mode` defaults to `rich`, so every pre-existing row keeps its
     * current editor and nothing needs backfilling.
     */
    public static function addColumns(Blueprint $table, string $after = 'body'): void
    {
        $table->longText('mjml_source')->nullable()->after($after);
        $table->string('editor_mode', 16)->default(self::MODE_RICH)->after('mjml_source');
    }

    /**
     * Reverses {@see self::addColumns()}.
     *
     * Dropping `mjml_source` destroys the editable design — the compiled HTML
     * in `body` survives, but it can no longer be opened in the builder.
     */
    public static function dropColumns(Blueprint $table): void
    {
        $table->dropColumn(['mjml_source', 'editor_mode']);
    }
}
