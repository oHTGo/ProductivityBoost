import { parseEmail } from '@shared/common/offscreen/backgrounds';
import event from '@shared/constants/event';
import type { IMessage } from '@shared/types/commons';

chrome.runtime.onMessage.addListener((message: IMessage<string>, _, sendResponse) => {
  (async () => {
    const { event: e, payload } = message;
    if (e === event.PARSE_EMAIL) {
      const parsedEmail = await parseEmail(payload!);
      sendResponse(parsedEmail);
    }
  })();
  return true;
});
