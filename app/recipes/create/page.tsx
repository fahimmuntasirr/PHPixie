"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Footer from "@/components/footer";
import RecipeForm, {
  type RecipeFormData,
} from "@/components/recipes/recipe-form";

export default function CreateRecipePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create recipe");
      router.push("/recipes");
    } catch (error) {
      console.error("Error creating recipe:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <main className="flex-1 bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
              <span className="text-gray-800 font-medium">Create</span>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-200/50">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Recipe
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Share your culinary masterpiece with the world
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <RecipeForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/recipes")}
            submitLabel="Create Recipe"
            isSubmitting={isSubmitting}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
