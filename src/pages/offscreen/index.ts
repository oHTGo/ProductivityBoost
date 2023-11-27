import { Buffer } from 'buffer';
import event from '@shared/constants/event';
import type { IMessage } from '@shared/interfaces/commons';

chrome.runtime.onMessage.addListener((message: IMessage<string>, _, sendResponse) => {
  (async () => {
    const { event: e, payload } = message;
    if (e === event.FORMAT_EMAIL) {
      const decodedPayload = Buffer.from(payload!, 'base64').toString('utf-8');
      const dom = new DOMParser().parseFromString(decodedPayload, 'text/html');
      dom.querySelectorAll('a').forEach((a) => {
        a.setAttribute('target', '_blank');
      });
      const encodedHTML = Buffer.from(dom.documentElement.innerHTML, 'utf-8').toString('base64');
      sendResponse(encodedHTML);
    }
  })();
  return true;
});
