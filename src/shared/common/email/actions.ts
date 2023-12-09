import event from '@shared/constants/event';
import type { IMessage } from '@shared/interfaces/commons';
import type { IEmail } from '@shared/interfaces/email';

export const fetchEmails = (callback: (emails: IEmail[]) => void) => {
  chrome.runtime.sendMessage<IMessage<void>, IEmail[]>(
    {
      event: event.GET_ALL_EMAILS,
    },
    callback,
  );
};

export const markAsRead = (id: string) => {
  chrome.runtime.sendMessage<IMessage<string>>({
    event: event.MARK_AS_READ,
    payload: id,
  });
};

export const openEmail = (id: string) => {
  chrome.runtime.sendMessage<IMessage<string>>({
    event: event.OPEN_EMAIL,
    payload: id,
  });
};

export const deleteEmail = (id: string) => {
  chrome.runtime.sendMessage<IMessage<string>>({
    event: event.DELETE_EMAIL,
    payload: id,
  });
};
