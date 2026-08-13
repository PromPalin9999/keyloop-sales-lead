import {
  CloseOutlined,
  LogoutOutlined,
  MoonOutlined,
  MoreOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Row, type MenuProps } from 'antd';
import { memo } from 'react';
import { NavigationList } from './NavigationList';
import { useLogout } from '@/apis';
import { KlButton, KlText } from '@/components/base';
import { ROUTES } from '@/constants';
import { useAuthStore, useThemeStore } from '@/store';

interface SidebarContentProps {
  closeMobileSidebar?: () => void;
}

export const SidebarContent = memo((props: SidebarContentProps) => {
  const { closeMobileSidebar } = props;
  const profile = useAuthStore((state) => state.profile);
  const { logout, isLoggingOut } = useLogout();
  const isDark = useThemeStore((state) => state.isDark);
  const setIsDark = useThemeStore((state) => state.setIsDark);

  const accountMenuItems: MenuProps['items'] = [
    {
      key: 'theme',
      label: isDark ? 'Light Mode' : 'Dark Mode',
      icon: isDark ? <SunOutlined /> : <MoonOutlined />,
      onClick: () => setIsDark(!isDark),
    },
    { type: 'divider' },
    {
      key: 'signout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      danger: true,
      disabled: isLoggingOut,
      onClick: () => logout(),
    },
  ];

  return (
    <div className='flex h-full flex-col px-4 py-2'>
      <Row justify='space-between' align='middle' className='mb-6!'>
        <a href={ROUTES.DASHBOARD} className='flex items-center gap-2 px-1'>
          <img src='/kl-avt.png' alt='logo' className='h-7 w-auto' />
          <div className='min-w-0'>
            <KlText strong className='block truncate text-base!'>
              Keyloop Company
            </KlText>
            <KlText type='secondary' className='block truncate text-xs!'>
              Sales Lead Manager
            </KlText>
          </div>
        </a>

        {closeMobileSidebar && (
          <KlButton
            type='text'
            shape='circle'
            aria-label='Close menu'
            icon={<CloseOutlined />}
            onClick={closeMobileSidebar}
          />
        )}
      </Row>

      <NavigationList />

      <div className='mt-4 border-t border-text-200/20 pt-4'>
        <Dropdown
          menu={{ items: accountMenuItems }}
          trigger={['click']}
          placement='top'
        >
          <KlButton
            type='default'
            className='flex! w-full! items-center! gap-2! rounded-lg! px-3! py-7! transition'
          >
            <Avatar icon={<UserOutlined />} />
            <div className='min-w-0 flex-1'>
              <KlText strong className='block truncate text-sm! text-start!'>
                {profile?.full_name || '--'}
              </KlText>
              <KlText
                type='secondary'
                className='block truncate text-xs! text-start!'
              >
                {profile?.email}
              </KlText>
            </div>
            <MoreOutlined className='text-text-400' />
          </KlButton>
        </Dropdown>
      </div>
    </div>
  );
});
