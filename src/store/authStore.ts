import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/user";
import type { Role } from "../types/role";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  currentRole: Role | null;
  user: User | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setCurrentRole: (role: Role | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      currentRole: null,
      user: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setRefreshToken: (token: string) => set({ refreshToken: token }),
      setUser: (user: User | null) => set({ user: user }),
      setCurrentRole: (role: Role | null) => set({ currentRole: role }),
      logout: () => set({ accessToken: "", refreshToken: "", user: null, currentRole: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
