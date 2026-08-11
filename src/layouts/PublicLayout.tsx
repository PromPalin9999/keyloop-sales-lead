import { FallbackLoading } from "@/components";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PublicLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? (
    <Navigate to={ROUTES.DASHBOARD} replace />
  ) : (
    <Suspense fallback={<FallbackLoading />}>
      <Outlet />
    </Suspense>
  );
};
