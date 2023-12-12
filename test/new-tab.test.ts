import { EXTENSION_ID } from './constants';

describe('new tab page', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/newtab/index.html`);
  });

  it('should be able to open extension', async () => {
    await page.waitForSelector('#app-container');
    const newPage = await page.$('#app-container');

    const sidebarIcons = await newPage?.$$('div > div > svg');
    expect(sidebarIcons).toBeTruthy();
    expect(sidebarIcons?.length).toBe(3);
  });
});
