<?php

use Illuminate\Support\Facades\Route;
use Peppermint\MailBuilder\Http\Controllers\MailBuilderImageController;

Route::middleware(config('mail-builder.routes.middleware', ['web', 'auth']))
    ->prefix(config('mail-builder.routes.prefix', 'mail-builder'))
    ->name('mail-builder.')
    ->group(function (): void {
        Route::post('images', [MailBuilderImageController::class, 'store'])->name('images.store');
    });
