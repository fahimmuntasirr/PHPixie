import { getHomeRecipeStyle, groupRecipesByCategory, type HomeRecipe } from "./home-data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface FeaturedSectionProps {
  recipes: HomeRecipe[];
}

function RecipeRow({ recipe }: { recipe: HomeRecipe }) {
  const style = getHomeRecipeStyle(recipe.category);

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all">
      <div className={`w-20 h-20 rounded-xl bg-linear-to-br ${style.gradient} flex items-center justify-center shrink-0 overflow-hidden`}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">{style.emoji}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-5 h-5 rounded-full bg-linear-to-br from-pink-300 to-pink-400 border border-white flex items-center justify-center text-[9px] font-bold text-white">
            {recipe.user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <span className="text-xs text-gray-500 truncate">
            {recipe.user?.name ?? "Anonymous"}
          </span>
        </div>
        <StarRating rating={5} />
        <p className="mt-1 text-[11px] text-gray-400 truncate">
          {recipe.prepTime} prep • {recipe.cookTime} cook • {recipe.servings} servings
        </p>
      </div>
    </div>
  );
}

export default function FeaturedSection({ recipes }: FeaturedSectionProps) {
  const featuredRecipes = recipes.slice(1, 4);
  const categoryGroups = Object.entries(groupRecipesByCategory(recipes))
    .map(([name, items]) => ({
      name,
      count: items.length,
      style: getHomeRecipeStyle(name),
      author: items[0]?.user?.name ?? "Anonymous",
    }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);
  const spotlight = recipes[0];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Big Feature Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-md group">
            <div className={`w-full h-96 bg-linear-to-br ${getHomeRecipeStyle(spotlight?.category ?? "Other").gradient} flex items-center justify-center relative overflow-hidden`}>
              {spotlight?.imageUrl ? (
                <img src={spotlight.imageUrl} alt={spotlight.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <span className="text-8xl block mb-2">
                    {getHomeRecipeStyle(spotlight?.category ?? "Other").emoji}
                  </span>
                  <p className="text-gray-600 text-sm font-medium">
                    {spotlight?.category ?? "No recipes yet"}
                  </p>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white/90 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-300 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {spotlight?.user?.name?.charAt(0).toUpperCase() ?? "A"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {spotlight?.title ?? "No recipes published yet"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {spotlight?.user?.name ?? "Add a recipe to feature it here"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-xs text-gray-500">
                  {spotlight ? `${spotlight.category} recipe` : "Latest recipe feed"}
                </p>
                <StarRating rating={3} />
              </div>
            </div>
          </div>

          {/* Center - Recipe Cards Stack */}
          <div className="space-y-4">
            {featuredRecipes.length > 0 ? (
              featuredRecipes.map((recipe) => (
                <RecipeRow key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                Create a few recipes and they will appear here.
              </div>
            )}
          </div>

          {/* Right - Top Categories */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Top Categories from
              </h3>
              <p className="text-pink-400 font-medium text-sm">Your recipe library</p>
            </div>

            <div className="space-y-3">
              {categoryGroups.length > 0 ? categoryGroups.map((group, index) => (
                <div
                  key={group.name}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-bold text-gray-400 w-6 text-center">
                    {index + 1}
                  </span>
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full bg-linear-to-br ${group.style.gradient} border-2 border-white shadow-sm flex items-center justify-center`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs">{group.style.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {group.author}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-500">
                      {group.count}
                    </p>
                    <p className="text-[10px] text-gray-400">recipes</p>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                  No categories yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
