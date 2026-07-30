/**
 * Die Hausvorgaben muessen jede einzelne Regel garantieren, nicht nur die
 * Existenz des mj-attributes-Blocks.
 */
import { ensureHouseDefaults } from '../dist/starters/index.mjs';

let fehler = 0;
const pruefe = (name, bedingung) => {
    if (!bedingung) { console.error(`  ✗ ${name}`); fehler += 1; }
};

const leer = '<mjml><mj-body></mj-body></mjml>';
const mitKopf = '<mjml><mj-head></mj-head><mj-body></mj-body></mjml>';

pruefe('legt Block ohne Kopf an', ensureHouseDefaults(leer).includes('<mj-attributes>'));
pruefe('legt Block im vorhandenen Kopf an', ensureHouseDefaults(mitKopf).includes('<mj-attributes>'));

for (const tag of ['mj-all', 'mj-text', 'mj-button']) {
    pruefe(`${tag} landet im leeren Design`, ensureHouseDefaults(leer).includes(`<${tag} `));
}

pruefe('Buttons werden eckig gesetzt', ensureHouseDefaults(leer).includes('border-radius="0"'));

// Der Fall, der uns eingeholt hat: Block existiert, eine Regel fehlt
const alt = '<mjml><mj-head><mj-attributes><mj-all font-family="Arial"></mj-all></mj-attributes></mj-head><mj-body></mj-body></mjml>';
const ergaenzt = ensureHouseDefaults(alt);
pruefe('ergaenzt fehlende Regel in vorhandenem Block', ergaenzt.includes('<mj-button '));
pruefe('laesst eigene Angabe unangetastet', ergaenzt.includes('font-family="Arial"'));
pruefe('legt keinen zweiten Block an', (ergaenzt.match(/<mj-attributes/g) || []).length === 1);

// Idempotenz
const zweimal = ensureHouseDefaults(ensureHouseDefaults(leer));
pruefe('idempotent', (zweimal.match(/<mj-button /g) || []).length === 1);

if (fehler > 0) { console.error(`\n${fehler} Problem(e).`); process.exit(1); }
console.log('✓ Hausvorgaben in Ordnung (10 Pruefungen)');
