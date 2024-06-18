"use client";
import { SignIn } from "@/actions/login";
import { SignUp } from "@/actions/signUp";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/shared/form-error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignUpage = () => {
  const [error, setError] = useState<string | undefined>();

  // for pending
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      // confirmpassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignUpSchema>) {
    setError("");
    startTransition(() => {
      SignUp(values)
        .then((data) => {
          setError(data!.error)
          console.log(data!.success)
          if (data?.success) {
            SignIn(values)
            .then((data) => {
              setError(data!.error)
              // console.log(data!.success)
            })
          }
        })
    });
  }

  return (
    <CardWrapper
      headerLabel="Create your account"
      backButtonLabel="Have an account?"
      backButtonHref="/sign-in"
      backButtonHrefLabel="Sign in"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Username
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Email
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
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
                <FormLabel className="font-bold">
                  Password
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="confirmpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {error && (
            <FormError message={error}/>
          )}
          <Button
            type="submit"
            className="w-full font-bold"
            disabled={isPending}
          >
            CONTINUE
          </Button>
        </form>
      </Form>{" "}
    </CardWrapper>
  );
};
export default SignUpage;
