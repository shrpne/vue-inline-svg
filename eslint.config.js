// @see https://dev.to/devidev/setting-up-eslint-9130-with-prettier-typescript-vuejs-and-vscode-autosave-autoformat-n0

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

/** @type {import('eslint').Linter.Config[]} */
const config = [
    {
        ignores: [
            '**/*.d.ts',
            "demo/**",
            "dist/**",
            "node_modules/**",
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    // js
    pluginJs.configs.recommended,
    // ts
    ...tseslint.configs.recommended,
    // vue
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    // rules override
    {
        rules: {
            indent: ['error', 4, { SwitchCase: 1 }],
            semi: ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            "arrow-parens": ["error", "always"],
            "space-before-function-paren": ["error", {
                anonymous: "never",
                named: "never",
                asyncArrow: "always",
            }],
            'max-len': ['off'],
            'no-param-reassign': ['off'],
            'no-use-before-define': ['off'],
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            // allow let
            'prefer-const': 'off',
            'prefer-destructuring': ['error', { object: true, array: false }],
            // allow extension in imports
            'import/extensions': 'off',
            'prefer-object-spread': 'off',


            '@typescript-eslint/no-unused-vars': 'off',


            'vue/html-closing-bracket-spacing': 0,
            'vue/html-indent': ['error', 4],
            'vue/no-v-html': 0,
        },
    },
];

export default config;
