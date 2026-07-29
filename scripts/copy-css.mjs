/**
 * Bundles the GrapesJS base theme and our overrides into a single
 * `dist/styles.css`, so consumers only ever import one stylesheet.
 */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const grapesCss = require.resolve('grapesjs/dist/css/grapes.min.css');
const overridesCss = resolve(root, 'src/styles.css');
const target = resolve(root, 'dist/styles.css');

mkdirSync(dirname(target), { recursive: true });

writeFileSync(
    target,
    [
        '/* GrapesJS base theme (BSD-3-Clause, https://github.com/GrapesJS/grapesjs) */',
        readFileSync(grapesCss, 'utf8'),
        '',
        '/* @peppermint-digital/mail-builder overrides */',
        readFileSync(overridesCss, 'utf8'),
    ].join('\n'),
    'utf8',
);

console.log('dist/styles.css written');
