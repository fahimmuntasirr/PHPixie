import Link from "next/link";
import { HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Community First",
    description:
      "We believe baking is best when shared. Every recipe on BakingTales is built for connection and creativity.",
    icon: Users,
    accent: "from-pink-50 to-rose-50 border-pink-100",
  },
  {
    title: "Trusted Recipes",
    description:
      "From simple bakes to advanced pastries, we focus on clear guidance and practical techniques.",
    icon: ShieldCheck,
    accent: "from-emerald-50 to-teal-50 border-emerald-100",
  },
  {
    title: "Joyful Experience",
    description:
      "Baking should feel fun and rewarding. We design every page to keep things delightful and simple.",
    icon: Sparkles,
    accent: "from-amber-50 to-orange-50 border-amber-100",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="flex-1 bg-gray-50/50">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-pink-500 uppercase bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              About BakingTales
            </p>

            <div className="mt-5 max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                A home for bakers to discover, create, and share recipes they love.
              </h1>
              <p className="mt-4 text-gray-500 text-base md:text-lg leading-relaxed">
                BakingTales is built for curious beginners, weekend bakers, and pastry pros alike.
                Our goal is to make baking more accessible through thoughtful recipe pages,
                practical tips, and a warm community.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/recipes">
                <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-6 h-10 text-sm font-medium border-none">
                  Explore Recipes
                </Button>
              </Link>
              <Link href="/recipes/create">
                <Button
                  variant="outline"
                  className="rounded-full px-6 h-10 text-sm font-medium border-pink-200 text-pink-500 hover:bg-pink-50"
                >
                  Share a Recipe
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className={`rounded-2xl border bg-gradient-to-br ${value.accent} p-6`}
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-pink-500" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-gray-900">{value.title}</h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
