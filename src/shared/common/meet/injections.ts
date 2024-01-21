import moment from 'moment';
import type { InjectedConfiguration } from '@shared/types/commons';

const checkMutedButton = (button: HTMLDivElement) => {
  return button?.getAttribute('data-is-muted') === 'true';
};

const injectedConfiguration: InjectedConfiguration = {
  domains: ['meet.google.com'],
  duration: moment.duration(0.3, 'second').asMilliseconds(),
  run: async () => {
    const microButton = document.querySelector<HTMLDivElement>('[jsname="Dg9Wp"] [data-is-muted]');
    const cameraButton = document.querySelector<HTMLDivElement>('[jsname="R3GXJb"] [data-is-muted]');

    if (!microButton || !cameraButton) {
      return false;
    }

    if (!checkMutedButton(microButton)) {
      microButton.click();
    }
    if (!checkMutedButton(cameraButton)) {
      cameraButton.click();
    }

    return true;
  },
};

export default injectedConfiguration;
