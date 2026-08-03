"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw, DollarSign, Palette, Home, Wand2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { aiService } from "@/services/api";
import { AiResultSkeleton } from "@/components/ui/SkeletonLoader";
import { NoAiRecommendations } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { DESIGN_STYLES, ROOM_TYPES, BUDGET_CATEGORIES } from "@/lib/seed-data";
import type { Design } from "@/store/useStore";

const COLOR_OPTIONS = [
  { label: "Warm Whites", value: "#F5F0EB" },
  { label: "Sage Green", value: "#8FBC8F" },
  { label: "Navy Blue", value: "#1E3A5F" },
  { label: "Terracotta", value: "#C0704A" },
  { label: "Charcoal", value: "#374151" },
  { label: "Blush Pink", value: "#F4A7B9" },
  { label: "Warm Gold", value: "#D4AF37" },
  { label: "Stone Gray", value: "#9E9689" },
];

interface AiResult {
  title: string;
  description: string;
  style: string;
  roomType: string;
  colorPalette: string[];
  furniture: string[];
  materials: string[];
  designerNotes: string;
  estimatedBudget: number;
  budgetCategory: string;
  keyFeatures: string[];
  moodKeywords: string[];
  images: string[];
}

export default function AiGeneratorPage() {
  const router = useRouter();
  const { isAuthenticated, token, aiRecommendations, setAiRecommendations, addAiRecommendation, setCurrentAiResult } = useStore();
  const { success, error: showError } = useToast();

  const [form, setForm] = useState({
    prompt: "",
    style: "",
    roomType: "",
    colors: [] as string[],
    budget: "",
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ recommendation: AiResult; relatedDesigns: Design[]; recommendationId: number } | null>(null);
  const [history, setHistory] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!token) return;
    aiService.getHistory(token).then((res) => {
      setAiRecommendations(res.data as Parameters<typeof setAiRecommendations>[0]);
    }).catch(() => {});
  }, [isAuthenticated, token, router, setAiRecommendations]);

  const toggleColor = (color: string) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter((c) => c !== color) : [...f.colors, color],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.prompt.trim()) {
      showError("Describe your space", "Please tell us about your room");
      return;
    }
    setGenerating(true);
    setResult(null);
    try {
      const res = await aiService.generate(token, form);
      const data = res.data as { recommendation: AiResult; relatedDesigns: Design[]; recommendationId: number };
      setResult(data);
      setCurrentAiResult(data.recommendation as unknown as Record<string, unknown>);
      addAiRecommendation({
        id: data.recommendationId,
        userId: 0,
        prompt: form.prompt,
        style: form.style || null,
        roomType: form.roomType || null,
        colors: form.colors,
        budget: form.budget || null,
        result: data.recommendation as unknown as Record<string, unknown>,
        createdAt: new Date().toISOString(),
      });
      success("Design generated! ✨", "Your AI inspiration is ready");
    } catch (err: unknown) {
      showError("Generation failed", err instanceof Error ? err.message : "Please try again");
    } finally {
      setGenerating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 text-white">
      {/* Header */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-sm mb-4">
              <Sparkles size={14} /> AI-Powered Design Studio
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Generate Your{" "}
              <span className="text-gradient">Dream Design</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Describe your vision and let AI create a personalized interior design recommendation with furniture, materials, and budget.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleGenerate}
              className="space-y-6"
            >
              {/* Prompt */}
              <div>
                <label className="text-white font-medium mb-2 flex items-center gap-2">
                  <Wand2 size={16} className="text-accent-400" />
                  Describe Your Space *
                </label>
                <textarea
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  placeholder="e.g. A cozy bedroom with natural light, warm tones, and a peaceful reading corner for a young professional..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-white/20 outline-none focus:border-accent-400/50 transition-all resize-none"
                />
              </div>

              {/* Style */}
              <div>
                <label className="text-white/60 text-sm mb-3 flex items-center gap-2">
                  <Home size={14} /> Interior Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {DESIGN_STYLES.map((style) => (
                    <motion.button
                      key={style}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm({ ...form, style: form.style === style ? "" : style })}
                      className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                        form.style === style
                          ? "bg-accent-500/30 border-accent-400/50 text-accent-300"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {style}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="text-white/60 text-sm mb-3 flex items-center gap-2">
                  <Home size={14} /> Room Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ROOM_TYPES.map((room) => (
                    <motion.button
                      key={room}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm({ ...form, roomType: form.roomType === room ? "" : room })}
                      className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                        form.roomType === room
                          ? "bg-primary-500/30 border-primary-400/50 text-primary-300"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {room}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="text-white/60 text-sm mb-3 flex items-center gap-2">
                  <Palette size={14} /> Color Preferences (select multiple)
                </label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_OPTIONS.map(({ label, value }) => (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleColor(value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                        form.colors.includes(value)
                          ? "border-white/30 text-white"
                          : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${form.colors.includes(value) ? "border-white" : "border-white/30"}`}
                        style={{ backgroundColor: value }}
                      />
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="text-white/60 text-sm mb-3 flex items-center gap-2">
                  <DollarSign size={14} /> Budget Range
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BUDGET_CATEGORIES.map((budget) => (
                    <motion.button
                      key={budget}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm({ ...form, budget: form.budget === budget ? "" : budget })}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        form.budget === budget
                          ? "bg-primary-500/30 border-primary-400/50 text-primary-300"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {budget}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  disabled={generating}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(139,92,246,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-accent-500 to-primary-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 shadow-xl"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> Generate Design <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setForm({ prompt: "", style: "", roomType: "", colors: [], budget: "" })}
                  className="px-4 py-4 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </motion.form>

            {/* History Toggle */}
            {aiRecommendations.length > 0 && (
              <button
                onClick={() => setHistory(!history)}
                className="mt-6 text-white/40 text-sm hover:text-white transition-colors flex items-center gap-2"
              >
                {history ? "Hide" : "Show"} generation history ({aiRecommendations.length})
              </button>
            )}

            <AnimatePresence>
              {history && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2 overflow-hidden"
                >
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/70 text-xs font-medium">{rec.style} · {rec.roomType} · {rec.budget}</p>
                      <p className="text-white/40 text-xs mt-1 line-clamp-2">{rec.prompt}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result */}
          <div>
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-accent-500/20 border border-accent-500/30 flex items-center justify-center mx-auto mb-3 animate-pulse">
                        <Sparkles size={28} className="text-accent-400" />
                      </div>
                      <p className="text-white font-semibold">AI is designing your space...</p>
                      <p className="text-white/40 text-sm mt-1">Analyzing style, materials & budget</p>
                    </div>
                    <AiResultSkeleton />
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <AiResultCard result={result.recommendation} relatedDesigns={result.relatedDesigns} />
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 border-dashed">
                    <NoAiRecommendations />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiResultCard({ result, relatedDesigns }: { result: AiResult; relatedDesigns: Design[] }) {
  return (
    <div className="space-y-4">
      {/* Preview Images */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {result.images.map((img, i) => (
          <div key={i} className="relative" style={{ aspectRatio: "4/3" }}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Main Info */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-white font-bold text-lg">{result.title}</h3>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-lg bg-accent-500/20 text-accent-300 text-xs">{result.style}</span>
              <span className="px-2 py-0.5 rounded-lg bg-primary-500/20 text-primary-300 text-xs">{result.roomType}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{formatCurrency(result.estimatedBudget)}</p>
            <p className="text-white/40 text-xs">{result.budgetCategory}</p>
          </div>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{result.description}</p>
      </div>

      {/* Colors */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-white/60 text-xs mb-3">Suggested Color Palette</p>
        <div className="flex gap-2">
          {result.colorPalette.map((color, i) => (
            <div key={i} className="flex-1 h-10 rounded-xl border-2 border-white/10" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </div>

      {/* Furniture & Materials */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-primary-400 text-xs font-medium mb-2">🛋️ Furniture</p>
          <ul className="space-y-1">
            {result.furniture.slice(0, 4).map((item, i) => (
              <li key={i} className="text-white/60 text-xs flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-primary-400" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-accent-400 text-xs font-medium mb-2">🪨 Materials</p>
          <ul className="space-y-1">
            {result.materials.slice(0, 4).map((item, i) => (
              <li key={i} className="text-white/60 text-xs flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-accent-400" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Features */}
      <div className="p-4 rounded-2xl bg-accent-500/10 border border-accent-500/20">
        <p className="text-accent-300 text-xs font-medium mb-2">✨ Key Features</p>
        <div className="flex flex-wrap gap-2">
          {result.keyFeatures.map((feature, i) => (
            <span key={i} className="px-2 py-1 rounded-lg bg-white/8 text-white/60 text-xs">{feature}</span>
          ))}
        </div>
      </div>

      {/* Designer Notes */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-white/60 text-xs font-medium mb-2">💡 Design Notes</p>
        <p className="text-white/50 text-xs leading-relaxed">{result.designerNotes}</p>
      </div>

      {/* Related Designs */}
      {relatedDesigns.length > 0 && (
        <div>
          <p className="text-white/60 text-sm mb-3">Related Designs to Explore</p>
          <div className="grid grid-cols-2 gap-3">
            {relatedDesigns.slice(0, 2).map((d) => (
              <a key={d.id} href={`/explore/${d.id}`} className="group">
                <div className="rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                  <div className="h-24 overflow-hidden">
                    <img src={d.images[0]} alt={d.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs font-medium truncate">{d.title}</p>
                    <p className="text-white/30 text-xs">{d.style}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
