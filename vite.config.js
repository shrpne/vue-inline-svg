import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/InlineSvg.vue',
            name: 'VueInlineSvg',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format, entryName) => {
                const ext = {
                    es: 'esm.js',
                    cjs: 'cjs',
                    umd: 'js',
                };
                return `vue-inline-svg.${ext[format]}`;
            },
        },
        rollupOptions: {
            external: ['vue'], // Keep Vue as a peer dependency
            output: {
                globals: { vue: 'Vue' },
            },
        },
    },
});
