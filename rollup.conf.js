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
]
