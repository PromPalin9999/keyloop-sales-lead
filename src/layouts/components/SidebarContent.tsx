import {
  LogoutOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { memo } from "react";
import { useLogout } from "@/apis";
import { KlText } from "@/components/base";
import { Role, ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { NavigationList } from "./NavigationList";

// Shared brand + nav + footer content, rendered as-is inside the fixed
// desktop <aside> (Sidebar) and inside the mobile <Drawer> (MobileSidebar).
export const SidebarContent = memo(() => {
  const profile = useAuthStore((state) => state.profile);
  const { logout, isLoggingOut } = useLogout();

  const roleLabel =
    profile?.role === Role.Admin ? "Admin View" : "Salesperson View";

  return (
    <div className="flex h-full flex-col px-4 py-5">
      <a href={ROUTES.LEADS} className="mb-6 flex items-center gap-2 px-1">
        <img src="/kl-avt.png" alt="logo" className="h-7 w-auto" />
        <div className="min-w-0">
          <KlText strong className="block truncate !text-base">
            Keyloop Sales
          </KlText>
          <KlText type="secondary" className="block truncate !text-xs">
            {roleLabel}
          </KlText>
        </div>
      </a>

      <NavigationList />

      <div className="mt-4 border-t border-text-200/20 pt-4">
        <button
          type="button"
          className="mb-1 flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-left !text-text-500 transition hover:!bg-background-100 dark:hover:!bg-background-100/10"
        >
          <QuestionCircleOutlined /> Support
        </button>
        <button
          type="button"
          disabled={isLoggingOut}
          onClick={() => logout()}
          className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-left !text-error transition hover:!bg-error/10"
        >
          <LogoutOutlined /> Sign Out
        </button>

        <div className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2">
          <Avatar icon={<UserOutlined />} />
          <div className="min-w-0">
            <KlText strong className="block truncate !text-sm">
              {profile?.full_name || "--"}
            </KlText>
            <KlText type="secondary" className="block truncate !text-xs">
              {roleLabel.replace(" View", "")}
            </KlText>
          </div>
        </div>
      </div>
    </div>
  );
});
