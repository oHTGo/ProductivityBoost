import Sidebar from '@shared/components/sidebar';
import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';
import { context } from '@shared/hooks/use-sidebar-store';
import { useContext, useEffect } from 'react';
import { useStore } from 'zustand';

const NewTab = () => {
  const store = useContext(context);
  if (!store) throw new Error('Missing context in the tree');
  const { set } = useStore(store, (state) => state);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.x <= 2) return set(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [set]);

  return (
    <div className="App">
      <Sidebar />
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
