import js from "@eslint/js";
// import { FlatCompat } from '@eslint/eslintrc';
import globals from "globals";
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

// const compat = new FlatCompat();

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const config = [
    {
        ignores: [
            ".eslintrc.cjs",
            "babel.config.js",
            "rollup.conf.js",
            "demo/**",
            "dist/**",
            "node_modules/**",
        ],
    },
    {
        files: ["**/*.{ts}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                // ...globals.node,
                // myCustomGlobal: "readonly"
            },
            parser: typescriptEslintParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...typescriptEslintPlugin.configs.recommended.rules,
        },
    },
    {
        files: ["**/*.{js,mjc,cjs}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                // ...globals.node,
                // myCustomGlobal: "readonly"
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            indent: ['error', 4, { SwitchCase: 1 }],
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
        },
    },
];

export default config;
