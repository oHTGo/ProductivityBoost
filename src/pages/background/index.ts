import { auth } from '@pages/background/auth';
import { deleteEmail, getAllEmails, markAsRead, openEmail } from '@pages/background/email';
import { setupFrame } from '@pages/background/frame';
import { setupOffscreen } from '@pages/background/offscreen';
import event from '@shared/constants/event';
import isNil from 'lodash.isnil';
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
  [event.MARK_AS_READ]: markAsRead,
  [event.DELETE_EMAIL]: deleteEmail,
};
chrome.runtime.onMessage.addListener((message: IMessage<unknown>, _, sendResponse) => {
  (async () => {
    const { event, payload } = message;

    const func = eventsMap[event];
    if (!func) return sendResponse();

    const response = !isNil(payload) ? await func(payload) : await func();
    sendResponse(response);
  })();
  return true;
});

setupFrame();
setupOffscreen();
