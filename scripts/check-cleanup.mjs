import { stripNoOpDeclarations } from '../dist/starters/index.mjs';

let fehler = 0;
const pruefe = (name, ist, soll) => {
    if (ist !== soll) { console.error(`  ✗ ${name}\n    ist:  ${JSON.stringify(ist)}\n    soll: ${JSON.stringify(soll)}`); fehler += 1; }
};

pruefe('entfernt border-radius:0', stripNoOpDeclarations('style="border:none;border-radius:0;cursor:auto"'), 'style="border:none;cursor:auto"');
pruefe('entfernt auch mit Einheit', stripNoOpDeclarations('a{border-radius:0px;}'), 'a{}');
// Eine echte Rundung ist keine Null-Deklaration und bleibt
pruefe('laesst echte Rundung stehen', stripNoOpDeclarations('a{border-radius:3px;}'), 'a{border-radius:3px;}');
// word-break -> word-wrap: gleiche Wirkung, deutlich bessere Client-Unterstuetzung
pruefe('ersetzt word-break durch word-wrap', stripNoOpDeclarations('td{word-break:break-word;}'), 'td{word-wrap:break-word;}');
pruefe('laesst anderes word-break in Ruhe', stripNoOpDeclarations('td{word-break:keep-all;}'), 'td{word-break:keep-all;}');

// Vorschauzeile: display:none versteckt bereits, opacity/max-width tragen nichts
// bei — opacity kostet aber 37 % Client-Unterstuetzung.
const preview = '<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Vorschau</div>';
pruefe('raeumt die Vorschauzeile auf',
    stripNoOpDeclarations(preview),
    '<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;overflow:hidden;">Vorschau</div>');
// Ausserhalb eines versteckten Elements koennte opacity:0 Absicht sein
pruefe('laesst opacity ausserhalb verstecktes Element stehen',
    stripNoOpDeclarations('<div style="opacity:0;color:red;">x</div>'),
    '<div style="opacity:0;color:red;">x</div>');
pruefe('laesst echte Deckkraft stehen',
    stripNoOpDeclarations('<div style="display:none;opacity:0.5;">x</div>'),
    '<div style="display:none;opacity:0.5;">x</div>');

if (fehler > 0) { console.error(`\n${fehler} Problem(e).`); process.exit(1); }
console.log('✓ Aufraeumen in Ordnung (8 Pruefungen)');
