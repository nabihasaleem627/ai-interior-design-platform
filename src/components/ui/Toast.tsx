"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="text-green-400" size={20} />,
  error: <XCircle className="text-red-400" size={20} />,
  warning: <AlertCircle className="text-yellow-400" size={20} />,
  info: <Info className="text-blue-400" size={20} />,
};

const colors = {
  success: "border-green-500/30 bg-green-500/10",
  error: "border-red-500/30 bg-red-500/10",
  warning: "border-yellow-500/30 bg-yellow-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
};

function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", duration: 0.4 }}
      className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[300px] max-w-sm ${colors[toast.type]}`}
      style={{ background: "rgba(15,15,20,0.9)" }}
    >
      <div className="mt-0.5 flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-white/60 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white/40 hover:text-white transition-colors flex-shrink-0"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

// ─── Global Toast Provider ────────────────────────────────────────────────────
let globalToastFn: ((toast: Omit<ToastMessage, "id">) => void) | null = null;

export function useToast() {
  return {
    toast: (msg: Omit<ToastMessage, "id">) => {
      if (globalToastFn) globalToastFn(msg);
    },
    success: (title: string, message?: string) => {
      if (globalToastFn) globalToastFn({ type: "success", title, message });
    },
    error: (title: string, message?: string) => {
      if (globalToastFn) globalToastFn({ type: "error", title, message });
    },
    warning: (title: string, message?: string) => {
      if (globalToastFn) globalToastFn({ type: "warning", title, message });
    },
    info: (title: string, message?: string) => {
      if (globalToastFn) globalToastFn({ type: "info", title, message });
    },
  };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    globalToastFn = (toast) => {
      setToasts((prev) => [
        ...prev,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ]);
    };
    return () => {
      globalToastFn = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
