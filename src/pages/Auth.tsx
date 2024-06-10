import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import Social from "@/components/auth/social-media";
import { Card } from "@/components/ui/card";
import { useAuthState } from "@/stores/auth.store";

const Auth = () => {
  const { authState } = useAuthState();
  return (
    <div className="w-full h-screen bg-gradient-to-t from-foreground to-background flex items-center justify-center px-4 md:px-0">
      <Card className="p-4 md:p-8  relative">
        {authState === "login" && <Login />}
        {authState === "register" && <Register />}
        <Social />
      </Card>
    </div>
  );
};

export default Auth;
