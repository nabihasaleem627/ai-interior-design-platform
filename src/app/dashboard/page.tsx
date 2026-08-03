"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass, Heart, FolderOpen, Sparkles, TrendingUp,
  Clock, ArrowRight, Bell, Check
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { dashboardService, collectionService, aiService, favoriteService } from "@/services/api";
import { DesignCard } from "@/components/designs/DesignCard";
import { DesignGridSkeleton } from "@/components/ui/SkeletonLoader";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import type { Design, Collection, AiRecommendation, Notification } from "@/store/useStore";

export default function DashboardPage() {
  const router = useRouter();
  const {
    user, isAuthenticated, token,
    favorites, setFavorites,
    collections, setCollections,
    notifications, setNotifications, markAsRead,
    aiRecommendations, setAiRecommendations,
    recentlyViewed, setRecentlyViewed,
  } = useStore();
  const { success } = useToast();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!token) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [favRes, colRes, aiRes, recentRes, notifRes] = await Promise.allSettled([
          favoriteService.getAll(token),
          collectionService.getAll(token),
          aiService.getHistory(token),
          dashboardService.getRecentlyViewed(token),
          dashboardService.getNotifications(token),
        ]);

        if (favRes.status === "fulfilled") setFavorites(favRes.value.data as Design[]);
        if (colRes.status === "fulfilled") setCollections(colRes.value.data as Collection[]);
        if (aiRes.status === "fulfilled") setAiRecommendations(aiRes.value.data as AiRecommendation[]);
        if (recentRes.status === "fulfilled") setRecentlyViewed(recentRes.value.data as Design[]);
        if (notifRes.status === "fulfilled") setNotifications(notifRes.value.data as Notification[]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, token, router, setFavorites, setCollections, setAiRecommendations, setRecentlyViewed, setNotifications]);

  const handleMarkAllRead = async () => {
    if (!token) return;
    await dashboardService.markNotificationsRead(token);
    markAsRead();
    success("All notifications marked as read");
  };

  if (!isAuthenticated) return null;

  const firstName = user?.name?.split(" ")[0] || "Designer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 text-white">
      {/* Header */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white/40 text-sm mb-1">{greeting},</p>
            <h1 className="text-4xl font-bold text-white mb-2">
              {firstName} <span className="text-gradient">✨</span>
            </h1>
            <p className="text-white/40">
              {favorites.length} saved designs · {collections.length} collections · {aiRecommendations.length} AI inspirations
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Heart, label: "Favorites", value: favorites.length, href: "/favorites", color: "text-red-400" },
            { icon: FolderOpen, label: "Collections", value: collections.length, href: "/collections", color: "text-blue-400" },
            { icon: Sparkles, label: "AI Designs", value: aiRecommendations.length, href: "/ai-generator", color: "text-accent-400" },
            { icon: Clock, label: "Recently Viewed", value: recentlyViewed.length, href: "/explore", color: "text-primary-400" },
          ].map(({ icon: Icon, label, value, href, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={href}>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                  <Icon size={22} className={`${color} mb-3`} />
                  <p className="text-3xl font-bold text-white mb-0.5">{value}</p>
                  <p className="text-white/40 text-sm">{label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <Section title="Recently Viewed" icon={<Clock size={18} />} href="/explore">
                {loading ? (
                  <DesignGridSkeleton count={4} />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {recentlyViewed.slice(0, 4).map((d, i) => (
                      <DesignCard key={d.id} design={d} index={i} />
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* Favorites */}
            {favorites.length > 0 && (
              <Section title="Your Favorites" icon={<Heart size={18} />} href="/favorites">
                <div className="grid grid-cols-2 gap-4">
                  {favorites.slice(0, 4).map((d, i) => (
                    <DesignCard key={d.id} design={d} index={i} />
                  ))}
                </div>
              </Section>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "🎨", title: "Explore Designs", desc: "Browse our curated gallery", href: "/explore" },
                { icon: "✨", title: "AI Generator", desc: "Get personalized recommendations", href: "/ai-generator" },
                { icon: "⚖️", title: "Compare Designs", desc: "Compare two design concepts", href: "/compare" },
              ].map(({ icon, title, desc, href }) => (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-3">{icon}</div>
                    <p className="text-white font-medium text-sm">{title}</p>
                    <p className="text-white/40 text-xs mt-1">{desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Bell size={16} className="text-primary-400" />
                  Notifications
                </div>
                {notifications.some((n) => !n.isRead) && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">No notifications</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl text-xs transition-colors ${
                        n.isRead ? "bg-white/3 text-white/40" : "bg-primary-500/10 border border-primary-500/20 text-white/70"
                      }`}
                    >
                      <p className="font-medium mb-0.5">{n.title}</p>
                      <p className="opacity-70">{n.message}</p>
                      <p className="opacity-40 mt-1">{formatDate(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Collections */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <FolderOpen size={16} className="text-blue-400" />
                  Collections
                </div>
                <Link href="/collections" className="text-xs text-white/40 hover:text-white transition-colors">
                  View all →
                </Link>
              </div>
              {collections.length === 0 ? (
                <Link href="/collections">
                  <div className="text-center py-4 border border-dashed border-white/10 rounded-xl text-white/30 text-sm hover:border-white/20 transition-colors">
                    + Create your first collection
                  </div>
                </Link>
              ) : (
                <div className="space-y-2">
                  {(collections as Collection[]).slice(0, 4).map((col) => (
                    <Link key={col.id} href={`/collections`}>
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                          {col.coverImage ? (
                            <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">📁</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{col.name}</p>
                          <p className="text-white/30 text-xs">{col.itemCount ?? 0} items</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* AI History */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Sparkles size={16} className="text-accent-400" />
                  AI Inspirations
                </div>
                <Link href="/ai-generator" className="text-xs text-white/40 hover:text-white transition-colors">
                  Generate →
                </Link>
              </div>
              {aiRecommendations.length === 0 ? (
                <Link href="/ai-generator">
                  <div className="text-center py-4 border border-dashed border-white/10 rounded-xl text-white/30 text-sm hover:border-white/20 transition-colors">
                    ✨ Generate your first AI design
                  </div>
                </Link>
              ) : (
                <div className="space-y-2">
                  {(aiRecommendations as AiRecommendation[]).slice(0, 3).map((rec) => (
                    <div key={rec.id} className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
                      <p className="text-white/70 text-xs font-medium truncate">{rec.style} · {rec.roomType}</p>
                      <p className="text-white/40 text-xs mt-1 line-clamp-1">{rec.prompt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trending */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white text-sm font-medium mb-4">
                <TrendingUp size={16} className="text-green-400" />
                Trending Styles
              </div>
              <div className="space-y-2">
                {[
                  { style: "Japandi", change: "+28%", color: "text-green-400" },
                  { style: "Biophilic Design", change: "+22%", color: "text-green-400" },
                  { style: "Modern Luxe", change: "+18%", color: "text-green-400" },
                  { style: "Minimalist", change: "+15%", color: "text-green-400" },
                ].map(({ style, change, color }) => (
                  <div key={style} className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">{style}</span>
                    <span className={`text-xs font-medium ${color}`}>{change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="text-primary-400">{icon}</span>
          {title}
        </div>
        <Link href={href} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
          View all <ArrowRight size={12} />
        </Link>
      </div>
      {children}
    </section>
  );
}
