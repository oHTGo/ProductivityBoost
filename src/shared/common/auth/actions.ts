import event from '@shared/constants/event';
import type { IMessage } from '@shared/types/commons';

export const login = (callback: (result: boolean) => void) => {
  chrome.runtime.sendMessage<IMessage<void>, boolean>(
    {
      event: event.LOGIN,
    },
    callback,
  );
};

export const checkLoggedIn = (callback: (result: boolean) => void) => {
  chrome.runtime.sendMessage<IMessage<void>, boolean>(
    {
      event: event.IS_LOGGED_IN,
    },
    callback,
  );
};
