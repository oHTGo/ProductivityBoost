import Newtab from '@pages/newtab/newtab';
import config from '@shared/configurations/twind';
import { useCreateSidebarStore, context } from '@shared/hooks/use-sidebar-store';
import { install } from '@twind/core';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/newtab');

function init() {
  install(config);

  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  const { Provider } = context;
  root.render(
    <Provider value={useCreateSidebarStore}>
      <Newtab />
    </Provider>,
  );
}

init();
