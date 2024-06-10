import { FaGithubAlt, FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase";
import FillLoading from "../shared/FillLoading";

const Social = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onGoogle = () => {
    setIsLoading(true);
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onGithub = () => {
    setIsLoading(true);
    console.log("salom");
    const githubProvider = new GithubAuthProvider();
    signInWithPopup(auth, githubProvider)
      .then(() => {
        navigate("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <FillLoading />}
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="h-12"
          variant={"secondary"}
          onClick={onGithub}
          disabled={isLoading}
        >
          <FaGithubAlt size={22} className="mr-2" />
          <span>Sign in with GitHub</span>
        </Button>
        <Button
          className="h-12"
          variant={"destructive"}
          onClick={onGoogle}
          disabled={isLoading}
        >
          <FaGoogle size={22} className="mr-2" />
          <span>Sign in with Google</span>
        </Button>
      </div>
    </>
  );
};

export default Social;
