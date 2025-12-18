// @ts-check

/**
 * @see https://prettier.io/docs/en/configuration.html
 *
 * @type {import('prettier').Config}
 */
const config = {
  printWidth: 120,
  singleQuote: true,
  quoteProps: 'consistent',
  multilineArraysWrapThreshold: 3,
  plugins: ['prettier-plugin-multiline-arrays', 'prettier-plugin-tailwindcss', 'prettier-plugin-merge'],
};

module.exports = config;
