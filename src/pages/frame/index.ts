import { DEFAULT_SCROLLBAR_STYLES } from '@shared/configurations/twind';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/newtab');

const createScrollbarStyles = (document: Document | null) => {
  const style = window.document.createElement('style');
  style.innerHTML = DEFAULT_SCROLLBAR_STYLES.join('\n');
  document?.head.appendChild(style);
};
document.addEventListener('DOMContentLoaded', () => {
  createScrollbarStyles(document);
});

const params = new URLSearchParams(window.location.search);
const src = decodeURIComponent(params.get('src') ?? '');

const loader = document.querySelector('.loader') as HTMLDivElement;
const iframe = document.createElement('iframe');
iframe.src = src;
iframe.style.visibility = 'hidden';
iframe.addEventListener('load', () => {
  createScrollbarStyles(iframe.contentDocument);
  iframe.style.visibility = 'visible';
  loader.style.display = 'none';
});

document.body.appendChild(iframe);
