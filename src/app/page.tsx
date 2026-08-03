"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Star, Users, Palette, Layers } from "lucide-react";
import { useStore } from "@/store/useStore";

const heroImages = [
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
];

const stats = [
  { icon: Palette, label: "Design Styles", value: "8+" },
  { icon: Layers, label: "Curated Designs", value: "500+" },
  { icon: Star, label: "Avg. Rating", value: "4.8" },
  { icon: Users, label: "Happy Users", value: "12K+" },
];

const features = [
  {
    icon: "🎨",
    title: "Curated Design Gallery",
    description: "Browse thousands of professional interior designs filtered by style, room type, and budget.",
  },
  {
    icon: "✨",
    title: "AI Inspiration Generator",
    description: "Describe your dream space and let AI create personalized design recommendations just for you.",
  },
  {
    icon: "📁",
    title: "Smart Collections",
    description: "Organize your favorite designs into custom inspiration boards for every room in your home.",
  },
  {
    icon: "⚖️",
    title: "Side-by-Side Comparison",
    description: "Compare two design concepts to make informed decisions about colors, materials, and budget.",
  },
];

export default function HomePage() {
  const { isAuthenticated } = useStore();
  const [currentImg, setCurrentImg] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentImg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{ y }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentImg]}
                alt="Interior design"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>

        {/* Content */}
        <motion.div
          style={{ opacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6"
            >
              <Sparkles size={14} className="text-primary-400" />
              AI-Powered Interior Design Inspiration
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Design Your{" "}
              <span className="text-gradient">Dream</span>
              <br />
              <span style={{ fontFamily: "Playfair Display, serif" }} className="italic">
                Interior Space
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed"
            >
              Discover thousands of curated interior designs. Get AI-powered
              recommendations, save your favorites, and create stunning inspiration
              boards for your perfect home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/explore">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(200,132,30,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-base shadow-xl"
                >
                  Explore Designs <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href={isAuthenticated ? "/ai-generator" : "/register"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/15 transition-colors"
                >
                  <Sparkles size={18} className="text-accent-400" />
                  Try AI Generator
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImg(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentImg ? "w-8 h-2 bg-primary-400" : "w-2 h-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="relative py-16 border-y border-white/5">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{value}</p>
                <p className="text-white/40 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything you need to design
              <br />
              <span className="text-gradient">your perfect space</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              From AI-powered inspiration to curated collections — we have all
              the tools to bring your vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-white/50 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Preview Gallery ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Trending Designs
            </h2>
            <p className="text-white/40">
              Hand-picked designs from our curated collection
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70", label: "Living Room" },
              { img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=70", label: "Bedroom" },
              { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70", label: "Kitchen" },
              { img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=70", label: "Bathroom" },
            ].map(({ img, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{ aspectRatio: i % 2 === 0 ? "3/4" : "4/3" }}
              >
                <img src={img} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-semibold">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-colors"
              >
                View All Designs <ArrowRight size={16} className="inline ml-2" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 rounded-3xl relative overflow-hidden border border-white/10"
              style={{
                background: "linear-gradient(135deg, rgba(200,132,30,0.15) 0%, rgba(139,92,246,0.15) 100%)",
              }}
            >
              <div className="absolute inset-0 gradient-mesh opacity-20" />
              <div className="relative">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Start Designing Your Dream Home
                </h2>
                <p className="text-white/60 mb-8 text-lg">
                  Join thousands of homeowners and designers who use Interior AI to
                  find their perfect aesthetic.
                </p>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(200,132,30,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg shadow-xl"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-white/20 text-sm">
          © 2024 Interior AI — Design Inspiration Platform. Crafted with ✨
        </p>
      </footer>
    </div>
  );
}
