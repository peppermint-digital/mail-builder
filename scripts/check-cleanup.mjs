import { stripNoOpDeclarations } from '../dist/starters/index.mjs';

let fehler = 0;
const pruefe = (name, ist, soll) => {
    if (ist !== soll) { console.error(`  ✗ ${name}\n    ist:  ${JSON.stringify(ist)}\n    soll: ${JSON.stringify(soll)}`); fehler += 1; }
};

pruefe('entfernt border-radius:0', stripNoOpDeclarations('style="border:none;border-radius:0;cursor:auto"'), 'style="border:none;cursor:auto"');
pruefe('entfernt auch mit Einheit', stripNoOpDeclarations('a{border-radius:0px;}'), 'a{}');
// Eine echte Rundung ist keine Null-Deklaration und bleibt
pruefe('laesst echte Rundung stehen', stripNoOpDeclarations('a{border-radius:3px;}'), 'a{border-radius:3px;}');
// word-break degradiert graceful und traegt bei — bleibt bewusst drin
pruefe('fasst word-break nicht an', stripNoOpDeclarations('td{word-break:break-word;}'), 'td{word-break:break-word;}');

if (fehler > 0) { console.error(`\n${fehler} Problem(e).`); process.exit(1); }
console.log('✓ Aufraeumen in Ordnung (4 Pruefungen)');
