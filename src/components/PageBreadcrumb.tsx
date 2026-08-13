import { HomeOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { PrefetchLink } from './PrefetchLink';
import { KlText } from '@/components/base';
import { ROUTES } from '@/constants';

interface PageBreadcrumbProps {
  page: string;
}

export const PageBreadcrumb = memo((props: PageBreadcrumbProps) => {
  const { page } = props;

  return (
    <nav className='mb-4 flex items-center gap-1.5'>
      <PrefetchLink
        to={ROUTES.DASHBOARD}
        aria-label='Lead Inbox'
        className='text-text-500 hover:text-secondary-600 dark:hover:text-secondary-300 flex items-center transition-colors'
      >
        <HomeOutlined />
      </PrefetchLink>
      <span className='text-text-300 dark:text-white/25'>/</span>
      <KlText className='text-text! text-sm! font-medium!'>{page}</KlText>
    </nav>
  );
});
