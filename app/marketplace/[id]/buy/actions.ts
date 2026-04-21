"use server";

import { db } from "@/db/config";
import { purchase } from "@/db/schema/purchase-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createPurchaseAction(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  await db.insert(purchase).values({
    userId: session.user.id,
    productId,
  });

  redirect(`/marketplace/${productId}/buy/success`);
}
