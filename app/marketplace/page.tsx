import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Star } from "lucide-react";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { db } from "@/db/config";
import { marketplaceProduct, recipe } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Tools": "🔧",
  "Kits": "📦",
  "Decorations": "✨",
  "Supplies": "🧴",
  "Other": "🛍️",
};

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] || CATEGORY_EMOJIS["Other"];
}

function getProductGradient(category: string): string {
  const gradients: Record<string, string> = {
    "Tools": "from-slate-200 via-zinc-200 to-slate-300",
    "Kits": "from-pink-200 via-rose-200 to-pink-300",
    "Decorations": "from-violet-200 via-fuchsia-200 to-pink-200",
    "Supplies": "from-amber-200 via-orange-200 to-amber-300",
    "Other": "from-gray-200 via-slate-200 to-gray-300",
  };
  return gradients[category] || gradients["Other"];
}

interface MarketplaceProduct {
  id: string;
  recipeId: string | null;
  name: string;
  description: string;
  seller: string;
  price: string | number;
  rating: string | number;
  imageUrl?: string | null;
  category: string;
}

interface LinkedRecipePreview {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export default async function MarketplacePage() {
  let featuredItems: Array<MarketplaceProduct & { linkedRecipe?: LinkedRecipePreview | null }> = [];

  try {
    const products = await db.query.marketplaceProduct.findMany({
      orderBy: [desc(marketplaceProduct.createdAt)],
      limit: 12,
    });

    const recipeIds = Array.from(
      new Set(products.map((product) => product.recipeId).filter((id): id is string => Boolean(id)))
    );

    const linkedRecipes = recipeIds.length
      ? await db
          .select({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            imageUrl: recipe.imageUrl,
          })
          .from(recipe)
          .where(inArray(recipe.id, recipeIds))
      : [];

    const linkedRecipeMap = new Map(linkedRecipes.map((item) => [item.id, item]));

    // Convert Decimal types to plain numbers for serialization
    featuredItems = products.slice(0, 6).map(item => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price),
      rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating),
      linkedRecipe: item.recipeId ? linkedRecipeMap.get(item.recipeId) ?? null : null,
    }));
  } catch (error) {
    // Table may not exist yet or database connection issue
    console.error("Failed to fetch marketplace products:", error);
    featuredItems = [];
  }

  return (
    <>
      <main className="flex-1 bg-gray-50/50">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-pink-500 uppercase bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              Marketplace
            </p>

            <div className="mt-5 max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Discover tools and kits curated for every baking journey.
              </h1>
              <p className="mt-4 text-gray-500 text-base md:text-lg leading-relaxed">
                Browse trending baking essentials from our creator marketplace and
                find your next favorite kitchen companion.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/recipes">
                <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-6 h-10 text-sm font-medium border-none">
                  Browse Recipes
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="rounded-full px-6 h-10 text-sm font-medium border-pink-200 text-pink-500 hover:bg-pink-50"
                >
                  Learn About Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.length > 0 ? (
              featuredItems.map((item) => {
                const emoji = getCategoryEmoji(item.category);
                const gradient = getProductGradient(item.category);
                const price = `$${Number(item.price).toFixed(2)}`;
                const rating = Number(item.rating);
                const recipeHref = item.recipeId ? `/recipes/${item.recipeId}/view` : null;
                const buyHref = `/marketplace/${item.id}/buy`;
                const displayImage = item.linkedRecipe?.imageUrl || item.imageUrl;
                const displayDescription = item.linkedRecipe?.description || item.description;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-pink-200 hover:shadow-md transition-all group"
                  >
                    <div className={`h-40 bg-linear-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-5xl">{emoji}</span>
                      )}
                    </div>

                    <div className="p-5">
                      <h2 className="text-base font-semibold text-gray-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-gray-500">by {item.seller}</p>

                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {displayDescription}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xl font-bold text-pink-500">{price}</p>
                        <p className="inline-flex items-center gap-1 text-sm font-medium text-gray-600">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          {Math.min(5, Math.max(0, Number(rating))).toFixed(1)}
                        </p>
                      </div>

                      <div className={`mt-5 gap-3 ${recipeHref ? "grid grid-cols-2" : "grid grid-cols-1"}`}>
                        {recipeHref ? (
                          <Link
                            href={recipeHref}
                            className="h-10 rounded-xl border border-pink-200 text-pink-500 text-sm font-medium hover:bg-pink-50 transition-colors inline-flex items-center justify-center gap-2"
                          >
                            View Recipe
                          </Link>
                        ) : null}

                        <Link
                          href={buyHref}
                          className="h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 group-hover:bg-gray-800"
                        >
                          Buy
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  No products available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
