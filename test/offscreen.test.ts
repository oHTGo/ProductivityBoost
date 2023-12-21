import { Buffer } from 'buffer';
import { parseFromString } from 'dom-parser';
import { EXTENSION_ID } from './constants';

describe('offscreen', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
  });

  it('should be able to parse email', async () => {
    const email = `
    <html>
        <body>
            <a id="link" href="https://www.google.com">Google</a>
            <img id="image" src="cid:123" />
        </body>
    </html>`;
    const payload = Buffer.from(email).toString('base64');
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/offscreen/index.html`);

    const parsedEmail = await page.evaluate(
      async ({ payload }) => {
        return await chrome.runtime.sendMessage({
          event: 'PARSE_EMAIL',
          payload,
        });
      },
      { payload },
    );
    const decodedEmail = Buffer.from(parsedEmail, 'base64').toString('utf-8');
    const dom = parseFromString(decodedEmail);

    const link = dom.getElementById('link');
    const image = dom.getElementById('image');

    expect(link?.getAttribute('href')).toBe('https://www.google.com');
    expect(link?.getAttribute('target')).toBe('_blank');

    expect(image?.getAttribute('src')).toBe('cid:123');
    expect(image?.getAttribute('width')).toBe('0');
    expect(image?.getAttribute('height')).toBe('0');
  });
});
