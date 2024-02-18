import { login, isLoggedIn, logout } from '@shared/common/auth/backgrounds';
import { deleteEmail, getAllEmails, markAsRead, openEmail } from '@shared/common/email/backgrounds';
import { setupFrame } from '@shared/common/frame/backgrounds';
import { setupOffscreen } from '@shared/common/offscreen/backgrounds';
import event from '@shared/constants/event';
import isNil from 'lodash.isnil';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import type { IMessage, BackgroundFunction } from '@shared/types/commons';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

console.log('background loaded');

const eventsMap: Record<string, BackgroundFunction<unknown, unknown>> = {
  [event.LOGIN]: login,
  [event.LOGOUT]: logout,
  [event.IS_LOGGED_IN]: isLoggedIn,
  [event.GET_ALL_EMAILS]: getAllEmails,
  [event.OPEN_EMAIL]: openEmail,
  [event.MARK_AS_READ]: markAsRead,
  [event.DELETE_EMAIL]: deleteEmail,
};
chrome.runtime.onMessage.addListener((message: IMessage<unknown>, _, sendResponse) => {
  (async () => {
    try {
      const { event, payload } = message;

      const func = eventsMap[event];
      if (!func) return sendResponse();

      const response = !isNil(payload) ? await func(payload) : await func();
      sendResponse(response);
    } catch (err) {
      console.error('Something went wrong at background script', err);
      sendResponse();
    }
  })();
  return true;
});

setupFrame();
setupOffscreen();
