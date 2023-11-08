import withErrorBoundary from '@shared/hoc/with-error-boundary';
import withSuspense from '@shared/hoc/with-suspense';

const Popup = () => {
  return <div>Popup</div>;
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading...</div>), <div>Error Occur</div>);
