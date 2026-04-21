import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { eq } from "drizzle-orm";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { db } from "@/db/config";
import { marketplaceProduct, recipe } from "@/db/schema";
import { createPurchaseAction } from "./actions";

const CATEGORY_EMOJIS: Record<string, string> = {
  Tools: "🔧",
  Kits: "📦",
  Decorations: "✨",
  Supplies: "🧴",
  Other: "🛍️",
};

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] || CATEGORY_EMOJIS.Other;
}

function getProductGradient(category: string): string {
  const gradients: Record<string, string> = {
    Tools: "from-slate-200 via-zinc-200 to-slate-300",
    Kits: "from-pink-200 via-rose-200 to-pink-300",
    Decorations: "from-violet-200 via-fuchsia-200 to-pink-200",
    Supplies: "from-amber-200 via-orange-200 to-amber-300",
    Other: "from-gray-200 via-slate-200 to-gray-300",
  };
  return gradients[category] || gradients.Other;
}

export default async function BuyProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.query.marketplaceProduct.findFirst({
    where: eq(marketplaceProduct.id, id),
  });

  if (!product) {
    notFound();
  }

  const linkedRecipe = product.recipeId
    ? await db.query.recipe.findFirst({
        where: eq(recipe.id, product.recipeId),
      })
    : null;

  const emoji = getCategoryEmoji(product.category);
  const gradient = getProductGradient(product.category);
  const price = Number(product.price).toFixed(2);
  const rating = Number(product.rating).toFixed(1);
  const recipeHref = product.recipeId ? `/recipes/${product.recipeId}/view` : null;
  const successHref = `/marketplace/${product.id}/buy/success`;
  const displayImage = linkedRecipe?.imageUrl || product.imageUrl;
  const displayDescription = linkedRecipe?.description || product.description;

  return (
    <>
      <main className="flex-1 bg-gray-50/50">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-medium text-pink-500 hover:text-pink-600">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                <div className={`h-64 bg-linear-to-br ${gradient} flex items-center justify-center`}>
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-7xl">{emoji}</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-pink-500 font-semibold">
                        Marketplace Product
                      </p>
                      <h1 className="mt-2 text-3xl font-bold text-gray-900 leading-tight">
                        {product.name}
                      </h1>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-3xl font-bold text-pink-500">${price}</p>
                      <p className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 justify-end">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {rating}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
                    {displayDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-sm font-medium">
                      Seller: {product.seller}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                      Category: {product.category}
                    </span>
                  </div>
                </div>
              </div>

              {linkedRecipe ? (
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6">
                  <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                    Linked Recipe
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {linkedRecipe.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {linkedRecipe.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={recipeHref!}
                      className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 h-10 text-sm font-medium text-emerald-600 hover:bg-emerald-100 transition-colors"
                    >
                      View Full Recipe
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Checkout Summary</h2>
                <div className="mt-5 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Item price</span>
                    <span className="font-semibold text-gray-900">${price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quantity</span>
                    <span className="font-semibold text-gray-900">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Service fee</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-pink-500">${price}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <form action={createPurchaseAction.bind(null, product.id)}>
                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Buy Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {recipeHref ? (
                    <Link
                      href={recipeHref}
                      className="w-full h-11 rounded-xl border border-pink-200 text-pink-500 text-sm font-medium hover:bg-pink-50 transition-colors inline-flex items-center justify-center"
                    >
                      View Recipe Before Buying
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-pink-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure checkout</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      This page is ready for a future payment provider integration.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Recipe-linked purchase</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      The product stays connected to the original recipe so buyers can review it before purchasing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Marketplace order</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Purchased item: {product.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-pink-50 border border-pink-100 p-6">
                <div className="flex items-center gap-2 text-pink-600 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  What happens next
                </div>
                <p className="mt-3 text-sm text-pink-900/80 leading-relaxed">
                  After purchase, you can return to the marketplace or open the linked recipe to review the creator's full instructions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
