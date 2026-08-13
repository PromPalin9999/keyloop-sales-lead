import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PrefetchLink } from '@/components';
import { LEADS_SEGMENT, ROUTES } from '@/constants';
import { useAuthStore, useLayoutStore } from '@/store';

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

export const NavigationList = memo(() => {
  const location = useLocation();
  const closeMobileSidebar = useLayoutStore(
    (state) => state.closeMobileSidebar,
  );
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const navItems: NavItem[] = useMemo(
    () => [
      {
        path: ROUTES.DASHBOARD,
        label: 'In-flight Leads',
        icon: <InboxOutlined />,
        isActive: (pathname) =>
          pathname === ROUTES.DASHBOARD ||
          (pathname.startsWith(`/${LEADS_SEGMENT}/`) &&
            pathname !== ROUTES.LEAD_NEW),
      },
      // Lead creation is admin-only (mirrors the "leads" INSERT RLS policy),
      // so salespeople never see a link that would fail on submit.
      ...(isAdmin
        ? [
            {
              path: ROUTES.LEAD_NEW,
              label: 'Create Lead',
              icon: <PlusOutlined />,
              isActive: (pathname: string) => pathname === ROUTES.LEAD_NEW,
            },
          ]
        : []),
    ],
    [isAdmin],
  );

  return (
    <nav className='mx-[5px] flex flex-1 flex-col gap-1 overflow-y-auto md:mx-0'>
      {navItems.map((navItem) => {
        const isActivated = navItem.isActive(location.pathname);

        return (
          <PrefetchLink
            key={navItem.path}
            to={navItem.path}
            onClick={closeMobileSidebar}
            className={`${
              isActivated
                ? 'bg-secondary-100! !text-secondary-700'
                : 'text-text! hover:bg-background-100! dark:hover:!bg-background-100/10'
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
