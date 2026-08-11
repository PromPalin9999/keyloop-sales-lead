import { Drawer } from "antd";
import { memo } from "react";
import { useLayoutStore } from "@/store";
import { SidebarContent } from "./SidebarContent";

const MobileSidebar = memo(() => {
  const isMobileSidebarOpen = useLayoutStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useLayoutStore((state) => state.closeMobileSidebar);

  return (
    <Drawer
      open={isMobileSidebarOpen}
      onClose={closeMobileSidebar}
      placement="left"
      width="80%"
      styles={{ body: { padding: 0 } }}
    >
      <SidebarContent />
    </Drawer>
  );
});

export default MobileSidebar;
