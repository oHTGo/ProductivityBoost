import meetInjectedConfiguration from '@shared/common/meet/injections';
import moment from 'moment';
import type { InjectedConfiguration } from '../../shared/types/commons';

const queue: InjectedConfiguration[] = [meetInjectedConfiguration];
const allDomains = queue.flatMap((item) => item.domains);

const asyncLoop = () => {
  if (!allDomains.some((domain) => document.URL.includes(domain))) return;

  setTimeout(async () => {
    if (queue.length === 0) return asyncLoop();

    const current = queue.shift()!;
    const { run, duration } = current;

    setTimeout(async () => {
      const result = await run();
      if (!result) {
        queue.push(current);
      }
    }, duration);

    asyncLoop();
  }, moment.duration(0.1, 'second').asMilliseconds());
};

asyncLoop();
export {};
