"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, Eye, ArrowRight, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { favoriteService } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import type { Design } from "@/store/useStore";

interface DesignCardProps {
  design: Design;
  index?: number;
  variant?: "default" | "compact" | "featured";
  showAddToCollection?: boolean;
  onAddToCollection?: (design: Design) => void;
}

export function DesignCard({
  design,
  index = 0,
  variant = "default",
  showAddToCollection = false,
  onAddToCollection,
}: DesignCardProps) {
  const { isAuthenticated, token, isFavorite, addFavorite, removeFavorite } = useStore();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const favorited = isFavorite(design.id);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !token) {
      showError("Sign in required", "Please log in to save favorites");
      return;
    }
    setIsLoading(true);
    try {
      if (favorited) {
        await favoriteService.remove(token, design.id);
        removeFavorite(design.id);
        success("Removed from favorites");
      } else {
        await favoriteService.add(token, design.id);
        addFavorite(design);
        success("Added to favorites ❤️");
      }
    } catch {
      showError("Error", "Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <Link href={`/explore/${design.id}`}>
          <div className="flex gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 img-overlay">
              <img
                src={imgError ? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=60" : design.images[0]}
                alt={design.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{design.title}</p>
              <p className="text-white/40 text-xs">{design.style} · {design.roomType}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white/40 text-xs">{Number(design.rating ?? 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 100 }}
      className="group masonry-item"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 card-hover">
        {/* Image */}
        <Link href={`/explore/${design.id}`}>
          <div className="relative overflow-hidden" style={{ aspectRatio: index % 3 === 0 ? "3/4" : "4/3" }}>
            <img
              src={imgError ? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70" : design.images[0]}
              alt={design.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium border border-white/10">
                {design.style}
              </span>
              {design.isAiGenerated && (
                <span className="px-2 py-1 rounded-lg bg-accent-500/60 backdrop-blur-sm text-white text-[10px] font-medium">
                  ✨ AI
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                disabled={isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                  favorited
                    ? "bg-red-500 text-white"
                    : "bg-black/40 text-white hover:bg-red-500/80"
                }`}
              >
                <Heart size={14} className={favorited ? "fill-white" : ""} />
              </motion.button>
              {showAddToCollection && onAddToCollection && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCollection(design);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 text-white hover:bg-primary-500/80 backdrop-blur-sm transition-all"
                >
                  <Plus size={14} />
                </motion.button>
              )}
            </div>

            {/* View on Hover */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-medium">View Design</span>
                <ArrowRight size={14} className="text-white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4">
          <Link href={`/explore/${design.id}`}>
            <h3 className="text-white font-medium text-sm leading-tight mb-2 hover:text-primary-400 transition-colors line-clamp-2">
              {design.title}
            </h3>
          </Link>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-white/40 mb-3">
            <div className="flex items-center gap-1">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span>{Number(design.rating ?? 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={10} />
              <span>{(design.viewCount ?? 0).toLocaleString()}</span>
            </div>
            <span className="text-primary-400 font-medium">
              {formatCurrency(Number(design.estimatedBudget ?? 0))}
            </span>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-1.5">
            {design.colorPalette.slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white/20 shadow-sm transition-transform hover:scale-125"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {design.colorPalette.length > 5 && (
              <span className="text-white/30 text-xs">+{design.colorPalette.length - 5}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
