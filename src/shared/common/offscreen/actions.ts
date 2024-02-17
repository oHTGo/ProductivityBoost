import event from '@shared/constants/event';
import type { IMessage } from '@shared/types/commons';

export const parseEmail = async (base64Email: string): Promise<string> => {
  return await chrome.runtime.sendMessage<IMessage<string>>({ event: event.PARSE_EMAIL, payload: base64Email });
};
