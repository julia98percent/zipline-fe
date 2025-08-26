import { create } from "zustand";

interface MobileMenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

export default useMobileMenuStore;