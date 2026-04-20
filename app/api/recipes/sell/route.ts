import { db } from "@/db/config";
import { recipe, marketplaceProduct } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return Response.json(
        { error: "No items to list" },
        { status: 400 }
      );
    }

    // Fetch only recipes that belong to the authenticated user
    const recipesToSell = await db
      .select()
      .from(recipe)
      .where(eq(recipe.userId, session.user.id));

    // Verify each item belongs to the user (security check)
    const validatedItems = items.filter((item: { recipeId: string; price: number }) => {
      return recipesToSell.some((r) => r.id === item.recipeId);
    });

    if (validatedItems.length === 0) {
      return Response.json(
        { error: "No valid recipes found. You can only sell recipes you created." },
        { status: 403 }
      );
    }

    if (validatedItems.length !== items.length) {
      return Response.json(
        { error: "You can only sell your own recipes" },
        { status: 403 }
      );
    }

    const selectedRecipeIds = validatedItems.map((item: { recipeId: string; price: number }) => item.recipeId);
    const alreadyListedRecipes = await db
      .select({ recipeId: marketplaceProduct.recipeId })
      .from(marketplaceProduct)
      .where(inArray(marketplaceProduct.recipeId, selectedRecipeIds));

    const alreadyListedRecipeIds = new Set(
      alreadyListedRecipes.map((item) => item.recipeId).filter((id): id is string => Boolean(id))
    );

    const duplicateSelections = validatedItems.filter((item: { recipeId: string; price: number }) =>
      alreadyListedRecipeIds.has(item.recipeId)
    );

    if (duplicateSelections.length > 0) {
      return Response.json(
        { error: "One or more selected recipes are already listed on the marketplace" },
        { status: 409 }
      );
    }

    // Create marketplace products for validated recipes
    const productsToCreate = validatedItems
      .map((item: { recipeId: string; price: number }) => {
        const foundRecipe = recipesToSell.find((r) => r.id === item.recipeId);
        if (!foundRecipe) return null;

        return {
          recipeId: foundRecipe.id,
          name: foundRecipe.title,
          description: foundRecipe.description,
          seller: session.user.name || "Anonymous Baker",
          price: item.price.toString(),
          rating: "4.5",
          imageUrl: foundRecipe.imageUrl,
          category: foundRecipe.category,
        };
      })
      .filter(Boolean);

    if (productsToCreate.length === 0) {
      return Response.json(
        { error: "No valid recipes found to list" },
        { status: 400 }
      );
    }

    // Insert all products at once
    await db.insert(marketplaceProduct).values(productsToCreate);

    return Response.json({
      success: true,
      message: `Successfully listed ${productsToCreate.length} recipe${productsToCreate.length !== 1 ? "s" : ""} on the marketplace`,
    });
  } catch (error) {
    console.error("Failed to list recipes on marketplace:", error);
    return Response.json(
      { error: "Failed to list recipes on marketplace" },
      { status: 500 }
    );
  }
}
