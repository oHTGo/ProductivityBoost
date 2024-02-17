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

const ANIMATION_FRAMES = {
  LOGIN: {
    start: 0,
    end: 112,
  },
  LOGOUT: {
    start: 113,
    end: 181,
  },
};

const NewTab = () => {
  const loginRef = useRef<DotLottieCommonPlayer>(null);
  const [loginState, setLoginState] = useState<keyof typeof ANIMATION_FRAMES>();

  const dispatch = useAppDispatch();
  const emailCallback = (emails: IEmail[]) => dispatch(setEmails(emails));
  const [credential, setCredential] = useChromeStorageLocal<ICredential>(common.CREDENTIAL, {
    clientId: '',
    clientSecret: '',
  });

  useEffect(() => {
    if (!loginState) return;
    loginRef.current?.playSegments([ANIMATION_FRAMES[loginState].start, ANIMATION_FRAMES[loginState].end], true);
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
          className="w-32 h-32"
          renderer="canvas"
          onEvent={(e) => {
            if (e !== PlayerEvents.Ready) return;
            checkLoggedIn((isLoggedIn) => setLoginState(isLoggedIn ? 'LOGIN' : 'LOGOUT'));
          }}
          src={chrome.runtime.getURL('assets/lotties/login.lottie')}
        />
        {loginState === 'LOGIN' ? <span className="prose prose-neutral">Logged in</span> : null}
        {loginState === 'LOGOUT' ? (
          <span className="prose prose-neutral">Please login to use this extension</span>
        ) : null}
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
                  if (!isSuccess) return setLoginState('LOGOUT');
                  setLoginState('LOGIN');
                  fetchEmails(emailCallback);
                });
              },
              active: loginState === 'LOGIN',
              disabled: loginState === 'LOGIN',
            },
            {
              label: 'Logout',
              onClick: () => {
                logout((isSuccess) => {
                  if (!isSuccess) return setLoginState('LOGIN');
                  setLoginState('LOGOUT');
                  emailCallback([]);
                });
              },
              active: loginState === 'LOGOUT',
              disabled: loginState === 'LOGOUT',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
