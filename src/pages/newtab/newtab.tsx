import Sidebar from '@shared/components/sidebar';
import event from '@shared/constants/event';
import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { collapse, open } from '@shared/slices/sidebar';
import { useEffect } from 'react';

const NewTab = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(open());
  }, [dispatch]);

  return (
    <div>
      <Sidebar onClickOutside={() => dispatch(collapse())} />
      <div className="w-screen h-screen flex justify-center items-center">
        <button
          className="bg-stone-300 rounded-md p-2"
          onClick={() => {
            chrome.runtime.sendMessage(event.LOGIN);
          }}>
          Login
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
