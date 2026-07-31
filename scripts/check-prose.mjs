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

// Der KI-Channel liefert Plaintext mit \n — einzelne Umbrueche muessen erhalten bleiben
pruefe('einzelner Umbruch wird zu br', mjmlFromProse('Zeile A\nZeile B').includes('Zeile A<br />Zeile B'));
// MJML wird als XML geparst: ein offenes <br> bricht das Dokument ab und der
// Baukasten zeigt statt der Vorlage einen Parserfehler (CRM, 2026-07-30).
pruefe('kein offenes br im Ergebnis', !/<br\s*>/.test(mjmlFromProse('A\nB\nC')));
pruefe('doppelter Umbruch bleibt Absatzgrenze', (mjmlFromProse('A\n\nB').match(/<mj-text>/g) || []).length === 2);

// Bug #503 (CRM, 2026-07-31): Ein KI-Vorschlag geriet als JSON-Blob mit
// <mjml>-Markup in diesen Pfad. MJML wird als XML geparst — das Dokument brach
// mit „nicht wohlgeformt" ab. Fremde Tags gehoeren maskiert, nicht eingebettet.
const blob = mjmlFromProse('{"mjml":"<mjml><mj-body><mj-text>Hi</mj-text></mj-body></mjml>"}');
pruefe('bettet fremde Tags nicht ein', !blob.includes('<mj-body>'));
pruefe('zeigt fremde Tags als Text', blob.includes('&lt;mjml&gt;'));
pruefe('erlaubte Auszeichnung ueberlebt daneben', mjmlFromProse('A <b>fett</b> <mjml>x</mjml>').includes('<b>fett</b>'));
pruefe('maskiert das fremde Tag im selben Absatz', mjmlFromProse('A <b>fett</b> <mjml>x</mjml>').includes('&lt;mjml&gt;'));
pruefe('kodiert bares kaufmaennisches Und', mjmlFromProse('Meier & Sohn').includes('Meier &amp; Sohn'));
pruefe('laesst bestehende Entities in Ruhe', mjmlFromProse('5 &amp; 6 &lt; 7').includes('5 &amp; 6 &lt; 7'));
pruefe('haelt Links zusammen', mjmlFromProse('<a href="https://x.de">hier</a>').includes('<a href="https://x.de">hier</a>'));
// Der Platzhalter darf keine echten Zahlen im Text treffen.
pruefe('laesst Zahlen im Text unberuehrt', mjmlFromProse('dauert <b>15</b> bis 20 Minuten').includes('bis 20 Minuten'));


if (fehler > 0) { console.error(`\n${fehler} Problem(e).`); process.exit(1); }
console.log('✓ Prosa-Umwandlung in Ordnung (20 Pruefungen)');
