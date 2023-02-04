import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';


export default [
    {
        input: 'src/index.js',
        external: ['vue'],
        plugins: [
            babel(),
        ],
        output: [
            {
                format: 'umd',
                file: 'dist/vue-inline-svg.js',
                name: 'VueInlineSvg',
                globals: {vue: 'Vue'},
            },
            // {
            //     format: 'es',
            //     file: 'dist/vue-inline-svg.esm.js',
            // },
        ],
    },
    {
        input: 'src/index.js',
        external: ['vue'],
        plugins: [
            babel(),
            terser(),
        ],
        output: [
            {
                format: 'umd',
                file: 'dist/vue-inline-svg.min.js',
                name: 'VueInlineSvg',
                globals: {vue: 'Vue'},
            }
        ]
    }
]
