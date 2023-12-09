import event from '@shared/constants/event';
import type { IMessage } from '@shared/interfaces/commons';

export const auth = () => {
  chrome.runtime.sendMessage<IMessage<void>>({
    event: event.LOGIN,
  });
};
