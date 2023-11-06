import { createRoot } from 'react-dom/client';
import Newtab from '@root/src/pages/newtab/newtab';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import '@src/shared/styles/global.css';

refreshOnUpdate('pages/newtab');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(<Newtab />);
}

init();
