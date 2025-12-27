import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/user";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: User | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      user: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setRefreshToken: (token: string) => set({ refreshToken: token }),
      setUser: (user: User | null) => set({ user: user }),
      logout: () => set({ accessToken: "", refreshToken: "", user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
