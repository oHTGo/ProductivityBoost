import App from '@pages/content/ui/app';
import { store } from '@shared/common/store';
import config, { DEFAULT_SCROLLBAR_STYLES } from '@shared/configurations/twind';
import { close } from '@shared/slices/sidebar';
import { twind, cssom, observe } from '@twind/core';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import 'construct-style-sheets-polyfill';

refreshOnUpdate('pages/content');

const CLICK_OUTSIDE = 'CLICK_OUTSIDE';
const checkWindowInIframe = (window: Window) => {
  try {
    return window.self !== window.top;
  } catch (error) {
    return true;
  }
};
(() => {
  if (checkWindowInIframe(window)) {
    window.addEventListener('click', () => window.parent.postMessage(CLICK_OUTSIDE, '*'));
    return;
  }
  window.addEventListener('message', ({ data }) => {
    if (data === CLICK_OUTSIDE) {
      store.dispatch(close());
    }
  });

  const root = document.createElement(chrome.runtime.getManifest().name);
  document.body.parentNode?.append(root);

  const sheet = cssom(new CSSStyleSheet());
  for (const rule of DEFAULT_SCROLLBAR_STYLES) {
    sheet.target.insertRule(rule);
  }

  const shadowRoot = root.attachShadow({ mode: 'open' });
  shadowRoot.adoptedStyleSheets = [sheet.target];

  const tw = twind(config, sheet);
  observe(tw, shadowRoot);

  /**
   * In the firefox environment, the adoptedStyleSheets bug may prevent contentStyle from being applied properly.
   */
  createRoot(shadowRoot).render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
})();
