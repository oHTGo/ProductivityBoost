export const getConsentClientId = () => {
  return import.meta.env.VITE_CONSENT_CLIENT_ID as string;
};

export const getRefreshClientId = () => {
  return import.meta.env.VITE_REFRESH_CLIENT_ID as string;
};
