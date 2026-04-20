"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { getHomeRecipeStyle, type HomeRecipe } from "./home-data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface DiscoverSectionProps {
  recipes: HomeRecipe[];
}

export default function DiscoverSection({ recipes }: DiscoverSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const categories = useMemo(() => {
    return ["All Categories", ...Array.from(new Set(recipes.map((recipe) => recipe.category)))];
  }, [recipes]);

  const visibleRecipes = useMemo(() => {
    const filtered =
      activeCategory === "All Categories"
        ? recipes
        : recipes.filter((recipe) => recipe.category === activeCategory);

    return filtered.slice(0, 8);
  }, [activeCategory, recipes]);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Discover more recipes:
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-pink-400 text-white shadow-md shadow-pink-200/50"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-pink-300 hover:text-pink-400"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* All Filters */}
          <button className="ml-auto flex items-center gap-2 text-sm text-pink-400 font-medium hover:text-pink-500 transition-colors">
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            All Filters
          </button>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleRecipes.map((recipe) => {
            const style = getHomeRecipeStyle(recipe.category);

            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}/view`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-pink-200 transition-all"
              >
                <div className={`w-full h-48 bg-linear-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden`}>
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform">
                      {style.emoji}
                    </span>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-sm">
                      {style.emoji} {recipe.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                      {recipe.user?.name?.charAt(0).toUpperCase() ?? "A"}
                    </div>
                    <span className="text-xs text-gray-500 truncate">
                      {recipe.user?.name ?? "Anonymous"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <StarRating
                      rating={Math.max(3, Math.min(5, recipe.tags.length || 4))}
                    />
                    <span className="text-xs text-gray-500">
                      {recipe.prepTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full font-medium">
                      {recipe.cookTime} cook
                    </span>
                    <span className="text-xs font-semibold text-pink-400 group-hover:text-pink-500 transition-colors">
                      Learn more →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
