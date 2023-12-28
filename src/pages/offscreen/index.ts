import { parseEmail, playSound } from '@shared/common/offscreen/backgrounds';
import event from '@shared/constants/event';
import isNil from 'lodash.isnil';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import type { BackgroundFunction, IMessage } from '@shared/types/commons';

refreshOnUpdate('pages/offscreen');

const eventsMap: Record<string, BackgroundFunction<unknown, unknown>> = {
  [event.PARSE_EMAIL]: parseEmail,
  [event.PLAY_SOUND]: playSound,
};
chrome.runtime.onMessage.addListener((message: IMessage<unknown>, _, sendResponse) => {
  (async () => {
    const { event, payload } = message;

    const func = eventsMap[event];
    if (!func) return;

    const response = !isNil(payload) ? await func(payload) : await func();
    sendResponse(response);
  })();
  return true;
});
