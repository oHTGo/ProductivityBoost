import event from '@shared/constants/event';
import moment from 'moment';
import { useState, type FC, useEffect } from 'react';
import type { IEmail } from '@shared/interfaces/email';

const Email: FC = () => {
  const [emails, setEmails] = useState<IEmail[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage<string, IEmail[]>(event.GET_ALL_EMAILS, (emails) => {
      setEmails(emails ?? []);
    });
  }, []);

  return (
    <div>
      {emails.map(({ id, name, date, subject, body }) => (
        <div key={id} className="border-0 border-y border-gray-200 border-solid py-2">
          <h5 className="text-sm m-0 my-2">
            {name} - {moment(date).format('DD/MM/YYYY')}
          </h5>
          <div>
            <span className="text-xs font-bold">{subject}</span>
            <p className="text-xs truncate m-0 mt-1">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Email;
