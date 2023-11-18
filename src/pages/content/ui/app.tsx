import Sidebar from '@shared/components/sidebar';
import { DEFAULT_STYLES } from '@shared/configurations/twind';
import delay from '@shared/constants/delay';
import event from '@shared/constants/event';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { setEmails } from '@shared/slices/email';
import { open, close } from '@shared/slices/sidebar';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useInterval } from 'usehooks-ts';
import type { IMessage } from '@shared/interfaces/commons';
import type { IEmail } from '@shared/interfaces/email';

export default function App() {
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
    const handleMouseMove = (e: MouseEvent) => {
      if (e.x <= 2) return dispatch(open());
    };
    window.addEventListener('mousemove', handleMouseMove);

    getAllEmails();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch]);
  useInterval(() => getAllEmails, delay.FETCH_EMAILS);

  return (
    <div className={classNames(DEFAULT_STYLES, 'fixed z-[1000] h-full')}>
      <Sidebar onClickOutside={() => dispatch(close())} />
    </div>
  );
}
