import event from '@shared/constants/event';
import useAppSelector from '@shared/hooks/use-app-selector';
import { getEmails } from '@shared/slices/email';
import moment from 'moment';
import { type FC } from 'react';
import type { IMessage } from '@shared/interfaces/commons';

const Email: FC = () => {
  const emails = useAppSelector(getEmails);

  return (
    <div className="overflow-y-auto overflow-x-hidden w-full h-full">
      {emails.map(({ id, name, date, subject, body }) => (
        <div
          key={id}
          className="border-0 border-y border-gray-200 border-solid py-2 cursor-pointer"
          onClick={() => {
            chrome.runtime.sendMessage<IMessage<string>>({
              event: event.OPEN_EMAIL,
              payload: id,
            });
          }}>
          <div className="text-sm my-2 flex justify-between">
            <span className="font-bold">{name}</span>
            <span className="text-xs">{moment(date).format('DD/MM/YYYY')}</span>
          </div>
          <div>
            <span className="text-xs font-bold truncate">{subject}</span>
            <p className="text-xs truncate m-0 mt-1">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Email;
