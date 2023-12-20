describe('content script', () => {
  beforeAll(async () => {
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
});
