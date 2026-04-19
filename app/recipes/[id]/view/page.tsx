"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, Users, ChefHat, Tag, User, Calendar, ArrowLeft } from "lucide-react";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

interface RecipeDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  imageUrl?: string;
  tags: string[];
  user?: {
    name?: string;
    email?: string;
  };
  createdAt: string;
  ingredients: Array<{
    id: string;
    name: string;
    amount: string;
    unit: string;
    sortOrder: number;
  }>;
  steps: Array<{
    id: string;
    instruction: string;
    sortOrder: number;
  }>;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) {
          setError("Recipe not found");
          return;
        }
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError("Failed to load recipe");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      "Cakes": "from-purple-50 to-pink-50",
      "Bread": "from-amber-50 to-orange-50",
      "Muffins": "from-pink-50 to-rose-50",
      "Cupcakes": "from-violet-50 to-fuchsia-50",
      "Cookies": "from-amber-50 to-yellow-50",
      "Pastries": "from-rose-50 to-pink-50",
      "Pies": "from-orange-50 to-amber-50",
      "Desserts": "from-fuchsia-50 to-purple-50",
    };
    return gradients[category] || "from-gray-50 to-gray-100";
  };

  if (loading) {
    return (
      <>
        <main className="flex-1 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-400 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading recipe...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !recipe) {
    return (
      <>
        <main className="flex-1 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <p className="text-lg text-gray-600 mb-6">{error || "Recipe not found"}</p>
            <Link href="/recipes">
              <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-6 h-10 text-sm font-medium">
                Back to Recipes
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sortedIngredients = [...recipe.ingredients].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const sortedSteps = [...recipe.steps].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <main className="flex-1 bg-gray-50/50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Link href="/recipes" className="flex items-center gap-2 text-pink-400 hover:text-pink-500 mb-4 w-fit">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Hero Section */}
          {recipe.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg h-96">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Description */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {recipe.title}
                </h1>
                <p className="text-lg text-gray-600">{recipe.description}</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {recipe.category}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Prep Time</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{recipe.prepTime}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <ChefHat className="w-4 h-4" />
                <span className="text-xs font-medium">Cook Time</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{recipe.cookTime}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Servings</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{recipe.servings}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Created</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Author */}
          {recipe.user?.name && (
            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white font-semibold">
                  {recipe.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-500">By</p>
                  <p className="font-semibold text-gray-900">{recipe.user.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold">
                📝
              </span>
              Ingredients
            </h2>
            <div className="space-y-3">
              {sortedIngredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-200 to-orange-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{ingredient.name}</p>
                    <p className="text-sm text-gray-500">
                      {ingredient.amount} {ingredient.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                👨‍🍳
              </span>
              Instructions
            </h2>
            <div className="space-y-4">
              {sortedSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-900 leading-relaxed">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          {recipe.tags.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-linear-to-r from-pink-100 to-rose-100 text-pink-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
