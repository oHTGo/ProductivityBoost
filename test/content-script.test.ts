describe('content script', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.goto('https://www.google.com');
  });

  it('should not be able to open extension when we hover shorter than 0.3 second', async () => {
    await page.mouse.move(0, 0);
    await page.waitForSelector('productivity-booster', { hidden: true });
    await page.mouse.move(100, 100);
    await page.waitForSelector('productivity-booster', { hidden: true });
  });

  it('should be able to open extension when we hover longer 0.3 second', async () => {
    await page.mouse.move(0, 0);
    await page.waitForSelector('productivity-booster', { hidden: true });
    await new Promise((resolve) => setTimeout(resolve, 350));
    await page.mouse.move(100, 100);
    await page.waitForSelector('productivity-booster', { hidden: true });

    const ui = await page.$('productivity-booster');
    const sidebarIcons = await ui?.$$('>>> div > div > svg');

    expect(sidebarIcons?.length).toBe(4);
  });

  it('should be able to close extension', async () => {
    await page.mouse.move(0, 0);
    await page.waitForSelector('productivity-booster');
    await page.mouse.click(100, 100);
    await page.waitForSelector('productivity-booster', { hidden: true });
  });
});
