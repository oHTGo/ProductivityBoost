import Sidebar from '@shared/components/sidebar';
import { DEFAULT_STYLES } from '@shared/configurations/twind';
import delay from '@shared/constants/delay';
import event from '@shared/constants/event';
import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { setEmails } from '@shared/slices/email';
import { collapse, open } from '@shared/slices/sidebar';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useInterval } from 'usehooks-ts';
import type { IMessage } from '@shared/interfaces/commons';
import type { IEmail } from '@shared/interfaces/email';

const NewTab = () => {
  const dispatch = useAppDispatch();

  const getAllEmails = () =>
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
    getAllEmails();
  }, [dispatch]);
  useInterval(() => getAllEmails(), delay.FETCH_EMAILS);

  return (
    <div className={classNames(DEFAULT_STYLES)}>
      <Sidebar onClickOutside={() => dispatch(collapse())} />
      <div className="w-screen h-screen flex justify-center items-center">
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
