import { create } from 'zustand';

type LayoutStoreState = {
  isMobileSidebarOpen: boolean;
};

interface LayoutStore extends LayoutStoreState {
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

const init: LayoutStoreState = {
  isMobileSidebarOpen: false,
};

export const useLayoutStore = create<LayoutStore>((set) => ({
  ...init,
  openMobileSidebar: () => set(() => ({ isMobileSidebarOpen: true })),
  closeMobileSidebar: () => set(() => ({ isMobileSidebarOpen: false })),
}));
