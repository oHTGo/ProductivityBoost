import { auth } from '@pages/background/auth';
import { getAllEmails, openEmail } from '@pages/background/email';
import { setupFrame } from '@pages/background/frame';
import event from '@shared/constants/event';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import type { IMessage } from '@shared/interfaces/commons';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

console.log('background loaded');

export type BackgroundFunction<TPayload, TResult> = (payload?: TPayload) => Promise<TResult>;

const eventsMap: Record<string, BackgroundFunction<unknown, unknown>> = {
  [event.LOGIN]: auth,
  [event.GET_ALL_EMAILS]: getAllEmails,
  [event.OPEN_EMAIL]: openEmail,
};
chrome.runtime.onMessage.addListener((message: IMessage<unknown>, _, sendResponse) => {
  (async () => {
    const { event, payload } = message;

    const func = eventsMap[event];
    if (!func) return sendResponse();

    const response = payload ? await func(payload) : await func();
    sendResponse(response);
  })();
  return true;
});

setupFrame();
