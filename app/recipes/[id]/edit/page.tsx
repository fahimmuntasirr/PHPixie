"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RecipeForm, {
  type RecipeFormData,
} from "@/components/recipes/recipe-form";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipeData, setRecipeData] = useState<RecipeFormData | null>(null);

  // Fetch recipe data from API
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) {
          setRecipeData(null);
          return;
        }
        const data = await res.json();
        setRecipeData({
          title: data.title,
          description: data.description,
          category: data.category,
          difficulty: data.difficulty,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
          imageUrl: data.imageUrl || "",
          tags: data.tags || [],
          ingredients: (data.ingredients || []).map(
            (ing: { id: string; name: string; amount: string; unit: string }) => ({
              id: ing.id,
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
            })
          ),
          steps: (data.steps || []).map(
            (step: { id: string; instruction: string }) => ({
              id: step.id,
              instruction: step.instruction,
            })
          ),
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setRecipeData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-gray-50/50">
          <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-400 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading recipe...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!recipeData) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-gray-50/50">
          <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Recipe Not Found
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              The recipe you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link
              href="/recipes"
              className="inline-block mt-6 px-6 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Back to Recipes
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update recipe");
      router.push("/recipes");
    } catch (error) {
      console.error("Error updating recipe:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link
                href="/recipes"
                className="hover:text-pink-400 transition-colors"
              >
                Recipes
              </Link>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-800 font-medium">Edit</span>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Recipe
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update &quot;{recipeData.title}&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="max-w-3xl mx-auto px-6 py-8">
          <RecipeForm
            initialData={recipeData}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/recipes")}
            submitLabel="Save Changes"
            isSubmitting={isSubmitting}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
