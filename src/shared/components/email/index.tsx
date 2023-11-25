import event from '@shared/constants/event';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import useAppSelector from '@shared/hooks/use-app-selector';
import { getEmails, setEmails } from '@shared/slices/email';
import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
import type { IMessage } from '@shared/interfaces/commons';
import type { FC, SVGProps } from 'react';

const EmptyIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 462.035 462.035"
    xmlSpace="preserve"
    {...props}>
    <g>
      <path d="M457.83,158.441c-0.021-0.028-0.033-0.058-0.057-0.087l-50.184-62.48c-0.564-0.701-1.201-1.305-1.879-1.845 c-2.16-2.562-5.355-4.225-8.967-4.225H65.292c-3.615,0-6.804,1.661-8.965,4.225c-0.678,0.54-1.316,1.138-1.885,1.845l-50.178,62.48 c-0.023,0.029-0.034,0.059-0.057,0.087C1.655,160.602,0,163.787,0,167.39v193.07c0,6.5,5.27,11.771,11.77,11.771h438.496 c6.5,0,11.77-5.271,11.77-11.771V167.39C462.037,163.787,460.381,160.602,457.83,158.441z M408.516,134.615l16.873,21.005h-16.873 V134.615z M384.975,113.345v42.274H296.84c-2.514,0-4.955,0.805-6.979,2.293l-58.837,43.299l-58.849-43.305 c-2.023-1.482-4.466-2.287-6.978-2.287H77.061v-42.274H384.975z M53.523,155.62H36.65l16.873-21.005V155.62z M438.498,348.69H23.54 V179.16h137.796l62.711,46.148c4.15,3.046,9.805,3.052,13.954-0.005l62.698-46.144h137.799V348.69L438.498,348.69z" />
    </g>
  </svg>
);
const BackIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 45.58 45.58"
    strokeWidth={2}
    xmlSpace="preserve"
    {...props}>
    <g>
      <path d="M45.506,33.532c-1.741-7.42-7.161-17.758-23.554-19.942V7.047c0-1.364-0.826-2.593-2.087-3.113 c-1.261-0.521-2.712-0.229-3.675,0.737L1.305,19.63c-1.739,1.748-1.74,4.572-0.001,6.32L16.19,40.909 c0.961,0.966,2.415,1.258,3.676,0.737c1.261-0.521,2.087-1.75,2.087-3.113v-6.331c5.593,0.007,13.656,0.743,19.392,4.313 c0.953,0.594,2.168,0.555,3.08-0.101C45.335,35.762,45.763,34.624,45.506,33.532z" />
    </g>
  </svg>
);
const OpenIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...props}>
    <path
      d="M5 12V6C5 5.44772 5.44772 5 6 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H12M8.11111 12H12M12 12V15.8889M12 12L5 19"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const markAsRead = (id: string) => {
  chrome.runtime.sendMessage<IMessage<string>>({
    event: event.MARK_AS_READ,
    payload: id,
  });
};
const openEmail = (id: string) => {
  chrome.runtime.sendMessage<IMessage<string>>({
    event: event.OPEN_EMAIL,
    payload: id,
  });
};

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
          <span className="prose prose-sm prose-slate">No emails</span>
          <EmptyIcon className="w-11 h-11 fill-black" />
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
    <>
      <div className="h-5 border-b-2 flex justify-evenly items-center">
        <BackIcon
          className="stroke-black fill-white w-3 h-3 cursor-pointer hover:scale-110"
          onClick={() => setEmail(undefined)}
        />
        <OpenIcon
          className="stroke-black fill-white w-3 h-3 cursor-pointer hover:scale-110"
          onClick={() => openEmail(email?.id ?? '')}
        />
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto">{render()}</div>
    </>
  );
};

export default Email;
