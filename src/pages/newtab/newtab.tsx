import Sidebar from '@shared/components/sidebar';
import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { set } from '@shared/slices/sidebar';
import { useEffect } from 'react';

const NewTab = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(set(true));
  }, [dispatch]);

  return (
    <div className="App">
      <Sidebar />
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
