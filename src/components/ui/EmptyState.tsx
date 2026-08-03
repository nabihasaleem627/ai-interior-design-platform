"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-6",
        className
      )}
    >
      {/* Illustration Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
        className="relative mb-8"
      >
        {/* Glow background */}
        <div className="absolute inset-0 blur-3xl bg-primary-400/20 rounded-full scale-150" />
        <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-400/20 to-accent-500/20 border border-white/10 flex items-center justify-center">
          <div className="text-5xl opacity-80">{icon}</div>
        </div>
      </motion.div>

      {/* Text */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-2xl font-semibold text-white mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-white/50 max-w-sm text-base leading-relaxed mb-8"
      >
        {description}
      </motion.p>

      {/* CTA Button */}
      {action && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-shadow"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

// Pre-built empty states
export function NoDesignsFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No designs found"
      description="We couldn't find any designs matching your filters. Try adjusting your search criteria or explore different styles."
      action={onReset ? { label: "Clear all filters", onClick: onReset } : undefined}
    />
  );
}

export function NoFavorites({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon="❤️"
      title="No favorites yet"
      description="Start exploring beautiful interior designs and save the ones that inspire you. Your favorites will appear here."
      action={onExplore ? { label: "Explore designs", onClick: onExplore } : undefined}
    />
  );
}

export function NoCollections({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon="📁"
      title="No collections yet"
      description="Create your first inspiration board to start organizing designs by room, style, or project. Perfect for planning your dream space."
      action={onCreate ? { label: "Create a collection", onClick: onCreate } : undefined}
    />
  );
}

export function NoAiRecommendations({ onGenerate }: { onGenerate?: () => void }) {
  return (
    <EmptyState
      icon="✨"
      title="No inspirations generated yet"
      description="Use our AI-powered generator to get personalized interior design recommendations based on your style preferences and budget."
      action={onGenerate ? { label: "Generate inspiration", onClick: onGenerate } : undefined}
    />
  );
}

export function NoSearchResults({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon="🏠"
      title="No results found"
      description="Your search didn't return any results. Try different keywords or browse our curated collections."
      action={onReset ? { label: "Browse all designs", onClick: onReset } : undefined}
    />
  );
}
