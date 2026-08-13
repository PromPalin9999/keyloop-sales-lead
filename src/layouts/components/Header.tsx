import { MenuOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { KlButton, KlText } from '@/components/base';
import { ROUTES } from '@/constants';
import { useLayoutStore } from '@/store';

// Mobile-only top bar: the desktop Sidebar already spans full height and
// carries the brand + user footer, so there is nothing left for a desktop
// header to show. On mobile it just opens the MobileSidebar drawer.
export const Header = memo(() => {
  const openMobileSidebar = useLayoutStore((state) => state.openMobileSidebar);

  return (
    <header className='sticky top-0 z-20 flex h-12 items-center justify-between gap-x-2 bg-primary px-4'>
      <a href={ROUTES.DASHBOARD} className='flex items-center gap-2'>
        <img src='/kl-avt.png' alt='logo' className='h-6 w-auto' />
        <KlText strong>Keyloop Sales</KlText>
      </a>

      <KlButton
        type='text'
        icon={<MenuOutlined className='!text-lg' />}
        onClick={openMobileSidebar}
      />
    </header>
  );
});
