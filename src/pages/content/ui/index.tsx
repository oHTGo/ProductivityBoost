import App from '@pages/content/ui/app';
import config from '@shared/configurations/twind';
import { useCreateSidebarStore, context } from '@shared/hooks/use-sidebar-store';
import { twind, cssom, observe } from '@twind/core';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import 'construct-style-sheets-polyfill';

refreshOnUpdate('pages/content');

const root = document.createElement('productivity-booster');
root.className = 'fixed z-[1000] top-0 left-0 h-full';
document.body.parentNode.append(root);

const sheet = cssom(new CSSStyleSheet());
const tw = twind(config, sheet);
const shadowRoot = root.attachShadow({ mode: 'open' });
shadowRoot.adoptedStyleSheets = [sheet.target];
observe(tw, shadowRoot);

/**
 * In the firefox environment, the adoptedStyleSheets bug may prevent contentStyle from being applied properly.
 */
const { Provider } = context;
createRoot(shadowRoot).render(
  <Provider value={useCreateSidebarStore}>
    <App />
  </Provider>,
);
