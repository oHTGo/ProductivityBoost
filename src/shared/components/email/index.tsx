import event from '@shared/constants/event';
import moment from 'moment';
import { useState, type FC, useEffect } from 'react';
import type { IMessage } from '@shared/interfaces/commons';
import type { IEmail } from '@shared/interfaces/email';

const Email: FC = () => {
  const [emails, setEmails] = useState<IEmail[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage<IMessage, IEmail[]>(
      {
        event: event.GET_ALL_EMAILS,
      },
      (emails) => {
        setEmails(emails ?? []);
      },
    );
  }, []);

  return (
    <div className="overflow-hidden">
      {emails.map(({ id, name, date, subject, body }) => (
        <div
          key={id}
          className="border-0 border-y border-gray-200 border-solid py-2 cursor-pointer"
          onClick={() => {
            chrome.runtime.sendMessage<IMessage>({
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
