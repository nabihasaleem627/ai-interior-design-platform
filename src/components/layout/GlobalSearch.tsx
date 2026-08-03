"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { designService } from "@/services/api";
import { useRouter } from "next/navigation";
import type { Design } from "@/store/useStore";

export function GlobalSearch() {
  const { isSearchOpen, setIsSearchOpen, token } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await designService.getAll({ search: query, limit: 5 }, token);
        setResults(res.data.designs as Design[]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, token]);

  const handleSelect = (design: Design) => {
    setIsSearchOpen(false);
    router.push(`/explore/${design.id}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setIsSearchOpen(false);
      router.push(`/explore?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#1a1a2e] border border-white/20 shadow-2xl">
              <Search size={20} className="text-white/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search designs, styles, rooms..."
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-white/40 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/30 text-primary-300 text-sm hover:bg-primary-500/50 transition-colors"
              >
                Search <ArrowRight size={14} />
              </button>
            </div>

            {/* Results */}
            <AnimatePresence>
              {(results.length > 0 || loading) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 rounded-2xl bg-[#1a1a2e] border border-white/10 shadow-2xl overflow-hidden"
                >
                  {loading ? (
                    <div className="p-6 text-center text-white/40 text-sm">
                      Searching...
                    </div>
                  ) : (
                    results.map((design) => (
                      <button
                        key={design.id}
                        onClick={() => handleSelect(design)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={design.images[0]}
                            alt={design.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{design.title}</p>
                          <p className="text-white/40 text-xs">{design.style} · {design.roomType}</p>
                        </div>
                        <ArrowRight size={14} className="text-white/20 flex-shrink-0" />
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
