// Indonesia in Numbers — the entry hand-in program (Node 22, standard
// library only). It gathers the site (app/) and its screenshots (screenshots/)
// from beside this file into the output directory and writes dossier.json,
// the summary the judge reads, using the kit's vendored library. Run it
// locally with MAKEFUN_OUTPUT_DIR set, e.g.:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The grader runs it twice and requires byte-identical output both times,
// so this program writes nothing that depends on the clock or the machine.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Preflight: the entry is not hand-inable without its site and its cover.
for (const needed of ['app/index.html', 'screenshots/1-overview.jpg']) {
  if (!existsSync(join(repoRoot, needed))) throw new Error('missing ' + needed);
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: at most 4 screenshots of 256 KiB each, app/ under
// 993 files and 16 MiB, and the dossier text capped at 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log('handed in: app/ + ' + (existsSync(join(repoRoot, 'screenshots')) ? 'screenshots/' : 'no screenshots') + ' -> ' + outputDir);
