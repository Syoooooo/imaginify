import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(1, { message: "Password id required" }),
});

export const SignUpSchema = z.object({
  username: z.string().min(1, {message: "Name is required"}),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(6, {
      message: "Minimum 6 characters required",
    }),
  // confirmpassword: z
  //   .string()
  //   .min(6, {
  //     message: "Password must be more than 6 characters",
  //   }),
});
