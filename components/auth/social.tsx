import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {signIn} from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn( provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  };
  return (
    <div className="gap-2 w-full flex flex-col items-center justify-center">
      <Button
        size={"lg"}
        variant={"outline"}
        className="gap-4 w-full"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
        <p>Continue with Google</p>
      </Button>
      <Button
        size={"lg"}
        variant={"outline"}
        className="gap-4 w-full"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" />
        <p>Continue with Git hub</p>
      </Button>
      <div className="flex gap-5 items-center w-full justify-between my-5">
        <Separator className="flex-1" />
        <span className="text-muted-foreground font-medium text-sm">
          or
        </span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
};
