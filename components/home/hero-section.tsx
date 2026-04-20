import { Button } from "@/components/ui/button";
import type { HomeRecipe } from "./home-data";
import { getHomeRecipeStyle } from "./home-data";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function FeaturedRecipeCard({ recipe }: { recipe?: HomeRecipe }) {
  const style = getHomeRecipeStyle(recipe?.category ?? "Other");
  const title = recipe?.title ?? "No recipes yet";
  const author = recipe?.user?.name ?? "Add your first recipe";
  const description = recipe?.description ?? "Create a recipe to feature it here.";
  const imageUrl = recipe?.imageUrl;

  return (
    <div className="relative w-full max-w-md">
      {/* Main card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-pink-200/30">
        <div className={`w-full h-80 bg-linear-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="text-6xl">{style.emoji}</span>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="absolute top-4 left-4">
          <p className="text-white font-semibold text-lg drop-shadow-md">
            {title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-pink-300 to-pink-400 border-2 border-white" />
            <span className="text-white/90 text-sm drop-shadow-md">{author}</span>
          </div>
          <p className="max-w-xs text-white/80 text-xs mt-2 line-clamp-2 drop-shadow-md">
            {description}
          </p>
        </div>

        {/* Bottom stats */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-linear-to-t from-black/60 to-transparent flex items-end justify-between">
          <div>
            <p className="text-white/70 text-xs">Ratings:</p>
            <StarRating rating={5} size="sm" />
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">Prep time:</p>
            <div className="flex items-center gap-1">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">{recipe?.prepTime ?? "--"}</span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">{recipe?.cookTime ?? "--"}</span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">{recipe?.servings ?? "--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating circular badge */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/4 w-24 h-24 rounded-full border-2 border-pink-300 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
        <div className="text-center">
          <p className="text-[8px] font-bold text-pink-400 uppercase tracking-widest leading-tight">
            {recipe?.category ?? "Recipes"}
          </p>
          <p className="text-[7px] text-gray-500 mt-0.5">Latest from database</p>
        </div>
      </div>

      {/* Small secondary card (peek) */}
      <div className={`absolute -right-4 top-4 w-20 h-32 rounded-2xl bg-linear-to-br ${style.gradient} shadow-lg overflow-hidden opacity-60`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl">{style.emoji}</span>
        </div>
      </div>
    </div>
  );
}

interface HeroSectionProps {
  recipe?: HomeRecipe;
}

export default function HeroSection({ recipe }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Discover,{" "}
              <span className="text-pink-400">Cook</span>, and
              <br />
              Share: Your Ultimate
              <br />
              <span className="text-pink-400">Recipe Hub</span>
            </h1>

            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Indulge in the art of baking with recipes for every skill level,
              from simple breads to intricate pastries, shared by bakers like
              you.
            </p>

            <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-8 py-5 text-sm font-semibold shadow-lg shadow-pink-200/50 border-none">
              Explore Now
            </Button>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-pink-400">
                  98k+
                </p>
                <p className="text-sm text-gray-500">Recipes</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-pink-400">
                  100k+
                </p>
                <p className="text-sm text-gray-500">Users</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-pink-400">
                  500k+
                </p>
                <p className="text-sm text-gray-500">Ratings</p>
              </div>
            </div>
          </div>

          {/* Right - Featured Card */}
          <div className="flex justify-center lg:justify-end">
            <FeaturedRecipeCard recipe={recipe} />
          </div>
        </div>
      </div>
    </section>
  );
}
