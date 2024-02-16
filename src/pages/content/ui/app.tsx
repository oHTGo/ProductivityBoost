import { fetchEmails } from '@shared/common/email/actions';
import Sidebar from '@shared/components/sidebar';
import { DEFAULT_STYLES, MAX_Z_INDEX } from '@shared/configurations/twind';
import delay from '@shared/constants/delay';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { setEmails } from '@shared/slices/email';
import { open, close } from '@shared/slices/sidebar';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect } from 'react';
import { useInterval, useDebounceValue } from 'usehooks-ts';
import type { IEmail } from '@shared/types/email';

export default function App() {
  const dispatch = useAppDispatch();
  const callback = (emails: IEmail[]) => dispatch(setEmails(emails));
  const [position, setPosition] = useDebounceValue(-1, moment.duration(0.3, 'second').asMilliseconds());

  useEffect(() => {
    if (0 <= position && position <= 5) dispatch(open());
  }, [position]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (e.clientY < 0 || e.clientX < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight)
        return setPosition(-1);

      setPosition(e.x);
    };

    window.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseleave', handleMouse);

    fetchEmails(callback);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseleave', handleMouse);
    };
  }, [dispatch]);
  useInterval(() => fetchEmails(callback), delay.FETCH_EMAILS);

  return (
    <div className={classNames(DEFAULT_STYLES, MAX_Z_INDEX, 'fixed h-full')}>
      <Sidebar onClickOutside={() => dispatch(close())} />
    </div>
  );
}
