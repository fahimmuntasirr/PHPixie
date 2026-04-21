import { db } from "@/db/config";
import { recipe, recipeIngredient, recipeStep } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/recipes/[id] — Get a single recipe
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const found = await db.query.recipe.findFirst({
      where: (r, { eq }) => eq(r.id, id),
      with: {
        ingredients: {
          orderBy: (ingredients, { asc }) => [asc(ingredients.sortOrder)],
        },
        steps: {
          orderBy: (steps, { asc }) => [asc(steps.sortOrder)],
        },
      },
    });

    if (!found) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    return Response.json(found);
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    return Response.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] — Update a recipe
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.query.recipe.findFirst({
      where: (r, { eq }) => eq(r.id, id),
    });

    if (!existing) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      difficulty,
      prepTime,
      cookTime,
      servings,
      imageUrl,
      tags,
      ingredients,
      steps,
    } = body;

    await db.transaction(async (tx) => {
      // Update recipe fields
      await tx
        .update(recipe)
        .set({
          title,
          description,
          category,
          difficulty,
          prepTime,
          cookTime,
          servings,
          imageUrl: imageUrl || null,
          tags: tags || [],
        })
        .where(eq(recipe.id, id));

      // Replace ingredients: delete old, insert new
      await tx
        .delete(recipeIngredient)
        .where(eq(recipeIngredient.recipeId, id));

      if (ingredients && ingredients.length > 0) {
        await tx.insert(recipeIngredient).values(
          ingredients.map(
            (ing: { name: string; amount: string; unit: string }, index: number) => ({
              recipeId: id,
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
              sortOrder: index,
            })
          )
        );
      }

      // Replace steps: delete old, insert new
      await tx.delete(recipeStep).where(eq(recipeStep.recipeId, id));

      if (steps && steps.length > 0) {
        await tx.insert(recipeStep).values(
          steps.map(
            (step: { instruction: string }, index: number) => ({
              recipeId: id,
              instruction: step.instruction,
              sortOrder: index,
            })
          )
        );
      }
    });

    // Fetch updated recipe with relations
    const updated = await db.query.recipe.findFirst({
      where: (r, { eq }) => eq(r.id, id),
      with: {
        ingredients: {
          orderBy: (ingredients, { asc }) => [asc(ingredients.sortOrder)],
        },
        steps: {
          orderBy: (steps, { asc }) => [asc(steps.sortOrder)],
        },
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Failed to update recipe:", error);
    return Response.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] — Delete a recipe
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.query.recipe.findFirst({
      where: (r, { eq }) => eq(r.id, id),
    });

    if (!existing) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cascade delete will remove ingredients and steps
    await db.delete(recipe).where(eq(recipe.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete recipe:", error);
    return Response.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
