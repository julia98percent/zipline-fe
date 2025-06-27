import { create } from "zustand";
import axios from "axios";

interface AuthState {
  isSignedIn: boolean | null;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: null,
  checkAuth: async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/info`, {
        withCredentials: true,
      });
      set({ isSignedIn: true });
    } catch {
      set({ isSignedIn: false });
    }
  },
  logout: () => {
    set({ isSignedIn: false });
  },
}));

export default useAuthStore;
