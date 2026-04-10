"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-pink-400 tracking-tight">
            BakingTales
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-gray-700 hover:text-pink-400 transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/recipes"
            className="text-sm font-medium text-gray-700 hover:text-pink-400 transition-colors"
          >
            Recipes
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 hover:text-pink-400 transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Search + Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Input
              type="text"
              placeholder="Search"
              className="w-48 pl-4 pr-10 h-9 rounded-full border-gray-200 bg-white text-sm focus:ring-pink-400 focus:border-pink-400"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <Link href="/recipes/create">
            <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-6 h-9 text-sm font-medium shadow-none border-none">
              Upload
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-pink-400 text-pink-400 hover:bg-pink-50 hover:text-pink-500 rounded-full px-6 h-9 text-sm font-medium"
          >
            Register Now
          </Button>
        </div>
      </div>
    </header>
  );
}
