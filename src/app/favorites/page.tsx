"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore } from "@/store/useStore";
import { favoriteService } from "@/services/api";
import { DesignCard } from "@/components/designs/DesignCard";
import { DesignGridSkeleton } from "@/components/ui/SkeletonLoader";
import { NoFavorites } from "@/components/ui/EmptyState";
import type { Design } from "@/store/useStore";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, token, favorites, setFavorites } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!token) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await favoriteService.getAll(token);
        setFavorites(res.data as Design[]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, token, router, setFavorites]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 text-white">
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Heart size={28} className="text-red-400 fill-red-400" />
              <h1 className="text-4xl font-bold text-white">My Favorites</h1>
            </div>
            <p className="text-white/40">
              {favorites.length} saved {favorites.length === 1 ? "design" : "designs"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <DesignGridSkeleton count={8} />
        ) : favorites.length === 0 ? (
          <NoFavorites onExplore={() => router.push("/explore")} />
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {favorites.map((design, i) => (
              <DesignCard key={design.id} design={design} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
