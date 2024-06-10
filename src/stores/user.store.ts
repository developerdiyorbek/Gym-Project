import { User } from "firebase/auth";
import { create } from "zustand";

type UserType = User | null;

interface IUserStateStore {
  user: UserType;
  setUser: (user: UserType) => void;
}

export const userStore = create<IUserStateStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
