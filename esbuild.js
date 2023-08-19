import * as esbuild from 'esbuild';

const header = `import path from 'node:path';
import { createRequire } from 'module'; 
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
`

await esbuild.build({
  platform: "node",
  target: ["es2022"],
  format: "esm",
  mainFields: ['module', 'main'],
  banner: { js: header },
  entryPoints: ['src/index.ts'],
  tsconfig: "tsconfig.build.json",
  bundle: true,
  outfile: 'index.js',
});