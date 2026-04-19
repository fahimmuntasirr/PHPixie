import { Button } from "@/components/ui/button";

const foodImages = [
  { emoji: "🥐", gradient: "from-amber-200 via-orange-200 to-amber-300", rotate: "-rotate-3" },
  { emoji: "🎂", gradient: "from-pink-200 via-rose-200 to-pink-300", rotate: "rotate-2" },
  { emoji: "🍞", gradient: "from-yellow-200 via-amber-200 to-yellow-300", rotate: "-rotate-2" },
];

export default function ShareSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image Collage */}
          <div className="relative h-96 flex items-center justify-center">
            {/* Top left image */}
            <div
              className={`absolute top-0 left-4 w-52 h-52 rounded-3xl bg-linear-to-br ${foodImages[0].gradient} ${foodImages[0].rotate} shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 transition-transform`}
            >
              <span className="text-7xl">{foodImages[0].emoji}</span>
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-linear-to-br from-pink-300 to-pink-400 border-2 border-white shadow" />
            </div>

            {/* Top right image */}
            <div
              className={`absolute top-4 right-16 w-44 h-52 rounded-3xl bg-linear-to-br ${foodImages[1].gradient} ${foodImages[1].rotate} shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 transition-transform`}
            >
              <span className="text-7xl">{foodImages[1].emoji}</span>
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-linear-to-br from-amber-300 to-amber-400 border-2 border-white shadow" />
            </div>

            {/* Bottom left image */}
            <div
              className={`absolute bottom-0 left-16 w-56 h-44 rounded-3xl bg-linear-to-br ${foodImages[2].gradient} ${foodImages[2].rotate} shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 transition-transform`}
            >
              <span className="text-7xl">{foodImages[2].emoji}</span>
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-linear-to-br from-violet-300 to-violet-400 border-2 border-white shadow" />
            </div>
          </div>

          {/* Right - CTA Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              <span className="text-pink-400 font-extrabold">Share</span> your
              excellent
              <br />
              recipes{" "}
              <span className="text-pink-400 italic">to the world</span>
            </h2>

            <p className="text-gray-500 leading-relaxed max-w-lg">
              Indulge in the art of baking with recipes for every skill level,
              from simple breads to intricate pastries, shared by bakers like
              you. Indulge in the art of baking with recipes for every skill
              level, from simple breads to intricate pastries, shared by bakers
              like you.
            </p>

            <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-8 py-5 text-sm font-semibold shadow-lg shadow-pink-200/50 border-none">
              Sign Up Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
