import common from '@shared/constants/common';
import { getLocalStorage } from '@shared/utils/storage';
import type { ICredential } from '@shared/interfaces/commons';

export const getConsentClientId = () => {
  return import.meta.env.VITE_CONSENT_CLIENT_ID as string;
};

export const getRefreshClientId = () => {
  return import.meta.env.VITE_REFRESH_CLIENT_ID as string;
};

export const getCustomClientId = async (): Promise<string | undefined> => {
  const credential = await getLocalStorage<ICredential>(common.CREDENTIAL);
  return credential?.clientId;
};

export const getCustomClientSecret = async (): Promise<string | undefined> => {
  const credential = await getLocalStorage<ICredential>(common.CREDENTIAL);
  return credential?.clientSecret;
};

export const checkCustomClient = async (): Promise<boolean> => {
  const clientId = await getCustomClientId();
  const clientSecret = await getCustomClientSecret();
  return Boolean(clientId) && Boolean(clientSecret);
};
