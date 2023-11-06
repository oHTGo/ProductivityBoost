import { createRoot } from 'react-dom/client';
import Panel from '@root/src/pages/panel/panel';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import '@src/shared/styles/global.css';

refreshOnUpdate('pages/panel');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<Panel />);
}

init();
