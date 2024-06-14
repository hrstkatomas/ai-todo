module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
        "prettier",
        "plugin:import/typescript"
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: [
        'react-refresh',
        'react-hooks'
    ],
    rules: {
        // react-refresh plugin
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        // react-hooks plugin
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        // our taste of coding
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {ignoreRestSiblings: true},
        ],
        "require-await": "error"
    },
    "settings": {
        "react": {
            "version": "detect",
        },
    }
}
