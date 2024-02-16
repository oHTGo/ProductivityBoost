import { newInjectedPage } from 'fingerprint-injector';
import setupPuppeteer from 'jest-environment-puppeteer/setup';
import UserAgent from 'user-agents';
import type { Browser } from 'puppeteer';

const setup = async (globalConfig) => {
  await setupPuppeteer(globalConfig);
  const [browser] = globalThis.__jestPptr.browsers as Browser[];

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://meet.google.com', ['microphone', 'camera', 'notifications']);

  const page = await newInjectedPage(browser, {
    fingerprintOptions: {
      devices: ['desktop'],
      operatingSystems: ['windows'],
      screen: {
        minHeight: 1080,
        minWidth: 1920,
      },
    },
  });
  await page.setUserAgent(new UserAgent({ deviceCategory: 'desktop' }).toString());
  await page.goto('https://accounts.google.com');

  await page.waitForSelector('[type="email"]');
  await page.type('[type="email"]', process.env.GOOGLE_MAIL, { delay: 20 });
  await page.click('#identifierNext');

  await page.waitForSelector('[type="password"]', { visible: true });
  await page.type('[type="password"]', process.env.GOOGLE_PASSWORD, { delay: 20 });

  await page.click('#passwordNext');
  await page.waitForNavigation();
  await page.close();
};

export default setup;
