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
// Bewusste Entscheidung: die Hausregel gewinnt. Es gibt keine Oberflaeche, in
// der jemand mj-attributes pflegt — eine abweichende Angabe stammt also aus
// einem Import und soll den verbindlichen Standard nicht aushebeln.
pruefe('Hausregel setzt sich gegen eine abweichende Angabe durch',
    ergaenzt.includes('font-family="Arial, Helvetica, sans-serif"'));
pruefe('legt keinen zweiten Block an', (ergaenzt.match(/<mj-attributes/g) || []).length === 1);

// Der Fall, an dem es zweimal scheiterte: Tag vorhanden, Attribut fehlt
const alteFassung = '<mjml><mj-head><mj-attributes><mj-button font-family="Arial"></mj-button></mj-attributes></mj-head><mj-body></mj-body></mjml>';
const aktualisiert = ensureHouseDefaults(alteFassung);
pruefe('aktualisiert eine veraltete Regel-Fassung', aktualisiert.includes('border-radius="0"'));
pruefe('dupliziert die Regel dabei nicht', (aktualisiert.match(/<mj-button /g) || []).length === 1);

// Fremde Regeln mit anderen Tags ueberleben
const fremd = '<mjml><mj-head><mj-attributes><mj-section padding="0"></mj-section></mj-attributes></mj-head><mj-body></mj-body></mjml>';
pruefe('laesst fremde Regeln stehen', ensureHouseDefaults(fremd).includes('<mj-section padding="0">'));

// Idempotenz
const zweimal = ensureHouseDefaults(ensureHouseDefaults(leer));
pruefe('idempotent', (zweimal.match(/<mj-button /g) || []).length === 1);

if (fehler > 0) { console.error(`\n${fehler} Problem(e).`); process.exit(1); }
console.log('✓ Hausvorgaben in Ordnung (13 Pruefungen)');
