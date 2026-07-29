<?php

namespace Peppermint\MailBuilder\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class InstallCommand extends Command
{
    protected $signature = 'mail-builder:install
        {--frontend= : Frontend stack (react|vue). Defaults to interactive choice.}
        {--table= : Template table the builder columns are added to.}
        {--after=body : Column the new columns are placed after.}
        {--no-migration : Skip generating the migration.}
        {--force : Overwrite existing published files.}';

    protected $description = 'Install peppermint/mail-builder: publish config and frontend stubs, generate the migration, and surface the npm dependency.';

    public function handle(): int
    {
        $this->components->info('peppermint/mail-builder — install');

        $this->publishConfig();

        $frontend = $this->resolveFrontend();
        if ($frontend !== null) {
            $this->publishStubs($frontend);
        }

        if (! $this->option('no-migration')) {
            $this->generateMigration();
        }

        $this->surfaceNpmDependency();

        $this->components->success('Fertig. Migration pruefen, dann `php artisan migrate`.');

        return self::SUCCESS;
    }

    private function publishConfig(): void
    {
        $args = ['--tag' => 'mail-builder-config'];

        if ($this->option('force')) {
            $args['--force'] = true;
        }

        $this->call('vendor:publish', $args);
    }

    private function resolveFrontend(): ?string
    {
        $frontend = $this->option('frontend');

        if ($frontend === null) {
            $frontend = $this->choice(
                'Welche Frontend-Stubs sollen publiziert werden?',
                ['react', 'vue', 'none'],
                'react',
            );
        }

        return in_array($frontend, ['react', 'vue'], true) ? $frontend : null;
    }

    private function publishStubs(string $frontend): void
    {
        $args = ['--tag' => "mail-builder-{$frontend}"];

        if ($this->option('force')) {
            $args['--force'] = true;
        }

        $this->call('vendor:publish', $args);
    }

    /**
     * Writes the column migration into the host app rather than shipping it in
     * the package — the table name differs per product, and a package
     * migration touching a live table is exactly what we want to avoid.
     */
    private function generateMigration(): void
    {
        $table = $this->option('table') ?: $this->ask('In welche Tabelle sollen die Builder-Spalten?', 'mail_templates');
        $after = (string) $this->option('after');

        $stub = str_replace(
            ['{{ table }}', '{{ after }}'],
            [$table, $after],
            File::get(__DIR__.'/../../stubs/migration.php.stub'),
        );

        $filename = sprintf('%s_add_mail_builder_columns_to_%s_table.php', date('Y_m_d_His'), $table);
        $path = database_path('migrations/'.$filename);

        if (File::exists($path) && ! $this->option('force')) {
            $this->components->warn("Migration existiert bereits: {$filename}");

            return;
        }

        File::put($path, $stub);

        $this->components->info("Migration angelegt: database/migrations/{$filename}");
        $this->components->warn('Bitte vor dem Migrieren einmal durchlesen — sie veraendert eine bestehende Tabelle.');
    }

    private function surfaceNpmDependency(): void
    {
        $this->newLine();
        $this->components->info('Noch im Frontend zu erledigen:');
        $this->line('  npm install github:peppermint-digital/mail-builder');
        $this->line("  import '@peppermint-digital/mail-builder/styles.css';");
    }
}
