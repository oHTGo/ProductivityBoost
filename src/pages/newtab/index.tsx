import Newtab from '@pages/newtab/newtab';
import { store } from '@shared/common/store';
import config from '@shared/configurations/twind';
import { install } from '@twind/core';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/newtab');

function init() {
  install(config);

  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <Provider store={store}>
      <Newtab />
    </Provider>,
  );
}

init();
