import { join } from 'path';

const EXTENSION_PATH = join(process.cwd(), 'dist');
console.log('EXTENSION_PATH', EXTENSION_PATH);

/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
export default {
  launch: {
    headless: process.env.CI ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  },
};
