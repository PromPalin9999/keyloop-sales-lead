import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { memo, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PrefetchLink } from "@/components";
import { ROUTES } from "@/constants";
import { useLayoutStore } from "@/store";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

export const NavigationList = memo(() => {
  const location = useLocation();
  const closeMobileSidebar = useLayoutStore((state) => state.closeMobileSidebar);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        path: ROUTES.LEADS,
        label: "In-flight Leads",
        icon: <InboxOutlined />,
        isActive: (pathname) =>
          pathname === ROUTES.LEADS ||
          (pathname.startsWith("/leads/") && pathname !== ROUTES.LEAD_NEW),
      },
      {
        path: ROUTES.LEAD_NEW,
        label: "Create Lead",
        icon: <PlusOutlined />,
        isActive: (pathname) => pathname === ROUTES.LEAD_NEW,
      },
    ],
    [],
  );

  return (
    <nav className="mx-[5px] flex flex-1 flex-col gap-1 overflow-y-auto md:mx-0">
      {navItems.map((navItem) => {
        const isActivated = navItem.isActive(location.pathname);

        return (
          <PrefetchLink
            key={navItem.path}
            to={navItem.path}
            onClick={closeMobileSidebar}
            className={`${
              isActivated
                ? "!bg-secondary-100 !text-secondary-700"
                : "!text-text hover:!bg-background-100 dark:hover:!bg-background-100/10"
            } flex items-center gap-x-3 rounded-lg px-3 py-3 transition md:px-4`}
          >
            {navItem.icon}
            {navItem.label}
          </PrefetchLink>
        );
      })}
    </nav>
  );
});
