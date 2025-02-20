// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: [
        'expo',
        'plugin:prettier/recommended',
    ],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
    },
    ignorePatterns: ['/dist/*', '/__mocks__/*', '/__tests__/*'],
};
