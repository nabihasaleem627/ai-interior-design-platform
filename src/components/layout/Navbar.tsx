"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Compass, Heart, FolderOpen, Sparkles, GitCompare,
  User, Bell, Sun, Moon, Search, Menu, X, LogOut, ChevronDown
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const navLinks = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/ai-generator", label: "AI Studio", icon: Sparkles },
  { href: "/compare", label: "Compare", icon: GitCompare },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, theme, toggleTheme, logout, unreadCount, isSearchOpen, setIsSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    success("Logged out", "See you next time!");
    router.push("/");
    setUserMenuOpen(false);
  };

  const isDark = theme === "dark";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? isDark
              ? "bg-[#0f0f10]/90 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20"
              : "bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-lg shadow-black/5"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-lg"
              >
                I
              </motion.div>
              <span className={cn(
                "text-lg font-bold hidden sm:block",
                isDark ? "text-white" : scrolled ? "text-slate-900" : "text-white"
              )}>
                <span className="text-gradient">Inter</span>ior
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary-500/20 text-primary-400"
                        : isDark || !scrolled
                          ? "text-white/70 hover:text-white hover:bg-white/10"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-2 rounded-xl transition-colors",
                  isDark || !scrolled
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Search size={18} />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-xl transition-colors",
                  isDark || !scrolled
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Link href="/dashboard" className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        "p-2 rounded-xl transition-colors",
                        isDark || !scrolled
                          ? "text-white/70 hover:text-white hover:bg-white/10"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </motion.div>
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className={cn(
                        "text-sm font-medium hidden sm:block",
                        isDark || !scrolled ? "text-white" : scrolled ? "text-slate-800" : "text-white"
                      )}>
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown size={14} className={cn(
                        "transition-transform",
                        isDark || !scrolled ? "text-white/60" : scrolled ? "text-slate-500" : "text-white/60",
                        userMenuOpen && "rotate-180"
                      )} />
                    </motion.button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#1a1a2e] border border-white/10 shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-white/10">
                            <p className="text-white font-medium text-sm">{user?.name}</p>
                            <p className="text-white/40 text-xs truncate">{user?.email}</p>
                          </div>
                          <div className="p-2 space-y-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors"
                            >
                              <Home size={15} /> Dashboard
                            </Link>
                            <Link
                              href="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors"
                            >
                              <User size={15} /> Profile
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/20 text-white/70 hover:text-red-400 text-sm transition-colors"
                            >
                              <LogOut size={15} /> Log out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className={cn(
                      "text-sm font-medium px-4 py-2 rounded-xl transition-colors hidden sm:block",
                      isDark || !scrolled
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/30 transition-shadow"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "md:hidden p-2 rounded-xl transition-colors",
                  isDark || !scrolled
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "md:hidden border-t overflow-hidden",
                isDark || !scrolled ? "border-white/10 bg-[#0f0f10]/95" : "border-black/5 bg-white/95"
              )}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-primary-500/20 text-primary-400"
                        : isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <Icon size={18} /> {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
