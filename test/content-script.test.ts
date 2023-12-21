describe('content script', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.goto('https://www.google.com');
  });

  it('should be able to open extension', async () => {
    await page.mouse.move(0, 0);
    await page.waitForSelector('productivity-booster');

    const ui = await page.$('productivity-booster');
    const sidebarIcons = await ui?.$$('>>> div > div > svg');

    expect(sidebarIcons?.length).toBe(3);
  });

  it('should be able to close extension', async () => {
    await page.mouse.move(0, 0);
    await page.waitForSelector('productivity-booster');
    await page.mouse.click(100, 100);
    await page.waitForSelector('productivity-booster', { hidden: true });
  });
});
