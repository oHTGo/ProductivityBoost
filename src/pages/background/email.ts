import { Buffer } from 'buffer';
import api from '@shared/clients/api';
import common from '@shared/constants/common';
import { getLocalStorage } from '@shared/utils/storage';
import unescape from 'lodash/unescape';
import type { BackgroundFunction } from '@pages/background';
import type { IEmail } from '@shared/interfaces/email';

interface IGetAllEmailsResponse {
  messages: [
    {
      id: string;
    },
  ];
}
interface IPart {
  headers: [
    {
      name: string;
      value: string;
    },
  ];
  mimeType: string;
  body: {
    data: string;
  };
  parts?: IPart[];
}
interface IGetEmailResponse {
  id: string;
  internalDate: string;
  snippet: string;
  payload: IPart;
}

const getBody = (parts: IPart[]) => {
  const alternative = parts.find(
    (item) => item.mimeType === 'multipart/alternative' || item.mimeType === 'multipart/related',
  );
  if (alternative) {
    return getBody(alternative.parts!);
  }

  const base64HTML = parts.find((item) => item.mimeType === 'text/html')?.body?.data ?? '';
  if (!base64HTML) return '';

  try {
    const buffer = Buffer.from(base64HTML, 'base64');
    const html = buffer.toString('utf-8');
    const insertedHtml = html.includes('<body>')
      ? html
      : `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${html}</body></html>`;

    return `data:text/html;base64,${Buffer.from(insertedHtml, 'utf-8').toString('base64')}`;
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

  return emails
    .filter((email) => !!email)
    .map((email) => {
      const { id, payload, snippet, internalDate } = email!;
      const { headers, parts } = payload;

      return {
        id,
        name: headers.find(({ name }) => name === 'From')?.value ?? '',
        subject: headers.find(({ name }) => name === 'Subject')?.value ?? '',
        snippet: unescape(snippet),
        body: parts ? getBody(parts) : getBody([payload]),
        date: parseInt(internalDate),
      };
    });
};

export const openEmail: BackgroundFunction<string, void> = async (id: string) => {
  const email = await getLocalStorage<string>(common.USER_EMAIL);
  chrome.tabs.create({ url: `https://mail.google.com/mail/u/${email}/#inbox/${id}` });
};
