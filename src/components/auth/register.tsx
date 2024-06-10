import { useAuthState } from "@/stores/auth.store";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import FillLoading from "../shared/FillLoading";
import { userStore } from "@/stores/user.store";

const Register = () => {
  const { setAuthState } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = userStore();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async function (values: z.infer<typeof registerSchema>) {
    const { email, password } = values;
    console.log(email, password);
    setIsLoading(true);
    try {
      const responce = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(responce.user);
      navigate("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {isLoading && <FillLoading />}
      <h2 className="text-xl font-bold">Register</h2>
      <p className="text-muted-foreground">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline duration-150 transition-all"
          onClick={() => setAuthState("login")}
        >
          Sign in
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
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={isLoading}
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={isLoading}
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="h-12 w-full mt-2"
              disabled={isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
