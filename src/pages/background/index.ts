import { auth } from '@shared/common/auth/background';
import { deleteEmail, getAllEmails, markAsRead, openEmail } from '@shared/common/email/background';
import { setupFrame } from '@shared/common/frame/background';
import { setupOffscreen } from '@shared/common/offscreen/background';
import event from '@shared/constants/event';
import isNil from 'lodash.isnil';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import type { IMessage } from '@shared/interfaces/commons';
import type { BackgroundFunction } from '@shared/types/commons';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

console.log('background loaded');

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
