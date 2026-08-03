"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="text-8xl mb-6"
        >
          🏠
        </motion.div>
        <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-3">Page Not Found</h2>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">
          The design you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to exploring beautiful spaces.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium"
            >
              <Home size={16} /> Go Home
            </motion.button>
          </Link>
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-medium hover:bg-white/15 transition-colors"
            >
              <ArrowLeft size={16} /> Explore Designs
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
