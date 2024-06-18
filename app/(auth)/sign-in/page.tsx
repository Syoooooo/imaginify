"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { SignInSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/shared/form-error";
import { useState, useTransition } from "react";
import { SignIn } from "@/actions/login";

const SignInPage = () => {
  const [error, setError] = useState<string | undefined>();

  // for pending
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    setError("");
    startTransition(() => {
      SignIn(values)
        .then((data) => {
          setError(data!.error as string)
          // console.log(data!.success)
        })
    });
  }

  return (
    <CardWrapper
      headerLabel="Sign in"
      backButtonLabel="No account?"
      backButtonHref="/sign-up"
      backButtonHrefLabel="Sign up"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
export default SignInPage;
