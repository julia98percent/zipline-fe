import { create } from "zustand";

type UserRole = "ROLE_ADMIN" | "ROLE_AGENT";

interface User {
  birthday: string | null;
  email: string;
  id: string;
  name: string;
  noticeMonth: number;
  phoneNo: string;
  role: UserRole;
  uid: string;
  url: number | null;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
