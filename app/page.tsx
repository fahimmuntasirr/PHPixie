import Footer from "@/components/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturedSection from "@/components/home/featured-section";
import RecentlyFeaturedSection from "@/components/home/recently-featured-section";
import ShareSection from "@/components/home/share-section";
import DiscoverSection from "@/components/home/discover-section";
import { db } from "@/db/config";
import { recipe } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { HomeRecipe } from "@/components/home/home-data";

export default async function Home() {
  const recipes = await db.query.recipe.findMany({
    orderBy: [desc(recipe.createdAt)],
    limit: 9,
    with: {
      user: true,
    },
  });

  const homeRecipes: HomeRecipe[] = recipes.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    difficulty: item.difficulty,
    prepTime: item.prepTime,
    cookTime: item.cookTime,
    servings: item.servings,
    imageUrl: item.imageUrl,
    tags: item.tags,
    createdAt: item.createdAt,
    user: item.user
      ? {
          id: item.user.id,
          name: item.user.name,
          image: item.user.image,
        }
      : null,
  }));

  return (
    <>
      <main className="flex-1">
        <HeroSection recipe={homeRecipes[0]} />
        <FeaturedSection recipes={homeRecipes} />
        <RecentlyFeaturedSection recipes={homeRecipes} />
        <ShareSection />
        <DiscoverSection recipes={homeRecipes} />
      </main>
      <Footer />
    </>
  );
}
