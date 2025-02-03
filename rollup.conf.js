import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import vue from '@vitejs/plugin-vue';


export default [
    {
        input: 'src/InlineSvg.vue',
        external: ['vue'],
        plugins: [
            babel(),
            vue(),
        ],
        output: [
            {
                format: 'umd',
                file: 'dist/vue-inline-svg.js',
                name: 'VueInlineSvg',
                globals: {vue: 'Vue'},
            },
            {
                format: 'es',
                file: 'dist/vue-inline-svg.mjs',
            },
            // {
            //     format: 'cjs',
            //     file: 'dist/vue-inline-svg.cjs',
            // },
            {
                format: 'umd',
                file: 'dist/vue-inline-svg.min.js',
                name: 'VueInlineSvg',
                globals: {vue: 'Vue'},
                plugins: [
                    terser(),
                ],
            },
        ],
    },
];
