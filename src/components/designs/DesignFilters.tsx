"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { DESIGN_STYLES, ROOM_TYPES, BUDGET_CATEGORIES } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

export function DesignFilters() {
  const { filters, setFilters, resetFilters } = useStore();

  const hasActiveFilters =
    filters.style || filters.roomType || filters.budgetCategory || filters.colorPalette;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {[filters.style, filters.roomType, filters.budgetCategory].filter(Boolean).length}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Style Filter */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Style</p>
        <div className="flex flex-wrap gap-2">
          {DESIGN_STYLES.map((style) => (
            <FilterChip
              key={style}
              label={style}
              active={filters.style === style}
              onClick={() =>
                setFilters({ style: filters.style === style ? "" : style })
              }
            />
          ))}
        </div>
      </div>

      {/* Room Type Filter */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Room Type</p>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((room) => (
            <FilterChip
              key={room}
              label={room}
              active={filters.roomType === room}
              onClick={() =>
                setFilters({ roomType: filters.roomType === room ? "" : room })
              }
            />
          ))}
        </div>
      </div>

      {/* Budget Filter */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Budget</p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_CATEGORIES.map((budget) => (
            <FilterChip
              key={budget}
              label={budget}
              active={filters.budgetCategory === budget}
              onClick={() =>
                setFilters({
                  budgetCategory: filters.budgetCategory === budget ? "" : budget,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Sort By</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "newest", label: "Newest" },
            { value: "popular", label: "Most Popular" },
            { value: "rated", label: "Highest Rated" },
          ].map(({ value, label }) => (
            <FilterChip
              key={value}
              label={label}
              active={filters.sortBy === value}
              onClick={() => setFilters({ sortBy: value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border",
        active
          ? "bg-primary-500/30 border-primary-400/50 text-primary-300"
          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20"
      )}
    >
      {label}
    </motion.button>
  );
}
