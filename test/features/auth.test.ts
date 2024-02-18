import type { ElementHandle } from 'puppeteer';
import { EXTENSION_ID } from '../constants';
import { waitForNextOpenPage } from '../utils';

describe('auth', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/newtab/index.html`);
  });

  it.each([
    ['', ''],
    [process.env.GOOGLE_CLIENT_ID ?? 'none', process.env.GOOGLE_CLIENT_SECRET ?? 'none'],
  ])(
    'should be able to login',
    async (id, secret) => {
      const idInput = await page.waitForSelector('input[id="client-id"]', {
        visible: true,
      });
      await idInput?.type(id ?? '');

      const secretInput = await page.waitForSelector('input[id="client-secret"]', {
        visible: true,
      });
      await secretInput?.type(secret ?? '');
      expect(secretInput?._?.type).toBe('password');

      const loginButton = (await page.waitForXPath('//button[contains(text(), "Login") and not(@disabled)]', {
        visible: true,
      })) as ElementHandle<Element>;
      await loginButton?.click();

      const googlePopup = await waitForNextOpenPage((page) => page.url().includes('accounts.google.com'), {
        timeout: 10000,
      });
      expect(googlePopup).toBeTruthy();

      await (
        await googlePopup.waitForSelector(`div[data-identifier="${process.env.GOOGLE_MAIL}"]`, {
          visible: true,
        })
      )?.click();

      for (let i = 0; i < 10; i++) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          await googlePopup.waitForSelector('button[jsname="LgbsSe"]', {
            visible: true,
          });
          await googlePopup.$$eval(
            'button[jsname="LgbsSe"]',
            (buttons) => buttons.find((b) => b.textContent === 'Continue' || b.textContent === 'Allow')?.click(),
          );
        } catch (err) {
          /* empty */
        }
      }

      await page.waitForXPath('//button[contains(text(), "Login") and @disabled]', {
        visible: true,
      });

      const logoutButton = (await page.waitForXPath('//button[contains(text(), "Logout") and not(@disabled)]', {
        visible: true,
      })) as ElementHandle<Element>;
      await logoutButton?.click();

      await page.waitForXPath('//button[contains(text(), "Logout") and @disabled]', {
        visible: true,
      });
    },
    20000,
  );
});
