import { Result } from 'antd';
import { KlButton, KlCard, PrefetchLink } from '@/components';
import { ROUTES } from '@/constants';

export const NotFoundPage = () => {
  return (
    <main className='fixed inset-0 flex items-center justify-center'>
      <KlCard>
        <Result
          status='404'
          title='404'
          subTitle={'The page you visited does not exist.'}
          extra={
            <PrefetchLink to={ROUTES.DASHBOARD}>
              <KlButton size='large' type='primary'>
                Back to Dashboard
              </KlButton>
            </PrefetchLink>
          }
        />
      </KlCard>
    </main>
  );
};
