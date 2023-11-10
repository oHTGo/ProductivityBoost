import Sidebar from '@shared/components/sidebar';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import { set } from '@shared/slices/sidebar';
import { useEffect } from 'react';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.x <= 2) return dispatch(set(true));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch]);

  return (
    <div className="fixed z-[1000] h-full">
      <Sidebar />
    </div>
  );
}
