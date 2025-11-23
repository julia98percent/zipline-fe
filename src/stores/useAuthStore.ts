import { create } from "zustand";
import { User } from "@/types/user";
import { fetchUserInfo } from "@/apis/userService";

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
      console.log("[checkAuth] Starting authentication check...");
      const userData = await fetchUserInfo();
      console.log("[checkAuth] ✅ Authentication successful:", userData);
      set({ isSignedIn: true, user: userData });
    } catch (error) {
      console.error("[checkAuth] ❌ Authentication failed:", error);
      set({ isSignedIn: false, user: null });
    }
  },
  setUser: (user) => set({ user }),
  logout: () => {
    set({ isSignedIn: false, user: null });
  },
}));

export default useAuthStore;
