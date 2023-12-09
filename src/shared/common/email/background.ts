import api from '@shared/clients/api';
import { parseEmail } from '@shared/common/offscreen/action';
import common from '@shared/constants/common';
import { getLocalStorage } from '@shared/utils/storage';
import unescape from 'lodash/unescape';
import type { IPart, IGetAllEmailsResponse, IGetEmailResponse } from '@shared/common/email/interfaces';
import type { IEmail } from '@shared/interfaces/email';
import type { BackgroundFunction } from '@shared/types/commons';

const getBody = async (parts: IPart[]) => {
  const alternative = parts.find(
    (item) => item.mimeType === 'multipart/alternative' || item.mimeType === 'multipart/related',
  );
  if (alternative) {
    return getBody(alternative.parts!);
  }

  const base64HTML = parts.find((item) => item.mimeType === 'text/html')?.body?.data ?? '';
  if (!base64HTML) {
    const base64Text = parts.find((item) => item.mimeType === 'text/plain')?.body?.data ?? '';
    return `data:text/plain;charset=utf-8;base64,${base64Text}`;
  }

  try {
    const parsedEmail: string = await parseEmail(base64HTML);
    return `data:text/html;charset=utf-8;base64,${parsedEmail}`;
  } catch (error) {
    return '';
  }
};

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

  return await Promise.all(
    emails
      .filter((email) => !!email)
      .map(async (email) => {
        const { id, payload, snippet, internalDate } = email!;
        const { headers, parts } = payload;

        return {
          id,
          name: headers.find(({ name }) => name === 'From')?.value ?? '',
          subject: headers.find(({ name }) => name === 'Subject')?.value ?? '',
          snippet: unescape(snippet),
          body: parts ? await getBody(parts) : await getBody([payload]),
          date: Number(internalDate),
        };
      }),
  );
};

export const openEmail: BackgroundFunction<string, void> = async (id: string) => {
  const email = await getLocalStorage<string>(common.USER_EMAIL);
  chrome.tabs.create({ url: `https://mail.google.com/mail/u/${email}/#inbox/${id}` });
};

export const markAsRead: BackgroundFunction<string, void> = async (id: string) => {
  await api.post(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
    removeLabelIds: ['UNREAD'],
  });
};

export const deleteEmail: BackgroundFunction<string, void> = async (id: string) => {
  await api.post(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`);
};
