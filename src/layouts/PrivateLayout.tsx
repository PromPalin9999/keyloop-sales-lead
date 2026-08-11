import { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGetMe } from "@/apis";
import { FallbackLoading } from "@/components";
import { ROUTES } from "@/constants";
import { useBreakPoints } from "@/hooks";
import { useAuthStore } from "@/store";
import { Header, PageContainer, Sidebar } from "./components";

const MobileSidebar = lazy(() => import("./components/MobileSidebar"));

export const PrivateLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { isDesktop } = useBreakPoints();

  useGetMe();

  return isLoggedIn ? (
    <>
      {isDesktop ? (
        <Sidebar />
      ) : (
        <>
          <Header />
          <Suspense fallback={null}>
            <MobileSidebar />
          </Suspense>
        </>
      )}
      <PageContainer>
        <Suspense fallback={<FallbackLoading />}>
          <Outlet />
        </Suspense>
      </PageContainer>
    </>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace />
  );
};
