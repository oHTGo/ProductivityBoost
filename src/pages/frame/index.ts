import { DEFAULT_SCROLLBAR_STYLES } from '@shared/configurations/twind';
import moment from 'moment';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/newtab');

const insertScrollbarStyles = (document: Document | null) => {
  const style = window.document.createElement('style');
  style.innerHTML = DEFAULT_SCROLLBAR_STYLES.join('\n');
  document?.head.appendChild(style);
};
document.addEventListener('DOMContentLoaded', () => {
  insertScrollbarStyles(document);
});

const params = new URLSearchParams(window.location.search);
const src = decodeURIComponent(params.get('src') ?? '');

const loader = document.querySelector('.loader') as HTMLDivElement;
const iframe = document.createElement('iframe');
iframe.src = src;
iframe.style.visibility = 'hidden';
iframe.addEventListener('load', () => {
  insertScrollbarStyles(iframe.contentDocument);
  iframe.style.visibility = 'visible';
  loader.style.display = 'none';
});
setTimeout(() => {
  iframe.style.visibility = 'visible';
  loader.style.display = 'none';
}, moment.duration(5, 'seconds').asMilliseconds());

document.body.appendChild(iframe);
