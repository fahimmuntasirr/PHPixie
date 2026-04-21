"use client";

import Link from "next/link";

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Medium: "bg-amber-50 text-amber-600 border-amber-200",
  Hard: "bg-orange-50 text-orange-600 border-orange-200",
  Expert: "bg-red-50 text-red-600 border-red-200",
};

const CATEGORY_EMOJI: Record<string, string> = {
  Cakes: "🍰",
  Bread: "🍞",
  Muffins: "🧁",
  Cupcakes: "🧁",
  Cookies: "🍪",
  Pastries: "🥐",
  Pies: "🥧",
  Desserts: "🍨",
  Other: "🍽️",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  Cakes: "from-pink-200 via-rose-200 to-pink-300",
  Bread: "from-yellow-200 via-amber-200 to-yellow-300",
  Muffins: "from-orange-200 via-amber-200 to-orange-300",
  Cupcakes: "from-fuchsia-200 via-pink-200 to-fuchsia-300",
  Cookies: "from-amber-200 via-orange-200 to-amber-300",
  Pastries: "from-amber-200 via-yellow-200 to-amber-300",
  Pies: "from-teal-200 via-emerald-200 to-teal-300",
  Desserts: "from-indigo-200 via-violet-200 to-indigo-300",
  Other: "from-gray-200 via-slate-200 to-gray-300",
};

export interface Recipe {
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
  createdAt: string;
  user?: {
    id: string;
    name: string;
    image?: string | null;
  };
}

interface RecipeCardProps {
  recipe: Recipe;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  statusLabel?: string;
}

export default function RecipeCard({
  recipe,
  showActions = false,
  onEdit,
  onDelete,
  statusLabel,
}: RecipeCardProps) {
  const emoji = CATEGORY_EMOJI[recipe.category] ?? "🍽️";
  const gradient = CATEGORY_GRADIENTS[recipe.category] ?? "from-gray-200 via-slate-200 to-gray-300";
  const difficultyColor = DIFFICULTY_COLORS[recipe.difficulty] ?? "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300">
      {/* Image / Gradient placeholder */}
      <div className="relative h-48 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
          >
            <span className="text-5xl drop-shadow-sm">{emoji}</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-sm">
            {emoji} {recipe.category}
          </span>
        </div>

        {/* Status / action overlay */}
        {(statusLabel || showActions) && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {statusLabel && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-emerald-600 shadow-sm">
                {statusLabel}
              </span>
            )}
            {showActions && onEdit && onDelete && (
              <>
                <button
                  onClick={() => onEdit(recipe.id)}
                  className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-pink-500 hover:bg-white shadow-sm transition-all"
                  aria-label="Edit recipe"
                  id={`edit-recipe-${recipe.id}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(recipe.id)}
                  className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                  aria-label="Delete recipe"
                  id={`delete-recipe-${recipe.id}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* Author badge overlay */}
        {recipe.user && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm pr-3 pl-1 py-1 rounded-full shadow-sm">
            <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-bold text-pink-500 shadow-sm border border-pink-200">
              {recipe.user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] text-gray-700 font-semibold truncate max-w-30">
              {recipe.user.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link href={`/recipes/${recipe.id}/view`}>
          <div>
            <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-1 group-hover:text-pink-500 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          </div>
        </Link>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {recipe.prepTime}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            {recipe.cookTime}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {recipe.servings} servings
          </span>
        </div>

        {/* Tags + Difficulty */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-medium border border-gray-100"
              >
                #{tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-medium">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${difficultyColor}`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
