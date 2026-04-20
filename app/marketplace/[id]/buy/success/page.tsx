import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowLeft, BookOpen } from "lucide-react";
import { eq } from "drizzle-orm";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { db } from "@/db/config";
import { marketplaceProduct } from "@/db/schema";

export default async function BuySuccessPage({
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

  const recipeHref = product.recipeId ? `/recipes/${product.recipeId}/view` : "/recipes";

  return (
    <>
      <main className="flex-1 bg-gray-50/50">
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <p className="mt-6 text-xs font-semibold tracking-wide uppercase text-emerald-600">
            Purchase Complete
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            Your order for {product.name} has been placed.
          </h1>
          <p className="mt-4 text-gray-600 leading-relaxed">
            You can now revisit the recipe, or go back to the marketplace to continue browsing.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={recipeHref}>
              <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-6 h-10 text-sm font-medium border-none">
                <BookOpen className="w-4 h-4 mr-2" />
                View Recipe
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                variant="outline"
                className="rounded-full px-6 h-10 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
