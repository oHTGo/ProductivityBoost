import common from '@shared/constants/common';
import { StorageType, createStorage } from '@shared/storages/base';
import type { BaseStorage } from '@shared/storages/base';
import type { ICredential } from '@shared/types/auth';

const storage = createStorage<ICredential>(
  common.CREDENTIAL,
  {
    clientId: '',
    clientSecret: '',
  },
  {
    storageType: StorageType.Local,
  },
);

type CredentialStorage = BaseStorage<ICredential> & {
  setClientId: (clientId: string) => void;
  setClientSecret: (clientSecret: string) => void;
};
const credentialStorage: CredentialStorage = {
  ...storage,
  setClientId: (clientId: string) => storage.set((prev) => ({ ...prev, clientId })),
  setClientSecret: (clientSecret: string) => storage.set((prev) => ({ ...prev, clientSecret })),
};
export default credentialStorage;
