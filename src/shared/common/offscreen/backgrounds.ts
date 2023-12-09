import { Buffer } from 'buffer';

export const setupOffscreen = async () => {
  if (await chrome.offscreen.hasDocument()) return;

  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('src/pages/offscreen/index.html'),
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
    justification: 'Dom parser',
  });
};

export const parseEmail = async (base64Email: string) => {
  const decodedEmail = Buffer.from(base64Email, 'base64').toString('utf-8');
  const dom = new DOMParser().parseFromString(decodedEmail, 'text/html');

  dom.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
  });

  const encodedEmail = Buffer.from(dom.documentElement.innerHTML, 'utf-8').toString('base64');
  return encodedEmail;
};
