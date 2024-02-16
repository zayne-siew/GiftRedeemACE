module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
};
