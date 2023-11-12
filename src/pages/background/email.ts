import api from '@shared/clients/api';
import type { IEmail } from '@shared/interfaces/email';

const userId = '108879829292288659402';

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

export const getAllEmails = async (): Promise<IEmail[]> => {
  const q = 'is:unread newer_than:30d';
  const response = await api.get<IGetAllEmailsResponse>(
    `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages?q=${q}`,
  );
  if (!response) return [];

  const { messages } = response;
  if (!messages) return [];

  const emails = await Promise.all(
    messages.map(async ({ id }) => {
      const email = await api.get<IGetEmailResponse>(
        `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${id}`,
      );
      return email;
    }),
  );

  return emails
    .filter((email) => {
      console.log(email);
      return !!email;
    })
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
