import { userStore } from "@/stores/user.store";
import FillLoading from "../shared/FillLoading";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "@/firebase";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setUser } = userStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) setUser(user);
      setLoading(false);
    });
  }, []);

  return loading ? <FillLoading /> : <>{children}</>;
};

export default AuthProvider;
