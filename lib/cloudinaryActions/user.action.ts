"use server"

// USE CREDITS

import { db } from "../db";
import { handleError } from "../utils";

export async function updateCredits(
  userId: string,
  creditFee: number
) {
  try {
    const updatedUserCredits = await db.user.update({
      where: { id: userId },
      data: {
        creditBalance: {
          increment: creditFee,
        },
      },
    });

    if (!updatedUserCredits)
      throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error)
  }
}


