import logo from '@assets/img/logo.svg';
import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';
import useStorage from '@shared/hooks/use-storage';

const NewTab = () => {
  const theme = useStorage(exampleThemeStorage);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/newtab/Newtab.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React!
        </a>
        <h6>The color of this paragraph is defined using SASS.</h6>
        <button
          style={{
            color: theme === 'light' ? '#fff' : '#000',
          }}
          onClick={exampleThemeStorage.toggle}>
          Toggle theme: [{theme}]
        </button>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
