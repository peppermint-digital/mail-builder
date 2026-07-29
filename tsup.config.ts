import { defineConfig } from 'tsup';

/**
 * GrapesJS and the MJML plugin stay external — tsup keeps everything in
 * `dependencies` out of the bundle, and npm installs them for the consumer
 * anyway. That also means a single GrapesJS instance when the host app happens
 * to use it elsewhere.
 */
export default defineConfig([
    // Core (framework-agnostic)
    {
        entry: { index: 'src/core/index.ts' },
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        outDir: 'dist/core',
        treeshake: true,
    },
    // React wrapper
    {
        entry: { index: 'src/react/index.tsx' },
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        outDir: 'dist/react',
        external: ['react', 'react-dom'],
        treeshake: true,
    },
    // Vue wrapper
    {
        entry: { index: 'src/vue/index.ts' },
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        outDir: 'dist/vue',
        external: ['vue'],
        treeshake: true,
    },
]);
