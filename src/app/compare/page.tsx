"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, Plus, DollarSign, Star, Eye, Palette, Sofa, Layers } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/utils";

export default function ComparePage() {
  const router = useRouter();
  const { compareDesigns, setCompareDesign, designs: storeDesigns } = useStore();
  const [slotA, slotB] = compareDesigns;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 text-white">
      {/* Header */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <GitCompare size={28} className="text-accent-400" />
              <h1 className="text-4xl font-bold text-white">Design Comparison</h1>
            </div>
            <p className="text-white/40">
              Compare two design concepts side by side to make the perfect choice
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tip */}
        {(!slotA || !slotB) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-center"
          >
            <p className="text-accent-300 text-sm">
              💡 Go to any design page and click{" "}
              <strong>Compare A</strong> or <strong>Compare B</strong> to add designs here.
              Or use &quot;Pick from gallery&quot; below.
            </p>
          </motion.div>
        )}

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[slotA, slotB].map((design, slotIndex) => (
            <motion.div
              key={slotIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: slotIndex * 0.1 }}
            >
              {design ? (
                <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative">
                  {/* Slot label */}
                  <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${
                    slotIndex === 0 ? "bg-primary-500 text-white" : "bg-accent-500 text-white"
                  }`}>
                    Design {slotIndex === 0 ? "A" : "B"}
                  </div>
                  <button
                    onClick={() => setCompareDesign(slotIndex as 0 | 1, null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  {/* Image */}
                  <div className="h-64 overflow-hidden">
                    <img src={design.images[0]} alt={design.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-1">{design.title}</h3>
                    <p className="text-white/50 text-sm line-clamp-2 mb-4">{design.description}</p>
                    <Link href={`/explore/${design.id}`} className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
                      View full design →
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-3xl border-2 border-dashed border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  style={{ minHeight: "400px" }}
                >
                  <div className="h-full flex flex-col items-center justify-center p-8 gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${slotIndex === 0 ? "bg-primary-500/20" : "bg-accent-500/20"} flex items-center justify-center`}>
                      <Plus size={28} className={slotIndex === 0 ? "text-primary-400" : "text-accent-400"} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium mb-1">Design {slotIndex === 0 ? "A" : "B"}</p>
                      <p className="text-white/30 text-sm">Click Compare {slotIndex === 0 ? "A" : "B"} on any design page</p>
                    </div>
                    <Link href="/explore">
                      <button className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white/70 text-sm hover:bg-white/15 transition-colors">
                        Browse Designs
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Side-by-side comparison */}
        <AnimatePresence>
          {slotA && slotB && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-white text-center mb-6">Detailed Comparison</h2>

              {/* Budget */}
              <CompareRow
                title="Estimated Budget"
                icon={<DollarSign size={16} />}
                valueA={formatCurrency(Number(slotA.estimatedBudget ?? 0))}
                valueB={formatCurrency(Number(slotB.estimatedBudget ?? 0))}
                subA={slotA.budgetCategory}
                subB={slotB.budgetCategory}
              />

              {/* Rating */}
              <CompareRow
                title="Rating"
                icon={<Star size={16} />}
                valueA={`${Number(slotA.rating ?? 0).toFixed(1)} ★`}
                valueB={`${Number(slotB.rating ?? 0).toFixed(1)} ★`}
                highlight
              />

              {/* Views */}
              <CompareRow
                title="Popularity"
                icon={<Eye size={16} />}
                valueA={`${(slotA.viewCount ?? 0).toLocaleString()} views`}
                valueB={`${(slotB.viewCount ?? 0).toLocaleString()} views`}
              />

              {/* Colors */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                  <Palette size={16} /> Color Palette Comparison
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[slotA, slotB].map((design, i) => (
                    <div key={i}>
                      <p className={`text-xs font-medium mb-2 ${i === 0 ? "text-primary-400" : "text-accent-400"}`}>
                        Design {i === 0 ? "A" : "B"}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {design.colorPalette.map((color, j) => (
                          <div key={j} className="relative group">
                            <div
                              className="w-8 h-8 rounded-lg border-2 border-white/10 cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                            />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-black text-white text-[10px] opacity-0 group-hover:opacity-100 whitespace-nowrap">
                              {color}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Furniture */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                  <Sofa size={16} /> Furniture Comparison
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[slotA, slotB].map((design, i) => (
                    <div key={i}>
                      <p className={`text-xs font-medium mb-2 ${i === 0 ? "text-primary-400" : "text-accent-400"}`}>
                        Design {i === 0 ? "A" : "B"}
                      </p>
                      <ul className="space-y-1">
                        {design.furniture.map((item, j) => (
                          <li key={j} className="text-white/60 text-xs flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary-400" : "bg-accent-400"}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                  <Layers size={16} /> Materials Comparison
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[slotA, slotB].map((design, i) => (
                    <div key={i}>
                      <p className={`text-xs font-medium mb-2 ${i === 0 ? "text-primary-400" : "text-accent-400"}`}>
                        Design {i === 0 ? "A" : "B"}
                      </p>
                      <ul className="space-y-1">
                        {design.materials.map((item, j) => (
                          <li key={j} className="text-white/60 text-xs flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary-400" : "bg-accent-400"}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick pick from gallery */}
        {storeDesigns.length > 0 && (
          <div className="mt-12">
            <h3 className="text-white/60 text-sm font-medium mb-4">Quick Pick from Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {storeDesigns.slice(0, 6).map((design) => (
                <div key={design.id} className="group">
                  <div className="rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                    <div className="h-24 overflow-hidden">
                      <img src={design.images[0]} alt={design.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-2">
                      <p className="text-white/70 text-[10px] truncate">{design.title}</p>
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => setCompareDesign(0, design)}
                          className="flex-1 py-1 rounded bg-primary-500/30 text-primary-400 text-[10px] hover:bg-primary-500/50 transition-colors"
                        >
                          A
                        </button>
                        <button
                          onClick={() => setCompareDesign(1, design)}
                          className="flex-1 py-1 rounded bg-accent-500/30 text-accent-400 text-[10px] hover:bg-accent-500/50 transition-colors"
                        >
                          B
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CompareRow({
  title,
  icon,
  valueA,
  valueB,
  subA,
  subB,
  highlight = false,
}: {
  title: string;
  icon: React.ReactNode;
  valueA: string;
  valueB: string;
  subA?: string;
  subB?: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
        {icon} {title}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-xl ${highlight ? "bg-primary-500/10 border border-primary-500/20" : "bg-white/5"}`}>
          <p className="text-xs text-primary-400 font-medium mb-1">Design A</p>
          <p className="text-white font-bold">{valueA}</p>
          {subA && <p className="text-white/40 text-xs mt-0.5">{subA}</p>}
        </div>
        <div className={`p-3 rounded-xl ${highlight ? "bg-accent-500/10 border border-accent-500/20" : "bg-white/5"}`}>
          <p className="text-xs text-accent-400 font-medium mb-1">Design B</p>
          <p className="text-white font-bold">{valueB}</p>
          {subB && <p className="text-white/40 text-xs mt-0.5">{subB}</p>}
        </div>
      </div>
    </div>
  );
}
