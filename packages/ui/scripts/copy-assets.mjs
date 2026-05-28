import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
mkdirSync(join(root, 'dist'), { recursive: true });
copyFileSync(join(root, 'src', 'styles.css'), join(root, 'dist', 'styles.css'));
console.log('[@p90/ui] copied styles.css -> dist/styles.css');
