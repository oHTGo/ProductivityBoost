import { startClock } from '@shared/common/clock/actions';
import IconButton from '@shared/components/button/icon';
import { PlayIcon, ReloadIcon, SwitchIcon } from '@shared/components/icons';
import SidebarView from '@shared/components/sidebar/view';
import common from '@shared/constants/common';
import classNames from 'classnames';
import moment from 'moment';
import { useState, type FC } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { useInterval } from 'usehooks-ts';
import type { IClockStatus } from '@shared/types/clock';

const Clock: FC = () => {
  const [status] = useChromeStorageLocal<IClockStatus>(common.CLOCK);
  const [minutes, setMinutes] = useState<string>('..');
  const [seconds, setSeconds] = useState<string>('..');
  const isBreak = status?.mode === 'break';

  const features = [
    {
      Icon: ReloadIcon,
      onClick: () => {},
    },
    {
      Icon: PlayIcon,
      onClick: async () => {
        await startClock();
      },
    },
    {
      Icon: SwitchIcon,
      onClick: () => {},
    },
  ];

  useInterval(() => {
    if (status?.status !== 'started') return;

    const duration = moment.duration(moment.unix(status?.time ?? 0).diff(moment()));
    setMinutes(duration.minutes().toString());
    setSeconds(duration.seconds().toString());
  }, moment.duration(1, 'second').asMilliseconds());

  return (
    <SidebarView>
      <div className="w-full h-full flex justify-center items-center flex-col">
        <div
          className={classNames(
            'w-64 h-32 border-1 shadow-xl rounded-3xl px-11 py-5',
            isBreak ? 'bg-gray-200' : 'bg-white',
          )}>
          <div className="flex justify-center items-center">
            <div className={classNames('prose uppercase select-none')}>{status?.mode ?? ''}</div>
          </div>
          <div className="flex justify-center items-center">
            <div className="text-4xl select-none">
              {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center py-5">
          {features.map(({ Icon, onClick }, key) => (
            <IconButton key={key} className="mx-1 shadow-md" onClick={onClick}>
              <Icon className="w-4 h-4" />
            </IconButton>
          ))}
        </div>
      </div>
    </SidebarView>
  );
};

export default Clock;
