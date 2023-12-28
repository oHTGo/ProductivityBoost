import { Buffer } from 'buffer';
import type { BackgroundFunction } from '@shared/types/commons';

export const setupOffscreen = async () => {
  if (await chrome.offscreen.hasDocument()) return;

  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('src/pages/offscreen/index.html'),
    reasons: [chrome.offscreen.Reason.DOM_PARSER, chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: 'Offscreen api',
  });
};

export const parseEmail: BackgroundFunction<string, string> = async (base64Email: string) => {
  const decodedEmail = Buffer.from(base64Email, 'base64').toString('utf-8');
  const dom = new DOMParser().parseFromString(decodedEmail, 'text/html');

  dom.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
  });

  dom.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src?.startsWith('cid:')) return;
    img.setAttribute('width', '0');
    img.setAttribute('height', '0');
  });

  const encodedEmail = Buffer.from(dom.documentElement.innerHTML, 'utf-8').toString('base64');
  return encodedEmail;
};

export const playSound: BackgroundFunction<string, void> = async (url: string) => {
  const audio = new Audio(url);
  audio.play();
};
