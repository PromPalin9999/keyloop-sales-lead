import { memo } from 'react';
import { SidebarContent } from './SidebarContent';

export const Sidebar = memo(() => {
  return (
    <aside className='fixed top-0 bottom-0 left-0 z-10 w-60 bg-primary'>
      <SidebarContent />
    </aside>
  );
});
