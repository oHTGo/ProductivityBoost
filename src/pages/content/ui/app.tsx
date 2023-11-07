import Sidebar from '@shared/components/sidebar';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log('content view loaded');
  }, []);

  return (
    <div>
      <Sidebar />
    </div>
  );
}
