import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Calendar, ShoppingBag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileButton } from "./edit-profile-button";
import ProfileRecipeGrid from "@/components/profile/profile-recipe-grid";
import { db } from "@/db/config";
import { recipe, marketplaceProduct } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  // Format the date if it exists
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const userRecipes = await db
    .select()
    .from(recipe)
    .where(eq(recipe.userId, session.user.id))
    .orderBy(desc(recipe.createdAt));

  const recipeIds = userRecipes.map((item) => item.id);
  const listedRecipes = recipeIds.length
    ? await db
        .select({ recipeId: marketplaceProduct.recipeId })
        .from(marketplaceProduct)
        .where(inArray(marketplaceProduct.recipeId, recipeIds))
    : [];

  const listedRecipeIds = new Set(
    listedRecipes.map((item) => item.recipeId).filter((id): id is string => Boolean(id))
  );

  const recipesWithListingState = userRecipes.map((item) => ({
    ...item,
    listed: listedRecipeIds.has(item.id),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">My Profile</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Photo / Header area */}
          <div className="h-32 bg-linear-to-r from-pink-400 to-pink-300"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar Row */}
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-pink-100 flex items-center justify-center text-pink-500 text-3xl font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <EditProfileButton initialName={user.name} />
            </div>

            {/* User Info details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-4 mt-3 text-gray-600">
                <div className="flex items-center gap-1.5 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Joined {joinedDate}
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                <Link href="/purchases" className="inline-flex items-center text-sm font-medium text-pink-500 hover:text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg transition-colors">
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  My Purchases
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Active
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Email Verification</div>
                  <div className="font-medium text-gray-900">
                    {user.emailVerified ? (
                      <span className="text-green-600">Verified</span>
                    ) : (
                      <span className="text-orange-500">Unverified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-pink-500" />
                  My Recipes
                </h3>
                <Link href="/recipes/create" className="text-sm font-medium text-pink-500 hover:text-pink-600">
                  + Create New
                </Link>
              </div>

              {recipesWithListingState.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-4">You haven&apos;t created any recipes yet.</p>
                  <Link href="/recipes/create">
                    <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-6 h-9 text-sm font-medium">
                      Create your first recipe
                    </Button>
                  </Link>
                </div>
              ) : (
                <ProfileRecipeGrid recipes={recipesWithListingState} />
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
