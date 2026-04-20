import { db } from "@/db/config";
import { marketplaceProduct, recipe } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";

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

    const recipeIds = userRecipes.map((item) => item.id);
    const listedRecipes = recipeIds.length
      ? await db
          .select({ recipeId: marketplaceProduct.recipeId })
          .from(marketplaceProduct)
          .where(inArray(marketplaceProduct.recipeId, recipeIds))
      : [];

    const listedRecipeIds = new Set(
      listedRecipes.map((item) => item.recipeId).filter((id): id is string => Boolean(id))
    );

    const recipesWithListingState = userRecipes.map((item) => ({
      ...item,
      listed: listedRecipeIds.has(item.id),
    }));

    return Response.json(recipesWithListingState);
  } catch (error) {
    console.error("Failed to fetch user recipes:", error);
    return Response.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
