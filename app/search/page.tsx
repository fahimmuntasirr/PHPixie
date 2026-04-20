import Link from "next/link";
import { desc } from "drizzle-orm";

import Footer from "@/components/footer";
import { db } from "@/db/config";
import { recipe } from "@/db/schema";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const allRecipes = await db.query.recipe.findMany({
    with: {
      user: true,
    },
    orderBy: [desc(recipe.createdAt)],
  });

  const filteredRecipes = query
    ? allRecipes.filter((item) => {
        const tagText = (item.tags || []).join(" ").toLowerCase();
        const searchable = `${item.title} ${item.description} ${item.category} ${item.difficulty} ${tagText}`.toLowerCase();
        return searchable.includes(query);
      })
    : [];

  return (
    <>
      <main className="flex-1 bg-gray-50/50">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-pink-500 uppercase bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
              Search
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              {query ? `Results for "${q}"` : "Search Recipes"}
            </h1>
            <p className="mt-4 max-w-3xl text-gray-500 text-base md:text-lg leading-relaxed">
              {query
                ? `Found ${filteredRecipes.length} recipe${filteredRecipes.length === 1 ? "" : "s"}.`
                : "Use the search bar in the navigation to find recipes by title, description, category, or tags."}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          {!query ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500 text-sm">Start by typing a recipe keyword in the top search bar.</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500 text-sm">No recipes matched your search. Try another keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((item) => (
                <Link
                  key={item.id}
                  href={`/recipes/${item.id}/view`}
                  className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-pink-200 hover:shadow-md transition-all"
                >
                  <div className="h-44 bg-linear-to-br from-pink-100 via-rose-100 to-pink-200 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-6xl">🍰</span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-pink-500 bg-pink-50 border border-pink-100 rounded-full px-2.5 py-1">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.difficulty}</span>
                    </div>

                    <h2 className="mt-3 text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h2>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.description}</p>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>By {item.user?.name || "Anonymous"}</span>
                      <span>{item.prepTime} prep</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
