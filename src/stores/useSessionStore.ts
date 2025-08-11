import { create } from "zustand";

interface SessionState {
  showSessionExpiredModal: boolean;
  openSessionExpiredModal: () => void;
  closeSessionExpiredModal: () => void;
}

const useSessionStore = create<SessionState>((set) => ({
  showSessionExpiredModal: false,
  openSessionExpiredModal: () => set({ showSessionExpiredModal: true }),
  closeSessionExpiredModal: () => set({ showSessionExpiredModal: false }),
}));

export default useSessionStore;