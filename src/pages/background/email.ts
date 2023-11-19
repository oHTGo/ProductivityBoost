import api from '@shared/clients/api';
import common from '@shared/constants/common';
import { getLocalStorage } from '@shared/utils/storage';
import type { BackgroundFunction } from '@pages/background';
import type { IEmail } from '@shared/interfaces/email';

interface IGetAllEmailsResponse {
  messages: [
    {
      id: string;
    },
  ];
}
interface IGetEmailResponse {
  id: string;
  internalDate: string;
  snippet: string;
  payload: {
    headers: [
      {
        name: string;
        value: string;
      },
    ];
  };
}

export const getAllEmails: BackgroundFunction<void, IEmail[]> = async () => {
  const q = 'is:unread newer_than:30d';
  const response = await api.get<IGetAllEmailsResponse>(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}`,
  );
  if (!response) return [];

  const { messages } = response;
  if (!messages) return [];

  const emails = await Promise.all(
    messages.map(({ id }) =>
      api.get<IGetEmailResponse>(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`),
    ),
  );

  return emails
    .filter((email) => !!email)
    .map((email) => {
      const { id, payload, snippet, internalDate } = email!;
      const { headers } = payload;

      return {
        id,
        name: headers.find(({ name }) => name === 'From')?.value ?? '',
        subject: headers.find(({ name }) => name === 'Subject')?.value ?? '',
        body: snippet,
        date: parseInt(internalDate),
      };
    });
};

export const openEmail: BackgroundFunction<string, void> = async (id: string) => {
  const email = await getLocalStorage(common.USER_EMAIL);
  chrome.tabs.create({ url: `https://mail.google.com/mail/u/${email}/#inbox/${id}` });
};
