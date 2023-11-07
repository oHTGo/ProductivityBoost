import logo from '@assets/img/logo.svg';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import withSuspense from '@src/shared/hoc/withSuspense';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);

  return (
    <div
      className="absolute left-0 top-0 h-full w-full"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <header
        className="flex h-full flex-col items-center justify-center"
        style={{ color: theme === 'light' ? '#000' : '#fff' }}>
        <img src={logo} className="h-10" alt="logo" />
        <p className="">
          Edit <code>src/pages/popup/Popup.tsx</code> and save to reload...
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === 'light' && '#0281dc', marginBottom: '10px' }}>
          Learn React!
        </a>
        <button
          style={{
            backgroundColor: theme === 'light' ? '#fff' : '#000',
            color: theme === 'light' ? '#000' : '#fff',
          }}
          onClick={exampleThemeStorage.toggle}>
          Toggle theme
        </button>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading...</div>), <div>Error Occur</div>);
