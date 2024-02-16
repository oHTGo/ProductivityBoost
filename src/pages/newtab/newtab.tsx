import { auth } from '@shared/common/auth/actions';
import { fetchEmails } from '@shared/common/email/actions';
import Sidebar from '@shared/components/sidebar';
import TextField from '@shared/components/text-field';
import { DEFAULT_STYLES } from '@shared/configurations/twind';
import common from '@shared/constants/common';
import delay from '@shared/constants/delay';
import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { setEmails } from '@shared/slices/email';
import { collapse, open } from '@shared/slices/sidebar';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { useInterval } from 'usehooks-ts';
import type { ICredential } from '@shared/types/auth';
import type { IEmail } from '@shared/types/email';

const NewTab = () => {
  const dispatch = useAppDispatch();
  const callback = (emails: IEmail[]) => dispatch(setEmails(emails));
  const [credential, setCredential] = useChromeStorageLocal<ICredential>(common.CREDENTIAL, {
    clientId: '',
    clientSecret: '',
  });

  useEffect(() => {
    dispatch(open());
    fetchEmails(callback);
  }, [dispatch]);
  useInterval(() => fetchEmails(callback), delay.FETCH_EMAILS);

  return (
    <div className={classNames(DEFAULT_STYLES)}>
      <Sidebar onClickOutside={() => dispatch(collapse())} />
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <TextField
          id="client-id"
          label="Client ID"
          value={credential.clientId}
          onChange={(e) => setCredential((prev) => ({ ...prev, clientId: e.target.value }))}
          className="mb-2 w-96"
        />
        <TextField
          id="client-secret"
          label="Client Secret"
          value={credential.clientSecret}
          onChange={(e) => setCredential((prev) => ({ ...prev, clientSecret: e.target.value }))}
          className="mb-2 w-96"
        />
        <button className="bg-stone-300 rounded-md p-2" onClick={auth}>
          Login
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
