import { DEFAULT_SCROLLBAR_STYLES } from '@shared/configurations/twind';

const params = new URLSearchParams(window.location.search);
const src = decodeURIComponent(params.get('src') ?? '');

const iframe = document.createElement('iframe');
iframe.src = src;
iframe.style.visibility = 'hidden';
iframe.addEventListener('load', () => {
  const style = document.createElement('style');
  style.innerHTML = DEFAULT_SCROLLBAR_STYLES.join('\n');
  iframe.contentDocument?.head.appendChild(style);
  iframe.style.visibility = 'visible';
});

document.body.appendChild(iframe);
