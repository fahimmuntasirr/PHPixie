"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import RecipeCard, { type Recipe } from "@/components/recipes/recipe-card";

const CATEGORIES = [
  "All",
  "Cakes",
  "Bread",
  "Muffins",
  "Cupcakes",
  "Cookies",
  "Pastries",
  "Pies",
  "Desserts",
];

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard", "Expert"];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRecipes(
          data.map((r: Record<string, unknown>) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            category: r.category,
            difficulty: r.difficulty,
            prepTime: r.prepTime,
            cookTime: r.cookTime,
            servings: r.servings,
            imageUrl: r.imageUrl || "",
            tags: (r.tags as string[]) || [],
            createdAt: r.createdAt,
            user: r.user,
          }))
        );
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        !search ||
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase()) ||
        recipe.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );
      const matchesCategory =
        categoryFilter === "All" || recipe.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "All" || recipe.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [recipes, search, categoryFilter, difficultyFilter]);

  const stats = useMemo(() => {
    return {
      total: recipes.length,
      categories: new Set(recipes.map((r) => r.category)).size,
      easy: recipes.filter((r) => r.difficulty === "Easy").length,
      expert: recipes.filter((r) => r.difficulty === "Expert").length,
    };
  }, [recipes]);

  return (
    <>

      <main className="flex-1 bg-gray-50/50">
        {/* Hero Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  My{" "}
                  <span className="text-pink-400">Recipes</span>
                </h1>
                <p className="text-gray-500 mt-2 max-w-lg">
                  Manage your recipe collection. Create, edit, and organize all
                  your baking creations in one place.
                </p>
              </div>
              <Link href="/recipes/create">
                <Button
                  className="bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-6 h-11 text-sm font-semibold shadow-lg shadow-pink-200/50 border-none gap-2"
                  id="create-recipe-btn"
                >
                  <svg
                    className="w-4 h-4"
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
                  Create Recipe
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-linear-to-br from-pink-50 to-pink-100/50 rounded-xl p-4 border border-pink-100">
                <p className="text-2xl font-bold text-pink-500">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Total Recipes
                </p>
              </div>
              <div className="bg-linear-to-br from-violet-50 to-violet-100/50 rounded-xl p-4 border border-violet-100">
                <p className="text-2xl font-bold text-violet-500">
                  {stats.categories}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Categories
                </p>
              </div>
              <div className="bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-500">
                  {stats.easy}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Easy Recipes
                </p>
              </div>
              <div className="bg-linear-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100">
                <p className="text-2xl font-bold text-amber-500">
                  {stats.expert}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Expert Level
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b border-gray-100 sticky top-14.25 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                  id="recipe-search"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${categoryFilter === cat
                        ? "bg-pink-400 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    id={`category-filter-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Difficulty filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all appearance-none cursor-pointer pr-8"
                id="difficulty-filter"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Difficulties" : d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Recipe Grid */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-400 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">Loading recipes...</p>
            </div>
          ) : filteredRecipes.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-5">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredRecipes.length}
                </span>{" "}
                {filteredRecipes.length === 1 ? "recipe" : "recipes"}
                {(search || categoryFilter !== "All" || difficultyFilter !== "All") &&
                  " matching your filters"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">
                No recipes found
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {search || categoryFilter !== "All" || difficultyFilter !== "All"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first recipe"}
              </p>
              {!search &&
                categoryFilter === "All" &&
                difficultyFilter === "All" && (
                  <Link href="/recipes/create" className="inline-block mt-4">
                    <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-6 h-10 text-sm font-semibold shadow-lg shadow-pink-200/50 border-none">
                      Create Your First Recipe
                    </Button>
                  </Link>
                )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
