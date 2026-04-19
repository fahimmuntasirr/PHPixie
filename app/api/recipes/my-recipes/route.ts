import { db } from "@/db/config";
import { recipe } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecipes = await db
      .select()
      .from(recipe)
      .where(eq(recipe.userId, session.user.id));

    return Response.json(userRecipes);
  } catch (error) {
    console.error("Failed to fetch user recipes:", error);
    return Response.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
