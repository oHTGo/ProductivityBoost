import { join } from 'path';

const EXTENSION_PATH = join(process.cwd(), 'dist');

/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
export default {
  launch: {
    dumpio: true,
    headless: false,
    args: [
      '--disable-gpu',
      '--disable-setuid-sandbox',
      '--no-sandbox',
      `--load-extension=${EXTENSION_PATH}`,
      '--load-guest-mode-test-extension',
    ],
  },
};
