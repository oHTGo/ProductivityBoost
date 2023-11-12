import { auth } from '@pages/background/auth';
import { getAllEmails } from '@pages/background/email';
import event from '@shared/constants/event';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');
reloadOnUpdate('shared/styles/global.css');

console.log('background loaded');

const messageMap = {
  [event.LOGIN]: auth,
  [event.GET_ALL_EMAILS]: getAllEmails,
};

chrome.runtime.onMessage.addListener((eventMessage, _, sendResponse) => {
  (async () => {
    const messageFunction = messageMap[eventMessage];
    if (!messageFunction) return sendResponse();
    const response = await messageFunction();
    sendResponse(response);
  })();
  return true;
});
