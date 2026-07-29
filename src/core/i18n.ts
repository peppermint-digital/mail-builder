/**
 * German UI strings for GrapesJS core and the MJML plugin.
 *
 * GrapesJS ships English only, and the MJML plugin adds its own namespace.
 * Both are merged in through `editor.I18n.addMessages`, so anything not
 * translated here quietly falls back to English.
 */
export const de = {
    assetManager: {
        addButton: 'Bild hinzufügen',
        inputPlh: 'https://…/bild.jpg',
        modalTitle: 'Bild auswählen',
        uploadTitle: 'Datei hierher ziehen oder klicken zum Hochladen',
    },
    blockManager: {
        labels: {
            'mj-1-column': '1 Spalte',
            'mj-2-columns': '2 Spalten',
            'mj-3-columns': '3 Spalten',
            'mj-text': 'Text',
            'mj-button': 'Button',
            'mj-image': 'Bild',
            'mj-divider': 'Trennlinie',
            'mj-spacer': 'Abstand',
            'mj-social-group': 'Social-Icons',
            'mj-navbar': 'Navigation',
            'mj-hero': 'Hero-Bereich',
            'mj-wrapper': 'Container',
            'mj-table': 'Tabelle',
            'mj-accordion': 'Akkordeon',
            'mj-carousel': 'Karussell',
            'mj-raw': 'Eigenes HTML',
        },
        categories: {
            Basic: 'Grundbausteine',
            Extra: 'Erweitert',
            Layout: 'Layout',
        },
    },
    domComponents: {
        names: {
            '': 'Element',
            wrapper: 'Körper',
            text: 'Text',
            comment: 'Kommentar',
            image: 'Bild',
            video: 'Video',
            label: 'Beschriftung',
            link: 'Link',
            map: 'Karte',
            tfoot: 'Tabellenfuß',
            tbody: 'Tabelleninhalt',
            thead: 'Tabellenkopf',
            table: 'Tabelle',
            row: 'Zeile',
            cell: 'Zelle',
        },
    },
    deviceManager: {
        device: 'Ansicht',
        devices: {
            desktop: 'Desktop',
            tablet: 'Tablet',
            mobileLandscape: 'Mobil (quer)',
            mobilePortrait: 'Mobil',
        },
    },
    panels: {
        buttons: {
            titles: {
                preview: 'Vorschau',
                fullscreen: 'Vollbild',
                'sw-visibility': 'Hilfslinien anzeigen',
                'export-template': 'Code ansehen',
                'open-sm': 'Gestaltung',
                'open-tm': 'Einstellungen',
                'open-layers': 'Ebenen',
                'open-blocks': 'Bausteine',
            },
        },
    },
    selectorManager: {
        label: 'Klassen',
        selected: 'Ausgewählt',
        emptyState: '– Status –',
        states: {
            hover: 'Maus darüber',
            active: 'Klick',
            'nth-of-type(2n)': 'Jede zweite',
        },
    },
    styleManager: {
        empty: 'Wähle ein Element aus, um es zu gestalten.',
        layer: 'Ebene',
        fileButton: 'Bild',
        sectors: {
            general: 'Allgemein',
            layout: 'Layout',
            typography: 'Schrift',
            decorations: 'Gestaltung',
            extra: 'Erweitert',
            flex: 'Flex',
            dimension: 'Abmessungen',
        },
        properties: {
            'background-color': 'Hintergrundfarbe',
            color: 'Textfarbe',
            'font-family': 'Schriftart',
            'font-size': 'Schriftgröße',
            'font-weight': 'Schriftschnitt',
            'line-height': 'Zeilenhöhe',
            'text-align': 'Ausrichtung',
            'letter-spacing': 'Laufweite',
            padding: 'Innenabstand',
            'padding-top': 'Innenabstand oben',
            'padding-right': 'Innenabstand rechts',
            'padding-bottom': 'Innenabstand unten',
            'padding-left': 'Innenabstand links',
            'border-radius': 'Ecken',
            border: 'Rahmen',
            width: 'Breite',
            height: 'Höhe',
            'container-background-color': 'Hintergrund des Bereichs',
        },
    },
    traitManager: {
        empty: 'Wähle ein Element aus, um seine Einstellungen zu sehen.',
        label: 'Einstellungen',
        traits: {
            labels: {
                href: 'Link-Ziel',
                alt: 'Alternativtext',
                src: 'Bildquelle',
                title: 'Titel',
                name: 'Name',
                target: 'Öffnen in',
            },
            options: {
                target: {
                    false: 'Gleichem Tab',
                    _blank: 'Neuem Tab',
                },
            },
        },
    },
    'grapesjs-mjml': {
        panels: {
            import: {
                title: 'MJML importieren',
                button: 'Importieren',
                label: 'MJML-Quellcode hier einfügen und importieren.',
            },
            export: {
                title: 'Quellcode',
            },
        },
    },
};

export const en = {
    'grapesjs-mjml': {
        panels: {
            import: { title: 'Import MJML', button: 'Import' },
            export: { title: 'Source code' },
        },
    },
};

export const locales: Record<string, Record<string, unknown>> = { de, en };
