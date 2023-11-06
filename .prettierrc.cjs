/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['classNames'],

  endOfLine: "crlf",
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  printWidth: 120,
  bracketSameLine: true,
  htmlWhitespaceSensitivity: 'strict',
};
