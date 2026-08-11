import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useThemeStore } from "@/store";
import { KlButton } from "./base";

export const ThemeSwitcher = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const setIsDark = useThemeStore((state) => state.setIsDark);

  return (
    <KlButton
      type="text"
      icon={isDark ? <MoonOutlined /> : <SunOutlined />}
      className="!text-xl"
      onClick={() => setIsDark(!isDark)}
    />
  );
};
