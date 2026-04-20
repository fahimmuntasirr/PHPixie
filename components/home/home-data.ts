export interface HomeRecipe {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  imageUrl: string | null;
  tags: string[];
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
}

const CATEGORY_STYLES: Record<string, { emoji: string; gradient: string }> = {
  Cakes: { emoji: "🍰", gradient: "from-pink-200 via-rose-200 to-pink-300" },
  Bread: { emoji: "🍞", gradient: "from-yellow-200 via-amber-200 to-yellow-300" },
  Muffins: { emoji: "🧁", gradient: "from-orange-200 via-amber-200 to-orange-300" },
  Cupcakes: { emoji: "🧁", gradient: "from-fuchsia-200 via-pink-200 to-fuchsia-300" },
  Cookies: { emoji: "🍪", gradient: "from-amber-200 via-orange-200 to-amber-300" },
  Pastries: { emoji: "🥐", gradient: "from-amber-200 via-yellow-200 to-amber-300" },
  Pies: { emoji: "🥧", gradient: "from-teal-200 via-emerald-200 to-teal-300" },
  Desserts: { emoji: "🍨", gradient: "from-indigo-200 via-violet-200 to-indigo-300" },
  Other: { emoji: "🍽️", gradient: "from-gray-200 via-slate-200 to-gray-300" },
};

export function getHomeRecipeStyle(category: string) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Other;
}

export function groupRecipesByCategory(recipes: HomeRecipe[]) {
  return recipes.reduce<Record<string, HomeRecipe[]>>((groups, recipe) => {
    const bucket = groups[recipe.category] ?? [];
    bucket.push(recipe);
    groups[recipe.category] = bucket;
    return groups;
  }, {});
}
