import { getClientId, getClientSecret } from '@shared/configurations/auth';
import common from '@shared/constants/common';
import ky from 'ky';

const redirectUrl = chrome.identity.getRedirectURL('oauth2');

const params = {
  scope: 'https://www.googleapis.com/auth/gmail.modify',
  response_type: 'code',
  redirect_uri: redirectUrl,
  client_id: getClientId(),
  prompt: 'consent',
  access_type: 'offline',
};

function parseRedirectUrl(redirectUrl: string) {
  const params = new URLSearchParams(redirectUrl.split('?')?.[1]);
  const code = params.get('code') ?? '';

  return { code };
}

export const auth = async () => {
  const redirectUrlResponse = await chrome.identity.launchWebAuthFlow({
    url: 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams(params).toString(),
    interactive: true,
  });
  if (!redirectUrlResponse) return false;

  const { code } = parseRedirectUrl(redirectUrlResponse);
  if (!code) return false;

  const response = await ky
    .post('https://oauth2.googleapis.com/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: getClientId(),
        client_secret: getClientSecret(),
        redirect_uri: redirectUrl,
        grant_type: 'authorization_code',
      }).toString(),
    })
    .json<{ access_token: string; refresh_token: string }>();
  if (!response) return false;

  const { access_token, refresh_token } = response;

  chrome.storage.local.set({ [common.ACCESS_TOKEN]: access_token ?? '' });
  chrome.storage.local.set({ [common.REFRESH_TOKEN]: refresh_token ?? '' });

  return true;
};
