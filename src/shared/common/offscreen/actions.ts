import event from '@shared/constants/event';
import type { IMessage } from '@shared/types/commons';

export const parseEmail = async (base64Email: string): Promise<string> => {
  return await chrome.runtime.sendMessage<IMessage<string>>({
    event: event.PARSE_EMAIL,
    payload: base64Email,
  });
};

export const playSound = async (url: string): Promise<void> => {
  return await chrome.runtime.sendMessage<IMessage<string>>({
    event: event.PLAY_SOUND,
    payload: url,
  });
};
