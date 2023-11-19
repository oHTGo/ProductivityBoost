import Options from '@pages/options/options';
import config, { DEFAULT_SCROLLBAR_STYLES } from '@shared/configurations/twind';
import { injectGlobal, install } from '@twind/core';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/options');

function init() {
  install(config);
  injectGlobal(DEFAULT_SCROLLBAR_STYLES.join('\n'));

  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<Options />);
}

init();
