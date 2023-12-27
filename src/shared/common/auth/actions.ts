import event from '@shared/constants/event';
import type { IMessage } from '@shared/types/commons';

export const auth = () => {
  chrome.runtime.sendMessage<IMessage<void>>({
    event: event.LOGIN,
  });
};
