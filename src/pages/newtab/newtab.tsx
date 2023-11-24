import Sidebar from '@shared/components/sidebar';
import { DEFAULT_STYLES } from '@shared/configurations/twind';
import delay from '@shared/constants/delay';
import event from '@shared/constants/event';
import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import useStorage from '@shared/hooks/use-storage';
import { setEmails } from '@shared/slices/email';
import { collapse, open } from '@shared/slices/sidebar';
import credentialStorage from '@shared/storages/credential';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useInterval } from 'usehooks-ts';
import type { IMessage } from '@shared/interfaces/commons';
import type { IEmail } from '@shared/interfaces/email';

const NewTab = () => {
  const dispatch = useAppDispatch();
  const { clientId, clientSecret } = useStorage(credentialStorage);

  const fetchAllEmails = () =>
    chrome.runtime.sendMessage<IMessage<void>, IEmail[]>(
      {
        event: event.GET_ALL_EMAILS,
      },
      (emails) => {
        dispatch(setEmails(emails ?? []));
      },
    );

  useEffect(() => {
    dispatch(open());
    fetchAllEmails();
  }, [dispatch]);
  useInterval(() => fetchAllEmails(), delay.FETCH_EMAILS);

  return (
    <div className={classNames(DEFAULT_STYLES)}>
      <Sidebar onClickOutside={() => dispatch(collapse())} />
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="mb-2 w-96">
          <label htmlFor="id" className="block text-xs font-medium text-gray-700">
            Client ID
          </label>
          <input
            type="text"
            id="id"
            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
            value={clientId}
            onChange={(e) => credentialStorage.setClientId(e.target.value)}
          />
        </div>
        <div className="mb-2 w-96">
          <label htmlFor="secret" className="block text-xs font-medium text-gray-700">
            Client Secret
          </label>
          <input
            type="password"
            id="secret"
            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
            value={clientSecret}
            onChange={(e) => credentialStorage.setClientSecret(e.target.value)}
          />
        </div>
        <button
          className="bg-stone-300 rounded-md p-2"
          onClick={() => {
            chrome.runtime.sendMessage<IMessage<void>>({
              event: event.LOGIN,
            });
          }}>
          Login
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
