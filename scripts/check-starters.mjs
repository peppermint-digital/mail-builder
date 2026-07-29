/**
 * Structural check on the starter designs.
 *
 * Not a full MJML validation — that needs a browser DOM. It catches the two
 * failure modes that actually bit us: self-closing MJML tags (parsed as open
 * tags, swallowing their siblings) and unbalanced tags.
 */
import { STARTERS } from '../dist/starters/index.mjs';

const SELF_CLOSING = /<(mj-[a-z0-9-]+)\b[^>]*\/>/g;
const TAG = /<(\/?)(mj-[a-z0-9-]+|mjml)\b[^>]*?(\/?)>/g;

let failures = 0;

function fail(starter, message) {
    console.error(`  ✗ ${starter.id}: ${message}`);
    failures += 1;
}

for (const starter of STARTERS) {
    const { mjml } = starter;

    for (const [match, tag] of mjml.matchAll(SELF_CLOSING)) {
        fail(starter, `selbstschliessendes <${tag}/> — muss explizit geschlossen werden: ${match.trim()}`);
    }

    const stack = [];
    for (const [, closing, tag] of mjml.matchAll(TAG)) {
        if (closing) {
            const open = stack.pop();
            if (open !== tag) {
                fail(starter, `</${tag}> schliesst <${open ?? 'nichts'}>`);
            }
        } else {
            stack.push(tag);
        }
    }

    if (stack.length > 0) {
        fail(starter, `nicht geschlossen: ${stack.join(', ')}`);
    }

    for (const required of ['<mjml>', '<mj-body', '<mj-attributes>']) {
        if (!mjml.includes(required)) {
            fail(starter, `${required} fehlt`);
        }
    }

    if (/https?:\/\/(?!\s)/.test(mjml.replace(/href="https:\/\/"/g, ''))) {
        fail(starter, 'externe URL — Platzhalterbilder und Assets muessen eingebettet sein');
    }
}

if (failures > 0) {
    console.error(`\n${failures} Problem(e) in den Start-Grundgeruesten.`);
    process.exit(1);
}

console.log(`✓ ${STARTERS.length} Start-Grundgerueste strukturell in Ordnung`);
