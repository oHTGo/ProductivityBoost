import emptyLottie from '@assets/lotties/empty.json';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { fetchEmails, openEmail, deleteEmail, markAsRead } from '@shared/common/email/action';
import { BackIcon, DeleteIcon, OpenIcon, ReloadIcon } from '@shared/components/icons/outline';
import SidebarView from '@shared/components/sidebar/view';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import useAppSelector from '@shared/hooks/use-app-selector';
import { getEmails, setEmails } from '@shared/slices/email';
import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
import type { FC } from 'react';

const Email: FC = () => {
  const emails = useAppSelector(getEmails);
  const [email, setEmail] = useState<{
    id: string;
    body: string;
  }>();
  const dispatch = useAppDispatch();

  const render = () => {
    if (email) {
      const frameUrl = chrome.runtime.getURL('src/pages/frame/index.html');
      return (
        <iframe className="w-full h-full" src={`${frameUrl}?src=${encodeURIComponent(email.body)}`} title="content" />
      );
    }

    if (emails.length === 0)
      return (
        <div className="w-full h-full flex justify-center items-center flex-col">
          <div>
            <DotLottiePlayer className="w-20 h-20" src={emptyLottie} autoplay loop></DotLottiePlayer>
          </div>
          <span className="prose prose-sm prose-slate">No email</span>
        </div>
      );

    return emails.map(({ id, name, date, subject, body, snippet }, index) => (
      <div
        key={id}
        className={classNames('border-0 border-y border-gray-200 py-2 cursor-pointer mx-1', {
          'border-t-0': index === 0,
        })}
        onClick={() => {
          setEmail({ id, body });
          markAsRead(id);
          dispatch(setEmails(emails.filter((email) => email.id !== id)));
        }}>
        <div className="text-sm my-2 flex justify-between">
          <span className="font-bold truncate">{name}</span>
          <span className="text-xs">{moment(date).format('DD/MM/YYYY')}</span>
        </div>
        <div>
          <span className="text-xs font-bold truncate">{subject}</span>
          <p className="text-xs truncate m-0 mt-1">{snippet}</p>
        </div>
      </div>
    ));
  };

  return (
    <SidebarView
      startMenu={[
        {
          Icon: BackIcon,
          onClick: () => setEmail(undefined),
          isHide: !email,
        },
        {
          Icon: DeleteIcon,
          onClick: () => {
            deleteEmail(email!.id);
            setEmail(undefined);
          },
          isHide: !email,
        },
      ]}
      endMenu={[
        {
          Icon: ReloadIcon,
          onClick: () => {
            fetchEmails((emails) => dispatch(setEmails(emails)));
          },
          isHide: !!email,
        },
        {
          Icon: OpenIcon,
          onClick: () => openEmail(email?.id ?? ''),
        },
      ]}
      content={render()}
    />
  );
};

export default Email;
