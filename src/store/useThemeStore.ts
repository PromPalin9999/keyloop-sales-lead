import { create } from "zustand";

type ThemeStoreState = {
  isDark: boolean;
};

interface ThemeStore extends ThemeStoreState {
  setIsDark: (isDark: boolean) => void;
}

const init: ThemeStoreState = {
  isDark: localStorage.getItem("isDark") === "true",
};

export const useThemeStore = create<ThemeStore>((set) => ({
  ...init,
  setIsDark: (isDark) => {
    set(() => ({ isDark }));
    localStorage.setItem("isDark", String(isDark));
    document.documentElement.classList.toggle("dark", isDark);
  },
}));
