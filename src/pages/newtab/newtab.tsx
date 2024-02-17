import { DotLottiePlayer, PlayerEvents } from '@dotlottie/react-player';
import { checkLoggedIn, login, logout } from '@shared/common/auth/actions';
import { fetchEmails } from '@shared/common/email/actions';
import GroupButton from '@shared/components/button/group';
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
import { useEffect, useRef, useState } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { useInterval } from 'usehooks-ts';
import type { DotLottieCommonPlayer } from '@dotlottie/react-player';
import type { ICredential } from '@shared/types/auth';
import type { IEmail } from '@shared/types/email';

const LOGIN_FRAMES = {
  LOG_IN: {
    start: 0,
    end: 112,
  },
  LOG_OUT: {
    start: 113,
    end: 181,
  },
};

const NewTab = () => {
  const loginRef = useRef<DotLottieCommonPlayer>(null);
  const [loginState, setLoginState] = useState<keyof typeof LOGIN_FRAMES>();

  const dispatch = useAppDispatch();
  const emailCallback = (emails: IEmail[]) => dispatch(setEmails(emails));
  const [credential, setCredential] = useChromeStorageLocal<ICredential>(common.CREDENTIAL, {
    clientId: '',
    clientSecret: '',
  });

  useEffect(() => {
    if (!loginState) return;
    loginRef.current?.playSegments([LOGIN_FRAMES[loginState].start, LOGIN_FRAMES[loginState].end], true);
  }, [loginState]);

  useEffect(() => {
    dispatch(open());
    fetchEmails(emailCallback);
  }, [dispatch]);
  useInterval(() => fetchEmails(emailCallback), delay.FETCH_EMAILS);

  return (
    <div className={classNames(DEFAULT_STYLES)}>
      <Sidebar onClickOutside={() => dispatch(collapse())} />
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <DotLottiePlayer
          ref={loginRef}
          className="w-44 h-44"
          onEvent={(e) => {
            if (e !== PlayerEvents.Ready) return;
            checkLoggedIn((isLoggedIn) => setLoginState(isLoggedIn ? 'LOG_IN' : 'LOG_OUT'));
          }}
          src={chrome.runtime.getURL('assets/lotties/login.lottie')}></DotLottiePlayer>
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
        <GroupButton
          buttons={[
            {
              label: 'Login',
              onClick: () => {
                login((isSuccess) => {
                  if (!isSuccess) return setLoginState('LOG_OUT');
                  setLoginState('LOG_IN');
                  fetchEmails(emailCallback);
                });
              },
              active: loginState === 'LOG_IN',
              disabled: loginState === 'LOG_IN',
            },
            {
              label: 'Logout',
              onClick: () => {
                logout((isSuccess) => {
                  if (!isSuccess) return setLoginState('LOG_IN');
                  setLoginState('LOG_OUT');
                  emailCallback([]);
                });
              },
              active: loginState === 'LOG_OUT',
              disabled: loginState === 'LOG_OUT',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
