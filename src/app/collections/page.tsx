"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Plus, Pencil, Trash2, Share2, X, Globe, Lock } from "lucide-react";
import { useStore } from "@/store/useStore";
import { collectionService } from "@/services/api";
import { CollectionCardSkeleton } from "@/components/ui/SkeletonLoader";
import { NoCollections } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import type { Collection } from "@/store/useStore";

export default function CollectionsPage() {
  const router = useRouter();
  const { isAuthenticated, token, collections, setCollections, addCollection, updateCollection, removeCollection } = useStore();
  const { success, error: showError, info } = useToast();

  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<Collection | null>(null);
  const [deleteModal, setDeleteModal] = useState<Collection | null>(null);
  const [form, setForm] = useState({ name: "", description: "", isPublic: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!token) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await collectionService.getAll(token);
        setCollections(res.data as Collection[]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, token, router, setCollections]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await collectionService.create(token, form);
      addCollection(res.data as Collection);
      success("Collection created! 📁");
      setCreateModal(false);
      setForm({ name: "", description: "", isPublic: false });
    } catch (err: unknown) {
      showError("Error", err instanceof Error ? err.message : "Failed to create collection");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editModal) return;
    setSubmitting(true);
    try {
      await collectionService.update(token, editModal.id, form);
      updateCollection(editModal.id, form);
      success("Collection updated!");
      setEditModal(null);
    } catch {
      showError("Error", "Failed to update collection");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteModal) return;
    setSubmitting(true);
    try {
      await collectionService.delete(token, deleteModal.id);
      removeCollection(deleteModal.id);
      success("Collection deleted");
      setDeleteModal(null);
    } catch {
      showError("Error", "Failed to delete collection");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 text-white">
      {/* Header */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen size={28} className="text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Collections</h1>
            </div>
            <p className="text-white/40">
              {collections.length} inspiration {collections.length === 1 ? "board" : "boards"}
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setForm({ name: "", description: "", isPublic: false }); setCreateModal(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium shadow-lg"
          >
            <Plus size={18} /> New Collection
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <CollectionCardSkeleton key={i} />)}
          </div>
        ) : collections.length === 0 ? (
          <NoCollections onCreate={() => setCreateModal(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {(collections as Collection[]).map((col, i) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all card-hover"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-white/5 overflow-hidden">
                    {col.coverImage ? (
                      <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-30">📁</span>
                      </div>
                    )}
                    {/* Preview collage */}
                    {col.previewImages && col.previewImages.length > 1 && (
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {col.previewImages.slice(0, 4).map((img, idx) => (
                          <img key={idx} src={img} alt="" className="w-full h-full object-cover" />
                        ))}
                      </div>
                    )}
                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setEditModal(col); setForm({ name: col.name, description: col.description || "", isPublic: col.isPublic || false }); }}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/collections/shared/${col.shareToken}`;
                          navigator.clipboard.writeText(url);
                          info("Link copied!", "Share this collection with friends");
                        }}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                      >
                        <Share2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteModal(col)}
                        className="p-2 rounded-xl bg-red-500/30 hover:bg-red-500/50 text-red-300 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {/* Privacy badge */}
                    <div className="absolute top-3 right-3">
                      {col.isPublic ? (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                          <Globe size={10} /> Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 text-white/40 text-xs">
                          <Lock size={10} /> Private
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-1 truncate">{col.name}</h3>
                    {col.description && (
                      <p className="text-white/40 text-xs mb-2 line-clamp-2">{col.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-white/30">
                      <span>{col.itemCount ?? 0} designs</span>
                      <span>{formatDate(col.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Collection">
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-2 block">Collection Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Living Room Inspo"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/20 outline-none focus:border-primary-400/50 transition-all"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your collection..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/20 outline-none focus:border-primary-400/50 transition-all resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
              className={`w-11 h-6 rounded-full transition-colors ${form.isPublic ? "bg-primary-500" : "bg-white/20"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${form.isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-white/60 text-sm">Make this collection public</span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium disabled:opacity-60 transition-all"
          >
            {submitting ? "Creating..." : "Create Collection"}
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Edit Collection">
        <form onSubmit={handleEdit} className="p-6 space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-2 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white outline-none focus:border-primary-400/50 transition-all"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white outline-none focus:border-primary-400/50 transition-all resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
              className={`w-11 h-6 rounded-full transition-colors ${form.isPublic ? "bg-primary-500" : "bg-white/20"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${form.isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-white/60 text-sm">Public collection</span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} size="sm">
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">🗑️</div>
          <h3 className="text-xl font-bold text-white mb-2">Delete Collection?</h3>
          <p className="text-white/50 mb-6 text-sm">
            Are you sure you want to delete <span className="text-white font-medium">"{deleteModal?.name}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal(null)}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-60"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
