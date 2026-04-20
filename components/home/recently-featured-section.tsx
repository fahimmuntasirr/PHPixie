import { getHomeRecipeStyle, groupRecipesByCategory, type HomeRecipe } from "./home-data";
import Link from "next/link";

interface RecentlyFeaturedSectionProps {
  recipes: HomeRecipe[];
}

function CategoryCard({ category, recipes }: { category: string; recipes: HomeRecipe[] }) {
  const style = getHomeRecipeStyle(category);
  const mainRecipe = recipes[0];
  const thumbnailRecipes = recipes.slice(1, 4);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
      <Link href={`/recipes/${mainRecipe?.id}/view`} className="contents">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={`col-span-2 row-span-3 rounded-2xl bg-linear-to-br ${style.gradient} flex items-center justify-center h-48 overflow-hidden`}>
          {mainRecipe?.imageUrl ? (
            <img src={mainRecipe.imageUrl} alt={mainRecipe.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl group-hover:scale-110 transition-transform">
              {style.emoji}
            </span>
          )}
        </div>
        {thumbnailRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-xl bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center h-14 overflow-hidden"
          >
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">{style.emoji}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {recipes.slice(0, 3).map((recipe) => (
              <div
                key={recipe.id}
                className="w-6 h-6 rounded-full bg-linear-to-br from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
              >
                {recipe.user?.name?.charAt(0).toUpperCase() ?? "A"}
              </div>
            ))}
          </div>
          <p className="font-semibold text-gray-800 text-sm">{category}</p>
        </div>
        <span className="text-xs text-pink-400 border border-pink-300 rounded-full px-3 py-1 font-medium">
          {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
        </span>
      </div>
      </Link>
    </div>
  );
}

export default function RecentlyFeaturedSection({ recipes }: RecentlyFeaturedSectionProps) {
  const categories = Object.entries(groupRecipesByCategory(recipes))
    .map(([category, items]) => ({ category, items }))
    .sort((left, right) => right.items.length - left.items.length)
    .slice(0, 3);

  return (
    <section className="bg-gray-50/50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Recently Featured{" "}
          <span className="text-pink-400 italic">Recipes</span>:
        </h2>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map(({ category, items }) => (
              <CategoryCard key={category} category={category} recipes={items} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500">
              Recently featured categories will appear here once recipes are added.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
