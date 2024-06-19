"use server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "../utils";
import { db } from "../db";
import { updateCredits } from "../cloudinaryActions/user.action";

declare type CheckoutTransactionParams = {
  plan: string;
  credits: number;
  amount: number;
  buyerId: string;
};

export async function checkoutCredits(
  transaction: CheckoutTransactionParams
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  });

  redirect(session.url!);
}

declare type CreateTransactionParams = {
  stripeId: string;
  amount: number;
  credits: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
};

export async function createTransaction(
  transaction: CreateTransactionParams
) {
  try {
    // Create a new transaction width a buyerId
    const newTransaction = await db.transaction.create({
      data: {
        ...transaction,
        buyerId: transaction.buyerId,
      },
    });

    //User has credits in this app
    await updateCredits(
      transaction.buyerId,
      transaction.credits
    );

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
