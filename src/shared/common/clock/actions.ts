import event from '@shared/constants/event';
import type { IMessage } from '@shared/types/commons';

export const startClock = async (): Promise<void> =>
  chrome.runtime.sendMessage<IMessage<void>>({
    event: event.START_CLOCK,
  });
