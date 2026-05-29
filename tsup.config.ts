import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'], // CLI tools often work best as CJS unless we specifically setup ESM
  target: 'node16',
  clean: true,
  minify: true,
  dts: false,
  outDir: 'dist',
});
