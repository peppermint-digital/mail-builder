import { mjmlFromProse } from '../dist/starters/index.mjs';

let fehler = 0;
const pruefe = (name, bedingung) => { if (!bedingung) { console.error(`  ✗ ${name}`); fehler += 1; } };

const drei = mjmlFromProse('<p>Hallo Max,</p><p>kurzer Text.</p><p>Viele Gruesse</p>');
pruefe('macht drei Absaetze zu drei Bloecken', (drei.match(/<mj-text>/g) || []).length === 3);
pruefe('behaelt Inline-Auszeichnung', mjmlFromProse('<p>Hallo <strong>Max</strong></p>').includes('<strong>Max</strong>'));
pruefe('erkennt doppelte br als Absatzgrenze', (mjmlFromProse('Zeile A<br><br>Zeile B').match(/<mj-text>/g) || []).length === 2);
pruefe('wirft leere Absaetze weg', (mjmlFromProse('<p>A</p><p></p><p>B</p>').match(/<mj-text>/g) || []).length === 2);
pruefe('setzt den Preheader', mjmlFromProse('<p>A</p>', { preheader: 'Kurze Frage' }).includes('<mj-preview>Kurze Frage</mj-preview>'));
pruefe('maskiert im Preheader', mjmlFromProse('<p>A</p>', { preheader: '<b>x</b>' }).includes('&lt;b&gt;x&lt;/b&gt;'));
pruefe('bringt die Hausvorgaben mit', drei.includes('border-radius="0"'));
pruefe('bleibt bei leerer Eingabe gueltig', mjmlFromProse('').includes('<mj-body'));
pruefe('600px Breite', drei.includes('width="600px"'));

if (fehler > 0) { console.error(`\n${fehler} Problem(e).`); process.exit(1); }
console.log('✓ Prosa-Umwandlung in Ordnung (9 Pruefungen)');
