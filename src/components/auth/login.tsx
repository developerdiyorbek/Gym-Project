import { useAuthState } from "@/stores/auth.store";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import FillLoading from "../shared/FillLoading";
import { userStore } from "@/stores/user.store";

const Login = () => {
  const { setAuthState } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = userStore();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async function (values: z.infer<typeof loginSchema>) {
    const { email, password } = values;
    setIsLoading(true);
    try {
      const responce = await signInWithEmailAndPassword(auth, email, password);
      setUser(responce.user);
      navigate("/");
    } catch (error) {
      const err = error as Error;
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {isLoading && <FillLoading />}
      <h2 className="text-xl font-bold">Login</h2>
      <p className="text-muted-foreground">
        Don't have account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline duration-150 transition-all"
          onClick={() => setAuthState("register")}
        >
          Sign Up
        </span>
      </p>
      <Separator className="my-3" />
      {error && (
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@gmail.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full mt-2"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
