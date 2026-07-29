<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Bild-Upload
    |--------------------------------------------------------------------------
    |
    | Bilder, die im Baukasten abgelegt werden, landen auf dieser Disk. Die
    | zurueckgegebene URL muss aus dem Postfach des Empfaengers erreichbar
    | sein — eine host-relative /storage-URL reicht dafuer nur, wenn die
    | Mail spaeter mit absoluter Basis-URL versendet wird.
    |
    */

    'uploads' => [
        'disk' => env('MAIL_BUILDER_DISK', 'public'),
        'path' => env('MAIL_BUILDER_PATH', 'mail-templates'),
        'max_kilobytes' => (int) env('MAIL_BUILDER_MAX_KB', 5120),
        'mimes' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Routen
    |--------------------------------------------------------------------------
    |
    | Die Upload-Route des Pakets. Bringt die Anwendung eine eigene mit (das
    | CRM tut das), einfach 'enabled' auf false setzen und den eigenen
    | Endpunkt an die Editor-Komponente durchreichen.
    |
    */

    'routes' => [
        'enabled' => env('MAIL_BUILDER_ROUTES', true),
        'prefix' => 'mail-builder',
        'middleware' => ['web', 'auth'],
    ],

];
