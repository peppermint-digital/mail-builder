# @peppermint-digital/mail-builder

Drag-&-Drop-Baukasten für E-Mail-Vorlagen — für React **und** Vue, auf Basis von
[GrapesJS](https://github.com/GrapesJS/grapesjs) und
[MJML](https://mjml.io/).

Das Repo enthält zwei Pakete:

| Manifest | Paket | Inhalt |
|---|---|---|
| `package.json` | `@peppermint-digital/mail-builder` | Editor-Komponente (React + Vue) |
| `composer.json` | `peppermint/mail-builder` | Laravel-Seite: Speicherung, Rendering, Bild-Upload |

## Warum MJML als Speicherformat

Gespeichert wird **MJML-Quellcode**, nicht HTML. MJML kompiliert zu
tabellenbasiertem, inline-gestyltem HTML — also genau dem, was der Peppermint-
Standard „bulletproof HTML-Mails" verlangt (Outlook-Word-Engine, `<style>`-
Strippen bei web.de/GMX, 600px, websichere Schrift).

Zwei Nebeneffekte, die zählen:

- **Kompiliert wird im Browser** (`mjml-browser` über `grapesjs-mjml`) — auf dem
  Server ist kein Node nötig.
- **Die Editor-Engine bleibt austauschbar.** MJML ist ein offener Standard; wenn
  GrapesJS irgendwann nicht mehr passt, bleiben alle Vorlagen gültig.

## Installation

```bash
npm install github:peppermint-digital/mail-builder
```

## React

```tsx
import { MailBuilder, type MailBuilderHandle } from '@peppermint-digital/mail-builder/react';
import '@peppermint-digital/mail-builder/styles.css';

const builder = useRef<MailBuilderHandle>(null);

<MailBuilder
    ref={builder}
    value={template.mjml_source}
    variables={standardVariables}          // { contact_first_name: 'Vorname …' }
    onUploadImage={uploadMailTemplateImage} // (File) => Promise<string>
    theme="light"
    height="70vh"
/>;

// Beim Speichern:
const mjml = builder.current!.getMjml();
const { html, errors } = builder.current!.getHtml();
```

## Vue

```vue
<script setup lang="ts">
import { MailBuilder } from '@peppermint-digital/mail-builder/vue';
import '@peppermint-digital/mail-builder/styles.css';

const mjml = ref(template.mjml_source);
</script>

<template>
    <MailBuilder v-model="mjml" :variables="standardVariables" :on-upload-image="upload" />
</template>
```

## Platzhalter

`variables` nimmt entweder `{ key: label }` (so sieht
`MailTemplate::STANDARD_VARIABLES` im CRM aus) oder die ausführliche Array-Form.
Die Tokens erscheinen als Dropdown „Platzhalter …" in der Textbearbeitungs-
Leiste und werden als `{{ key }}` eingefügt. Ersetzt werden sie **serverseitig**
beim Rendern — der Editor fasst sie nie an.

## API

| Methode | Zweck |
|---|---|
| `getMjml()` | aktuelle Vorlage als MJML — das, was persistiert wird |
| `getHtml()` | `{ html, errors }` — kompiliertes E-Mail-HTML |
| `loadMjml(src)` | Design komplett ersetzen |
| `insertVariable(key)` | `{{ key }}` an der Cursorposition einfügen |
| `isEmpty()` | true, solange nichts im Körper liegt |
| `getInstance()` | Fluchtluke auf die GrapesJS-Instanz |

Der Editor ist bewusst **nicht** vollständig controlled: `value` gilt als
Startwert. Ein Remount erzwingt man über `key`, ein gezieltes Neuladen über
`loadMjml()`.

## Lizenzen der Abhängigkeiten

Eigener Code MIT. `grapesjs` und `grapesjs-mjml` stehen unter BSD-3-Clause,
`mjml-browser` unter MIT.
