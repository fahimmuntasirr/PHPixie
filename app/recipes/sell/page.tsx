"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

export default function SellRecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipes, setSelectedRecipes] = useState<
    Record<string, { selected: boolean; price: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes/my-recipes");
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleToggleRecipe = (recipeId: string) => {
    setSelectedRecipes((prev) => ({
      ...prev,
      [recipeId]: {
        selected: !prev[recipeId]?.selected,
        price: prev[recipeId]?.price || "",
      },
    }));
  };

  const handlePriceChange = (recipeId: string, price: string) => {
    setSelectedRecipes((prev) => ({
      ...prev,
      [recipeId]: {
        selected: prev[recipeId]?.selected || false,
        price,
      },
    }));
  };

  const handleSubmit = async () => {
    const itemsToSell = Object.entries(selectedRecipes)
      .filter(([_, item]) => item.selected && item.price)
      .map(([recipeId, item]) => ({
        recipeId,
        price: parseFloat(item.price),
      }));

    if (itemsToSell.length === 0) {
      alert("Please select at least one recipe and set a price");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/recipes/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToSell }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to list recipes");
      }

      alert("Successfully listed on marketplace!");
      router.push("/marketplace");
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to list recipes");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <main className="flex-1 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading your recipes...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="flex-1 bg-gray-50/50">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/recipes" className="hover:text-emerald-400 transition-colors">
                Recipes
              </Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-800 font-medium">Sell Recipes</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sell Your Recipes</h1>
                <p className="text-sm text-gray-500 mt-1">
                  List your recipes on the marketplace and earn
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-8">
          {recipes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500 text-sm mb-4">
                You haven't created any recipes yet
              </p>
              <Link href="/recipes/create">
                <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-6 h-10 text-sm font-semibold shadow-lg shadow-pink-200/50 border-none">
                  Create Your First Recipe
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900">
                  ✓ Select recipes below and set a price for each to list on the marketplace
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {recipes.map((recipe) => {
                  const item = selectedRecipes[recipe.id] || { selected: false, price: "" };
                  return (
                    <div
                      key={recipe.id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleRecipe(recipe.id)}
                          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            item.selected
                              ? "bg-emerald-400 border-emerald-400"
                              : "border-gray-300 hover:border-emerald-300"
                          }`}
                        >
                          {item.selected && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {recipe.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <span>📁 {recipe.category}</span>
                            <span>⏱️ {recipe.prepTime}</span>
                            <span>👥 {recipe.servings}</span>
                          </div>
                        </div>

                        {item.selected && (
                          <div className="shrink-0 flex items-center gap-2">
                            <span className="text-xs text-gray-600 font-medium">
                              Price:
                            </span>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                                $
                              </span>
                              <Input
                                type="number"
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                value={item.price}
                                onChange={(e) =>
                                  handlePriceChange(recipe.id, e.target.value)
                                }
                                className="w-24 pl-7 pr-3 h-9 rounded-lg border-gray-200 bg-white text-sm focus:ring-emerald-400 focus:border-emerald-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-6">
                <div>
                  <p className="text-sm text-gray-600">
                    Selected{" "}
                    <span className="font-semibold text-gray-900">
                      {Object.values(selectedRecipes).filter((x) => x.selected)
                        .length}
                    </span>{" "}
                    recipe{Object.values(selectedRecipes).filter((x) => x.selected).length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/recipes">
                    <Button
                      variant="outline"
                      className="rounded-lg px-6 h-10 text-sm font-medium border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg px-6 h-10 text-sm font-medium shadow-lg shadow-emerald-200/50 border-none"
                  >
                    {isSubmitting ? "Listing..." : "List on Marketplace"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
