"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import RecipeCard, { type Recipe } from "@/components/recipes/recipe-card";
import DeleteRecipeDialog from "@/components/recipes/delete-recipe-dialog";

type ProfileRecipe = Recipe & {
  listed: boolean;
};

interface ProfileRecipeGridProps {
  recipes: ProfileRecipe[];
}

export default function ProfileRecipeGrid({ recipes }: ProfileRecipeGridProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ProfileRecipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (id: string) => {
    router.push(`/recipes/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    const recipe = recipes.find((item) => item.id === id);
    if (recipe) {
      setDeleteTarget(recipe);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/recipes/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete recipe");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      setDeleteTarget(null);
      setIsDeleting(false);
    }
  };

  if (recipes.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            showActions
            statusLabel={recipe.listed ? "Listed" : undefined}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      <DeleteRecipeDialog
        recipeName={deleteTarget?.title ?? ""}
        isOpen={!!deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}