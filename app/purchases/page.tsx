import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowRight, ExternalLink } from "lucide-react";

import { db } from "@/db/config";
import { purchase } from "@/db/schema/purchase-schema";
import { marketplaceProduct } from "@/db/schema/marketplace-schema";
import { recipe } from "@/db/schema/recipe-schema";
import { auth } from "@/lib/auth";
import Footer from "@/components/footer";

export default async function PurchasesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Fetch purchases joined with product and optionally recipe
  const userPurchases = await db
    .select({
      purchase: purchase,
      product: marketplaceProduct,
      recipe: recipe,
    })
    .from(purchase)
    .where(eq(purchase.userId, session.user.id))
    .innerJoin(marketplaceProduct, eq(purchase.productId, marketplaceProduct.id))
    .leftJoin(recipe, eq(marketplaceProduct.recipeId, recipe.id))
    .orderBy(desc(purchase.createdAt));

  return (
    <>
      <main className="flex-1 bg-gray-50/50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Purchases</h1>
              <p className="text-gray-500 mt-1 text-sm">View items and recipes you've bought from the marketplace</p>
            </div>
          </div>

          {userPurchases.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                You haven't bought any items or recipes from the marketplace yet. Explore our collection to find something you'll love!
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPurchases.map((item) => (
                <div key={item.purchase.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {item.product.imageUrl || item.recipe?.imageUrl ? (
                      <img 
                        src={item.product.imageUrl || item.recipe?.imageUrl!} 
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-pink-50 text-pink-300">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                      {new Date(item.purchase.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-pink-500 uppercase tracking-wider mb-2">
                        {item.product.category}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.product.description}
                      </p>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-gray-50 flex gap-2">
                      {item.recipe ? (
                        <Link 
                          href={`/recipes/${item.recipe.id}/view`}
                          className="flex-1 h-10 inline-flex items-center justify-center rounded-xl bg-pink-50 text-pink-600 text-sm font-medium hover:bg-pink-100 transition-colors gap-2"
                        >
                          View Recipe <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="flex-1 h-10 inline-flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 text-sm font-medium">
                          No Recipe Linked
                        </span>
                      )}
                      
                      <Link 
                        href={`/marketplace/${item.product.id}`}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        title="View in Marketplace"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
