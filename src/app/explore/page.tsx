"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { designService } from "@/services/api";
import { DesignCard } from "@/components/designs/DesignCard";
import { DesignFilters } from "@/components/designs/DesignFilters";
import { DesignGridSkeleton } from "@/components/ui/SkeletonLoader";
import { NoDesignsFound, NoSearchResults } from "@/components/ui/EmptyState";
import { useSearchParams, useRouter } from "next/navigation";
import type { Design } from "@/store/useStore";

function ExploreContent() {
  const { filters, setFilters, token, setDesigns: storeSetDesigns } = useStore();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync search from URL
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) setFilters({ search });
  }, [searchParams, setFilters]);

  const fetchDesigns = useCallback(async (reset = true) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await designService.getAll(
        {
          ...filters,
          page: currentPage,
          limit: 12,
        },
        token
      );
      const { designs: newDesigns, pagination } = res.data as {
        designs: Design[];
        pagination: { total: number; totalPages: number; page: number };
      };

      if (reset) {
        setDesigns(newDesigns);
        storeSetDesigns(newDesigns);
        setPage(1);
      } else {
        setDesigns((prev) => [...prev, ...newDesigns]);
        setPage(currentPage + 1);
      }
      setTotal(pagination.total);
      setHasMore(currentPage < pagination.totalPages);
    } catch {
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page, token, storeSetDesigns]);

  useEffect(() => {
    fetchDesigns(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
    if (e.target.value) {
      router.push(`/explore?search=${encodeURIComponent(e.target.value)}`, { scroll: false });
    }
  };

  const hasActiveFilters = filters.style || filters.roomType || filters.budgetCategory || filters.search;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16">
      {/* Header */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Explore <span className="text-gradient">Designs</span>
            </h1>
            <p className="text-white/40 text-lg">
              {total > 0 ? `${total} designs to inspire your space` : "Discover beautiful interior spaces"}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-xl">
              <Search size={20} className="text-white/40 flex-shrink-0 ml-1" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchInput}
                placeholder="Search by room, style, color..."
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ search: "" })}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filtersOpen || hasActiveFilters
                    ? "bg-primary-500/30 text-primary-300 border border-primary-400/30"
                    : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters
                {hasActiveFilters && (
                  <span className="w-4 h-4 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <DesignFilters />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <FilterTag label={`"${filters.search}"`} onRemove={() => setFilters({ search: "" })} />
            )}
            {filters.style && (
              <FilterTag label={filters.style} onRemove={() => setFilters({ style: "" })} />
            )}
            {filters.roomType && (
              <FilterTag label={filters.roomType} onRemove={() => setFilters({ roomType: "" })} />
            )}
            {filters.budgetCategory && (
              <FilterTag label={filters.budgetCategory} onRemove={() => setFilters({ budgetCategory: "" })} />
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading && designs.length === 0 ? (
          <DesignGridSkeleton count={12} />
        ) : designs.length === 0 ? (
          filters.search ? (
            <NoSearchResults onReset={() => setFilters({ search: "", style: "", roomType: "", budgetCategory: "" })} />
          ) : (
            <NoDesignsFound onReset={() => setFilters({ style: "", roomType: "", budgetCategory: "" })} />
          )
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {designs.map((design, i) => (
                <DesignCard key={design.id} design={design} index={i} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchDesigns(false)}
                  disabled={loading}
                  className="px-10 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More Designs"}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/20 border border-primary-400/30 text-primary-300 text-sm">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X size={12} />
      </button>
    </span>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] pt-16"><DesignGridSkeleton /></div>}>
      <ExploreContent />
    </Suspense>
  );
}
