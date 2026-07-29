<?php

namespace Peppermint\MailBuilder;

use Illuminate\Support\ServiceProvider;
use Peppermint\MailBuilder\Console\InstallCommand;
use Peppermint\MailBuilder\Services\PlaceholderRenderer;

class MailBuilderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/mail-builder.php', 'mail-builder');

        $this->app->singleton(PlaceholderRenderer::class);
    }

    public function boot(): void
    {
        // No loadMigrationsFrom() on purpose: the host owns its template table.
        // Columns are added through MailBuilderSchema from the app's own
        // migration, so nothing runs against production unannounced.

        if (config('mail-builder.routes.enabled', true)) {
            $this->loadRoutesFrom(__DIR__.'/../routes/mail-builder.php');
        }

        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallCommand::class,
            ]);

            $this->publishes([
                __DIR__.'/../config/mail-builder.php' => config_path('mail-builder.php'),
            ], 'mail-builder-config');

            $this->publishes([
                __DIR__.'/../stubs/react-shadcn/components/' => resource_path('js/components/'),
            ], 'mail-builder-react');

            $this->publishes([
                __DIR__.'/../stubs/vue-shadcn/components/' => resource_path('js/components/'),
            ], 'mail-builder-vue');
        }
    }
}
