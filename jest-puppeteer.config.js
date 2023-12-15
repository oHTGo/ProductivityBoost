// import { join } from 'path';

// const EXTENSION_PATH = join(process.cwd(), 'dist');

/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
export default {
  launch: {
    dumpio: true,
    headless: false,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox'],
  },
};
