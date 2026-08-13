import { Drawer } from 'antd';
import { memo } from 'react';
import { SidebarContent } from './SidebarContent';
import { useLayoutStore } from '@/store';

const MobileSidebar = memo(() => {
  const isMobileSidebarOpen = useLayoutStore(
    (state) => state.isMobileSidebarOpen,
  );
  const closeMobileSidebar = useLayoutStore(
    (state) => state.closeMobileSidebar,
  );

  return (
    <Drawer
      open={isMobileSidebarOpen}
      onClose={closeMobileSidebar}
      placement='left'
      width='80%'
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      <SidebarContent closeMobileSidebar={closeMobileSidebar} />
    </Drawer>
  );
});

export default MobileSidebar;
