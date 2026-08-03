"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Edit3, Save, X, Camera } from "lucide-react";
import { useStore } from "@/store/useStore";
import { authService } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { ProfileSkeleton } from "@/components/ui/SkeletonLoader";
import { DESIGN_STYLES, ROOM_TYPES, BUDGET_CATEGORIES } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, token, setUser, theme, setTheme } = useStore();
  const { success, error: showError } = useToast();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    preferredStyles: [] as string[],
    preferredRooms: [] as string[],
    budgetPreference: "",
  });

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        preferredStyles: user.preferredStyles || [],
        preferredRooms: user.preferredRooms || [],
        budgetPreference: user.budgetPreference || "medium",
      });
    }
  }, [user]);

  const toggleStyle = (style: string) => {
    setForm((f) => ({
      ...f,
      preferredStyles: f.preferredStyles.includes(style)
        ? f.preferredStyles.filter((s) => s !== style)
        : [...f.preferredStyles, style],
    }));
  };

  const toggleRoom = (room: string) => {
    setForm((f) => ({
      ...f,
      preferredRooms: f.preferredRooms.includes(room)
        ? f.preferredRooms.filter((r) => r !== room)
        : [...f.preferredRooms, room],
    }));
  };

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await authService.updateProfile(token, form);
      setUser(res.data as Parameters<typeof setUser>[0]);
      success("Profile updated! ✨");
      setEditing(false);
    } catch (err: unknown) {
      showError("Update failed", err instanceof Error ? err.message : "Please try again");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;
  if (!user) return <div className="min-h-screen bg-[#0a0a0f] pt-24"><ProfileSkeleton /></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 text-white">
      {/* Hero */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              {user.name?.[0]?.toUpperCase()}
            </div>
            {editing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg">
                <Camera size={14} />
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-white/40 text-sm mb-2">{user.email}</p>
          {user.bio && <p className="text-white/60 max-w-md mx-auto">{user.bio}</p>}
          <p className="text-white/20 text-xs mt-3">Member since {formatDate(user.createdAt)}</p>

          <div className="flex gap-3 justify-center mt-6">
            {!editing ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm hover:bg-white/15 transition-colors"
              >
                <Edit3 size={15} /> Edit Profile
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm disabled:opacity-60"
                >
                  <Save size={15} /> {loading ? "Saving..." : "Save Changes"}
                </motion.button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition-colors"
                >
                  <X size={15} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Basic Info */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
          >
            <h2 className="text-white font-semibold mb-4">Basic Information</h2>
            <div>
              <label className="text-white/60 text-sm mb-2 block flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white outline-none focus:border-primary-400/50 transition-all"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about your design taste..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/20 outline-none focus:border-primary-400/50 transition-all resize-none"
              />
            </div>
          </motion.div>
        )}

        {/* Design Preferences */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
          <h2 className="text-white font-semibold">Design Preferences</h2>

          {/* Preferred Styles */}
          <div>
            <label className="text-white/60 text-sm mb-3 block">Favorite Styles</label>
            <div className="flex flex-wrap gap-2">
              {DESIGN_STYLES.map((style) => {
                const active = form.preferredStyles.includes(style);
                return (
                  <motion.button
                    key={style}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => editing && toggleStyle(style)}
                    disabled={!editing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      active
                        ? "bg-primary-500/30 border-primary-400/50 text-primary-300"
                        : "bg-white/5 border-white/10 text-white/50"
                    } ${!editing && "cursor-default"}`}
                  >
                    {style}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Preferred Rooms */}
          <div>
            <label className="text-white/60 text-sm mb-3 block">Favorite Rooms</label>
            <div className="flex flex-wrap gap-2">
              {ROOM_TYPES.map((room) => {
                const active = form.preferredRooms.includes(room);
                return (
                  <motion.button
                    key={room}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => editing && toggleRoom(room)}
                    disabled={!editing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      active
                        ? "bg-accent-500/30 border-accent-500/50 text-accent-300"
                        : "bg-white/5 border-white/10 text-white/50"
                    } ${!editing && "cursor-default"}`}
                  >
                    {room}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Budget Preference */}
          <div>
            <label className="text-white/60 text-sm mb-3 block">Budget Preference</label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_CATEGORIES.map((budget) => {
                const active = form.budgetPreference === budget;
                return (
                  <motion.button
                    key={budget}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => editing && setForm({ ...form, budgetPreference: budget })}
                    disabled={!editing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      active
                        ? "bg-primary-500/30 border-primary-400/50 text-primary-300"
                        : "bg-white/5 border-white/10 text-white/50"
                    } ${!editing && "cursor-default"}`}
                  >
                    {budget}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Dark Mode</p>
              <p className="text-white/30 text-xs mt-0.5">Switch between light and dark theme</p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-12 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-primary-500" : "bg-white/20"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${theme === "dark" ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-white/40" />
              <div>
                <p className="text-white/60 text-xs">Email address</p>
                <p className="text-white text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User size={16} className="text-white/40" />
              <div>
                <p className="text-white/60 text-xs">Member since</p>
                <p className="text-white text-sm">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
