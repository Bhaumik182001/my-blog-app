import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ArticleCard from "../components/ArticleCard";
import PostEditor from "../components/PostEditor";
import ConfirmModal from "../components/ConfirmModal";
import { BookMarked, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReadingList() {
  const { state, dispatch, showToast } = useApp();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const bookmarkedPosts = state.posts.filter((p) =>
    state.bookmarks.includes(p.slug)
  );

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDeleteRequest = (postId) => {
    setDeletePostId(postId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletePostId) {
      dispatch({ type: "DELETE_POST", payload: deletePostId });
      showToast("Post deleted successfully", "info");
      setDeletePostId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-10">
      <div className="border-b border-slate-800 pb-5 flex items-center space-x-3">
        <BookMarked className="text-cyan-400" size={28} />
        <div>
          <h1 className="text-3xl font-black text-slate-100">Reading List</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your bookmarked engineering writeups and drafts
          </p>
        </div>
      </div>

      {bookmarkedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarkedPosts.map((post) => (
            <ArticleCard
              key={post.id}
              post={post}
              onEditClick={handleEdit}
              onDeleteClick={handleDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 border border-slate-800 rounded-2xl bg-slate-900/10 text-center space-y-4">
          <BookMarked size={48} className="text-slate-800" />
          <h3 className="text-slate-300 font-bold">Your reading list is empty</h3>
          <p className="text-slate-500 text-xs max-w-sm">
            Save interesting architectural post guides to your reading list. They will show up here for easy access.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-extrabold text-sm"
          >
            <span>Explore Articles</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      )}

      {/* Editor Modal Sheet */}
      <PostEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
        }}
        editingPost={editingPost}
      />

      {/* Confirm deletion sheet */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </div>
  );
}
