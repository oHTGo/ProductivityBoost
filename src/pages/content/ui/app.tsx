import { fetchEmails } from '@shared/common/email/actions';
import Sidebar from '@shared/components/sidebar';
import { DEFAULT_STYLES } from '@shared/configurations/twind';
import delay from '@shared/constants/delay';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { setEmails } from '@shared/slices/email';
import { open, close } from '@shared/slices/sidebar';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useInterval } from 'usehooks-ts';
import type { IEmail } from '@shared/types/email';

export default function App() {
  const dispatch = useAppDispatch();
  const callback = (emails: IEmail[]) => dispatch(setEmails(emails));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.x <= 2) return dispatch(open());
    };
    window.addEventListener('mousemove', handleMouseMove);

    fetchEmails(callback);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch]);
  useInterval(() => fetchEmails(callback), delay.FETCH_EMAILS);

  return (
    <div className={classNames(DEFAULT_STYLES, 'fixed z-[2147483645] h-full')}>
      <Sidebar onClickOutside={() => dispatch(close())} />
    </div>
  );
}
