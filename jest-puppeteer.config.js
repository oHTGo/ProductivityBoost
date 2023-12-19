import { join } from 'path';

const EXTENSION_PATH = join(process.cwd(), 'dist');
const PROFILE = join(process.cwd(), 'profile');

/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
export default {
  launch: {
    dumpio: true,
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      `--load-extension=${EXTENSION_PATH}`,
      `--disable-extensions-except=${EXTENSION_PATH}`,
      '--disable-dev-shm-usage',
      `--user-data-dir=${PROFILE}`,
    ],
  },
};
