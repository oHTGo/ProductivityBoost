import Sidebar from '@shared/components/sidebar';
import { context } from '@shared/hooks/use-sidebar-store';
import { useContext, useEffect } from 'react';
import { useStore } from 'zustand';

export default function App() {
  const store = useContext(context);
  if (!store) throw new Error('Missing context in the tree');
  const { set } = useStore(store, (state) => state);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      console.log(e.x);
      if (e.x <= 2) return set(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [set]);

  return (
    <div>
      <Sidebar />
    </div>
  );
}
