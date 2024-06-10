import { create } from "zustand";

type AuthStateType = "login" | "register";

interface IAuthStore {
  authState: AuthStateType;
  setAuthState: (state: AuthStateType) => void;
}

export const useAuthState = create<IAuthStore>((set) => ({
  authState: "login",
  setAuthState: (state) => set({ authState: state }),
}));
