"use server"
import { SignUpSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const SignUp = async (
  values: z.infer<typeof SignUpSchema>
) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid field" };
  }

  const { email, password, username } =
    validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in used" };
  }

  const createUser = await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  if (!createUser) {
    return { error: "Failed to create user" };
  }



  if (validatedFields.success) {
    return { success: "SingIn success" };
  }
};
