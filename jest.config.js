/** @type {import('jest').Config} */
export default {
  preset: 'jest-puppeteer',
  transform: {
    '.ts$': 'ts-jest',
  },
  globalSetup: '<rootDir>/test/setup.ts',
};
