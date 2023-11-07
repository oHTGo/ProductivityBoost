import Sidebar from '@shared/components/sidebar';
import withErrorBoundary from '@shared/hoc/withErrorBoundary';
import withSuspense from '@shared/hoc/withSuspense';

const NewTab = () => {
  return (
    <div className="App">
      <Sidebar />
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error Occur</div>);
