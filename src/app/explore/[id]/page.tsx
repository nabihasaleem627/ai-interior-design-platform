"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Star, Eye, ArrowLeft, Plus, ChevronLeft, ChevronRight,
  DollarSign, Palette, Sofa, Layers, GitCompare, Share2, X
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { designService, favoriteService, collectionService } from "@/services/api";
import { DesignDetailSkeleton } from "@/components/ui/SkeletonLoader";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import type { Design, Collection } from "@/store/useStore";

export default function DesignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    isAuthenticated, token, isFavorite, addFavorite, removeFavorite,
    collections, setCompareDesign
  } = useStore();
  const { success, error: showError, info } = useToast();

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [favLoading, setFavLoading] = useState(false);
  const [collectionModal, setCollectionModal] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState<number | null>(null);

  const favorited = design ? isFavorite(design.id) : false;

  useEffect(() => {
    const fetchDesign = async () => {
      setLoading(true);
      try {
        const res = await designService.getById(Number(id), token);
        setDesign(res.data as Design);
      } catch {
        router.push("/explore");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDesign();
  }, [id, token, router]);

  const handleFavorite = async () => {
    if (!isAuthenticated || !token) {
      showError("Sign in required", "Please log in to save favorites");
      return;
    }
    if (!design) return;
    setFavLoading(true);
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
      setFavLoading(false);
    }
  };

  const handleAddToCollection = async (collectionId: number) => {
    if (!token || !design) return;
    setAddingToCollection(collectionId);
    try {
      await collectionService.addItem(token, collectionId, design.id);
      success("Added to collection! 📁");
      setCollectionModal(false);
    } catch (err: unknown) {
      showError("Error", err instanceof Error ? err.message : "Failed to add to collection");
    } finally {
      setAddingToCollection(null);
    }
  };

  const handleCompare = (slot: 0 | 1) => {
    if (!design) return;
    setCompareDesign(slot, design);
    info("Added to comparison", "Go to Compare page to see side-by-side view");
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] pt-16"><DesignDetailSkeleton /></div>;
  if (!design) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={18} /> Back to explore
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden"
              style={{ aspectRatio: "16/10" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={design.images[activeImg]}
                  alt={design.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {/* Navigation Arrows */}
              {design.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((prev) => Math.max(0, prev - 1))}
                    disabled={activeImg === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImg((prev) => Math.min(design.images.length - 1, prev + 1))}
                    disabled={activeImg === design.images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors disabled:opacity-30"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-sm text-white text-xs border border-white/10">
                  {design.style}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-sm text-white text-xs border border-white/10">
                  {design.roomType}
                </span>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {design.images.length > 1 && (
              <div className="flex gap-3">
                {design.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden transition-all ${
                      i === activeImg ? "ring-2 ring-primary-400 opacity-100" : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Designer Notes */}
            {design.designerNotes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span> Designer Notes
                </h3>
                <p className="text-white/60 leading-relaxed">{design.designerNotes}</p>
                {design.designerName && (
                  <p className="text-primary-400 text-sm mt-3 font-medium">— {design.designerName}</p>
                )}
              </motion.div>
            )}

            {/* Furniture & Materials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<Sofa size={18} />} title="Furniture" items={design.furniture} color="primary" />
              <InfoCard icon={<Layers size={18} />} title="Materials" items={design.materials} color="accent" />
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-4">
            {/* Title & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h1 className="text-2xl font-bold text-white mb-2">{design.title}</h1>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{design.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-white/40 mb-5">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span>{Number(design.rating ?? 0).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={13} />
                  <span>{(design.viewCount ?? 0).toLocaleString()} views</span>
                </div>
                <span>{formatDate(design.createdAt)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                    favorited
                      ? "bg-red-500/20 border border-red-500/30 text-red-400"
                      : "bg-white/10 border border-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <Heart size={15} className={favorited ? "fill-red-400" : ""} />
                  {favorited ? "Saved" : "Save"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCollectionModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all"
                >
                  <Plus size={15} /> Add to Board
                </motion.button>
              </div>

              <div className="flex gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleCompare(0)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-accent-500/20 border border-accent-500/30 text-accent-400 hover:bg-accent-500/30 transition-all"
                >
                  <GitCompare size={13} /> Compare A
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleCompare(1)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-primary-500/20 border border-primary-500/30 text-primary-400 hover:bg-primary-500/30 transition-all"
                >
                  <GitCompare size={13} /> Compare B
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    info("Link copied!", "Share this design with friends");
                  }}
                  className="w-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white/60 hover:text-white hover:bg-white/15 transition-all"
                >
                  <Share2 size={14} />
                </motion.button>
              </div>
            </motion.div>

            {/* Budget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                <DollarSign size={15} /> Estimated Budget
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(Number(design.estimatedBudget ?? 0))}
              </p>
              <span className="inline-block px-2 py-0.5 rounded-lg bg-primary-500/20 text-primary-400 text-xs mt-1">
                {design.budgetCategory}
              </span>
            </motion.div>

            {/* Color Palette */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                <Palette size={15} /> Color Palette
              </div>
              <div className="flex gap-2 flex-wrap">
                {design.colorPalette.map((color, i) => (
                  <div key={i} className="group relative">
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-white/10 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tags */}
            {design.tags && design.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10"
              >
                <p className="text-white/60 text-sm mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-xl bg-white/8 text-white/50 text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Collection Modal */}
      <Modal
        isOpen={collectionModal}
        onClose={() => setCollectionModal(false)}
        title="Add to Collection"
        size="sm"
      >
        <div className="p-6">
          {!isAuthenticated ? (
            <p className="text-white/60 text-center py-4">Please log in to add to collections</p>
          ) : collections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/60 mb-4">No collections yet</p>
              <button
                onClick={() => { setCollectionModal(false); router.push("/collections"); }}
                className="px-6 py-2.5 rounded-xl bg-primary-500/30 text-primary-300 text-sm"
              >
                Create a collection
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {(collections as Collection[]).map((col) => (
                <motion.button
                  key={col.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleAddToCollection(col.id)}
                  disabled={addingToCollection === col.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/8 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                    {col.coverImage ? (
                      <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{col.name}</p>
                    <p className="text-white/40 text-xs">{col.itemCount ?? 0} items</p>
                  </div>
                  {addingToCollection === col.id ? (
                    <div className="w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
                  ) : (
                    <Plus size={16} className="text-white/30" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  items,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: "primary" | "accent";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className={`flex items-center gap-2 text-${color}-400 text-sm mb-3`}>
        {icon} {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
            <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
