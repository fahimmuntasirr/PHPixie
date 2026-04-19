import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Star } from "lucide-react";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const featuredItems = [
  {
    name: "Starter Baking Kit",
    seller: "OvenCraft Studio",
    price: "$24",
    rating: 4.8,
    gradient: "from-pink-200 via-rose-200 to-pink-300",
  },
  {
    name: "Silicone Muffin Set",
    seller: "BakeNest",
    price: "$16",
    rating: 4.7,
    gradient: "from-amber-200 via-orange-200 to-amber-300",
  },
  {
    name: "Chef Piping Bundle",
    seller: "CreamLine Tools",
    price: "$19",
    rating: 4.9,
    gradient: "from-teal-200 via-emerald-200 to-green-300",
  },
  {
    name: "Decorating Sprinkles Box",
    seller: "SweetShelf",
    price: "$11",
    rating: 4.6,
    gradient: "from-violet-200 via-fuchsia-200 to-pink-200",
  },
  {
    name: "Premium Whisk Pro",
    seller: "Kitchen Forge",
    price: "$14",
    rating: 4.8,
    gradient: "from-slate-200 via-zinc-200 to-slate-300",
  },
  {
    name: "Glass Mixing Bowls",
    seller: "Home Dough",
    price: "$27",
    rating: 4.9,
    gradient: "from-cyan-200 via-sky-200 to-blue-300",
  },
];

export default function MarketplacePage() {
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
            {featuredItems.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-pink-200 hover:shadow-md transition-all"
              >
                <div
                  className={`h-40 bg-linear-to-br ${item.gradient} flex items-center justify-center`}
                >
                  <span className="text-5xl">🧁</span>
                </div>

                <div className="p-5">
                  <h2 className="text-base font-semibold text-gray-900">{item.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">by {item.seller}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-pink-500">{item.price}</p>
                    <p className="inline-flex items-center gap-1 text-sm font-medium text-gray-600">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {item.rating}
                    </p>
                  </div>

                  <button className="mt-4 w-full h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2">
                    View Item
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
