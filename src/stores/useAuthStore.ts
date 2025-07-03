import { create } from "zustand";
import { User } from "@ts/user";
import { fetchUserInfo } from "@apis/userService";

interface AuthState {
  isSignedIn: boolean | null;
  user: User | null;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: null,
  user: null,
  checkAuth: async () => {
    try {
      const userData = await fetchUserInfo();
      set({ isSignedIn: true, user: userData });
    } catch {
      set({ isSignedIn: false, user: null });
    }
  },
  setUser: (user) => set({ user }),
  logout: () => {
    set({ isSignedIn: false, user: null });
  },
}));

export default useAuthStore;
