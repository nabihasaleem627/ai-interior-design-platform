"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { authService } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import type { User } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useStore();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form.email, form.password);
      const { user, token } = res.data as { user: User; token: string };
      setUser(user);
      setToken(token);
      success("Welcome back!", `Hello, ${user.name}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      showError("Login failed", err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex gradient-hero">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80"
            alt="Interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f10] to-transparent" />
        </div>
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center font-bold text-lg">I</div>
            <span className="text-2xl font-bold">Interior AI</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Find inspiration for your
            <span className="text-gradient"> perfect space</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Access thousands of curated designs, AI recommendations, and smart
            organization tools.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            {["Browse 500+ curated designs", "AI-powered recommendations", "Create inspiration boards"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/70">
                <div className="w-5 h-5 rounded-full bg-primary-500/30 border border-primary-400/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center font-bold text-white">I</div>
            <span className="text-white font-bold text-lg">Interior AI</span>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-white/40">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary-400/50 focus:bg-white/12 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary-400/50 focus:bg-white/12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(200,132,30,0.3)" }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              {/* Demo login */}
              <button
                type="button"
                onClick={() => setForm({ email: "demo@interior.ai", password: "demo1234" })}
                className="w-full py-3 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-accent-400" /> Use Demo Account
              </button>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                Sign up free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
