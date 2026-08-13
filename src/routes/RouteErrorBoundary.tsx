import { Button, Result } from 'antd';
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { PrefetchLink } from '@/components';
import { ROUTES } from '@/constants';

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigation = useNavigate();

  const title = 'Oops! Something went wrong';
  let subTitle = 'Unkown Error';

  if (isRouteErrorResponse(error)) {
    subTitle =
      `${error.status} ${error.statusText}` +
      (error.data ? ` — ${String(error.data)}` : '');
  } else if (error instanceof Error) {
    subTitle = error.message || subTitle;
  } else if (typeof error === 'string') {
    subTitle = error;
  }
  return (
    <Result
      status='error'
      title={title}
      subTitle={subTitle}
      extra={
        <>
          <Button onClick={() => navigation(0)}>Try Again</Button>
          <PrefetchLink to={ROUTES.DASHBOARD}>
            <Button type='primary'>Back to Dashboard</Button>
          </PrefetchLink>
        </>
      }
    />
  );
};

export default RouteErrorBoundary;
