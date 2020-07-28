module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
    },
    ignorePatterns: [
        ".eslintrc.js",
        "babel.config.js",
        "rollup.conf.js",
        "demo/**",
        "dist/**",
    ],
    "extends": "eslint-config-airbnb-base",
    "rules": {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "max-len": ["off"],
        "no-param-reassign": ["off"],
        "no-use-before-define": ["off"],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        // allow let
        "prefer-const": "off",
        "prefer-destructuring": ["error", {"object": true, "array": false}],
        // allow extension in imports
        "import/extensions": "off",
        "prefer-object-spread": "off",
    },
    "env": {
        "browser": true
    }
};
