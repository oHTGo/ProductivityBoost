const EXTENSION_ID = 'pegbbopleenglkcmjbbfdbbbbgjgipma';
describe('new tab page', () => {
  it('should be able to open extension', async () => {
    const page = await browser.newPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/newtab/index.html`);
    await page.waitForSelector('#app-container');

    const newPage = await page.$('#app-container');
    expect(newPage).toBeTruthy();

    const sidebarIcons = await newPage?.$$('div > div > svg');
    expect(sidebarIcons).toBeTruthy();
    expect(sidebarIcons?.length).toBe(3);
  });
});

describe('content script', () => {
  it('should be able to open extension', async () => {
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    await page.mouse.move(0, 0);
    await page.waitForSelector('productivity-booster');

    const ui = await page.$('productivity-booster');
    expect(ui).toBeTruthy();

    const sidebarIcons = await ui?.$$('>>> div > div > svg');
    expect(sidebarIcons).toBeTruthy();
    expect(sidebarIcons?.length).toBe(3);
  });
});
