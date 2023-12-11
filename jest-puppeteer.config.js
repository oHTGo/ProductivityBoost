import { join } from 'path';

const EXTENSION_PATH = join(process.cwd(), 'dist');

/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
export default {
  launch: {
    headless: process.env.CI ? 'new' : false,
    args: [`--disable-extensions-except=${EXTENSION_PATH}`, `--load-extension=${EXTENSION_PATH}`],
  },
};
