/**
 * Prüft die Preheader-Helfer ohne Browser — reine Stringlogik, kein GrapesJS.
 */
import { extractPreheader, setPreheaderIn } from '../dist/starters/index.mjs';

let fehler = 0;
const pruefe = (name, ist, soll) => {
    if (ist !== soll) {
        console.error(`  ✗ ${name}\n    ist:  ${JSON.stringify(ist)}\n    soll: ${JSON.stringify(soll)}`);
        fehler += 1;
    }
};

pruefe('liest vorhandenen Preheader',
    extractPreheader('<mjml><mj-head><mj-preview> Hallo </mj-preview></mj-head></mjml>'), 'Hallo');

pruefe('leer, wenn keiner da ist',
    extractPreheader('<mjml><mj-body></mj-body></mjml>'), '');

pruefe('ersetzt vorhandenen Knoten',
    setPreheaderIn('<mjml><mj-head><mj-preview>alt</mj-preview></mj-head><mj-body></mj-body></mjml>', 'neu'),
    '<mjml><mj-head><mj-preview>neu</mj-preview></mj-head><mj-body></mj-body></mjml>');

pruefe('legt Knoten im vorhandenen Kopf an',
    setPreheaderIn('<mjml><mj-head></mj-head><mj-body></mj-body></mjml>', 'X'),
    '<mjml><mj-head><mj-preview>X</mj-preview></mj-head><mj-body></mj-body></mjml>');

pruefe('legt Kopf mit an, wenn keiner da ist',
    setPreheaderIn('<mjml><mj-body></mj-body></mjml>', 'X'),
    '<mjml><mj-head><mj-preview>X</mj-preview></mj-head><mj-body></mj-body></mjml>');

// Nutzertext darf das MJML nicht zerlegen
pruefe('maskiert spitze Klammern',
    setPreheaderIn('<mjml><mj-body></mj-body></mjml>', '<script>x</script>'),
    '<mjml><mj-head><mj-preview>&lt;script&gt;x&lt;/script&gt;</mj-preview></mj-head><mj-body></mj-body></mjml>');

pruefe('Rundlauf schreiben → lesen',
    extractPreheader(setPreheaderIn('<mjml><mj-body></mj-body></mjml>', 'Kurze Anfrage')), 'Kurze Anfrage');

if (fehler > 0) {
    console.error(`\n${fehler} Problem(e) in der Preheader-Logik.`);
    process.exit(1);
}
console.log('✓ Preheader-Logik in Ordnung (7 Prüfungen)');
