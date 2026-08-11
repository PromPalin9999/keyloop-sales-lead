import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}
export const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { children } = props;
  return (
    <main className="relative min-h-[calc(100dvh-3rem)] bg-background p-4 md:ml-60 md:min-h-dvh md:p-8">
      {children}
    </main>
  );
};
