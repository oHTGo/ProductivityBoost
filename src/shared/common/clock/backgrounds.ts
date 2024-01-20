// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { playSound } from '@shared/common/offscreen/actions';
import common from '@shared/constants/common';
import { getLocalStorage, setLocalStorage, updateLocalStorage } from '@shared/utils/storage';
import moment from 'moment';
import type { IClockStatus } from '@shared/types/clock';
import type { BackgroundFunction } from '@shared/types/commons';

export const setupClock = async () => {
  chrome.runtime.onInstalled.addListener(async () => {
    await setLocalStorage<IClockStatus>(common.CLOCK, {
      mode: 'pomodoro',
      status: 'stopped',
      time: 0,
    });
  });

  chrome.runtime.onStartup.addListener(async () => {
    await setLocalStorage<IClockStatus>(common.CLOCK, {
      mode: 'pomodoro',
      status: 'stopped',
      time: 0,
    });
  });

  setInterval(async () => {
    const status = await getLocalStorage<IClockStatus>(common.CLOCK);
    if (!status) return;
    if (status.status !== 'started') return;

    const diffInMinutes = moment.unix(status.time).diff(moment());
    if (diffInMinutes > 0) return;

    await updateLocalStorage<IClockStatus>(common.CLOCK, {
      mode: status.mode === 'pomodoro' ? 'break' : 'pomodoro',
      time: moment()
        .add(status?.mode === 'pomodoro' ? 25 : 5, 'minutes')
        .unix(),
    });

    // await playSound(chrome.runtime.getURL('assets/audios/cheerful-ding.mp3'));
  }, moment.duration(1, 'second').asMilliseconds());
};

export const startClock: BackgroundFunction<void, void> = async () => {
  const status = await getLocalStorage<IClockStatus>(common.CLOCK);

  await updateLocalStorage<IClockStatus>(common.CLOCK, {
    status: 'started',
    time: moment()
      .add(status?.mode === 'pomodoro' ? 25 : 5, 'minutes')
      .unix(),
  });
};

export const resetClock: BackgroundFunction<void, void> = async () => {
  await updateLocalStorage<IClockStatus>(common.CLOCK, {
    status: 'stopped',
    time: 0,
  });
};

export const switchClock: BackgroundFunction<void, void> = async () => {
  const status = await getLocalStorage<IClockStatus>(common.CLOCK);
  if (!status) return;

  await updateLocalStorage<IClockStatus>(common.CLOCK, {
    mode: status.mode === 'pomodoro' ? 'break' : 'pomodoro',
    status: 'stopped',
  });
};
