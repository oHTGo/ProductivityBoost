import type { ElementHandle } from 'puppeteer';
import { EXTENSION_ID } from '../constants';
import { waitForNextOpenPage } from '../utils';

describe('auth', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/newtab/index.html`);
  });

  it('should be able to login', async () => {
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

    // eslint-disable-next-line no-constant-condition
    while (true) {
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
        break;
      }
    }

    await page.waitForXPath('//button[contains(text(), "Login") and @disabled]', {
      visible: true,
    });
  }, 20000);

  it('should be able to logout', async () => {
    const logoutButton = (await page.waitForXPath('//button[contains(text(), "Logout") and not(@disabled)]', {
      visible: true,
    })) as ElementHandle<Element>;
    await logoutButton?.click();

    await page.waitForXPath('//button[contains(text(), "Logout") and @disabled]', {
      visible: true,
    });
  });
});
