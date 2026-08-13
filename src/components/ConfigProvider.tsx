import { ConfigProvider as AntConfigProvider, theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd/lib';
import { useMemo, type ReactNode } from 'react';
import { useThemeStore } from '@/store';
import { readThemeVariables } from '@/utils';

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider = (props: ConfigProviderProps) => {
  const { children } = props;

  const isDark = useThemeStore((state) => state.isDark);

  const theme: ThemeConfig = useMemo(() => {
    const variables = readThemeVariables();

    return {
      token: {
        colorTextBase: variables.text,
        colorBgBase: variables.background,
        colorPrimary: variables.accent,
        colorSuccess: variables.success,
        colorInfo: variables.info,
        colorError: variables.error,
        colorWarning: variables.warning,
        colorBgContainer: variables.primary,
      },
      components: {
        Modal: {
          headerBg: variables.background,
          contentBg: variables.background,
        },
        Dropdown: { colorBgElevated: variables.primary },
        Tabs: { horizontalItemPaddingLG: '0 0 16px' },
        Collapse: { headerBg: variables.primary },
        Popover: { colorBgElevated: variables.primary },
        Drawer: {
          colorBgElevated: variables.primary,
          colorSplit: 'transparent',
          paddingLG: 0,
        },
      },
      algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    } as const;
  }, [isDark]);

  return <AntConfigProvider theme={theme}>{children}</AntConfigProvider>;
};
