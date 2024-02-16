import { join } from 'path';

const EXTENSION_PATH = join(process.cwd(), 'dist');

/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
export default {
  launch: {
    dumpio: true,
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--load-extension=${EXTENSION_PATH}`,
      `--disable-extensions-except=${EXTENSION_PATH}`,
      '--disable-dev-shm-usage',
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
};
