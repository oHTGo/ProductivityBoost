import type { Page } from 'puppeteer';

export const waitForNextOpenPage = async (
  callback: (page: Page) => boolean,
  options: { timeout: number } = { timeout: 5000 },
): Promise<Page> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      browser.off('targetcreated', onTargetCreated);
      reject(new Error('timeout'));
    }, options.timeout);

    const onTargetCreated = async () => {
      const pageList = await browser.pages();
      const newPage = await pageList[pageList.length - 1];

      if (callback(newPage)) {
        clearTimeout(timeout);
        browser.off('targetcreated', onTargetCreated);
        resolve(newPage);
      }
    };

    browser.on('targetcreated', onTargetCreated);
  });
