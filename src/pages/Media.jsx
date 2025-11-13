import React, { useState, useEffect, useRef } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import { storageHelpers } from "../utils/storageClient";
import { 
  Image, Video, Music, Link as LinkIcon, Trash2, MessageCircle, 
  Send, X, Heart, Share2, MoreVertical, Upload, Plus
} from "lucide-react";

const fishEmojis = ["🐠", "🐟", "🐡", "🦈", "🐙", "🐬"];

export default function Media({ user }) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("photo");
  const [caption, setCaption] = useState("");
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const authUser = await getCurrentUser();
        const email = user?.attributes?.email || authUser.signInDetails?.loginId || "";
        const username = email ? email.split('@')[0] : (user?.username || "user");
        
        // Get user's fish emoji from User model
        const existingUser = await client.models.User.list({
          filter: { userId: { eq: authUser.userId } },
        });
        let fishEmoji = fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
        if (existingUser.data.length > 0 && existingUser.data[0].fishEmoji) {
          fishEmoji = existingUser.data[0].fishEmoji;
        }
        
        setCurrentUser({
          id: authUser.userId,
          username,
          fishEmoji,
        });
        await loadPosts();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (user) init();
  }, [user]);

  const loadPosts = async () => {
    try {
      const allPosts = await client.models.MediaPost.list({
        sortDirection: "DESC",
      });
      // Load comments for each post
      const postsWithComments = await Promise.all(
        allPosts.data.map(async (post) => {
          try {
            const comments = await client.models.MediaComment.list({
              filter: { mediaPostId: { eq: post.id } },
            });
            return { ...post, comments: comments.data || [] };
          } catch (error) {
            return { ...post, comments: [] };
          }
        })
      );
      setPosts(postsWithComments);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let type = "photo";
    if (file.type.startsWith("video/")) type = "video";
    else if (file.type.startsWith("audio/")) type = "audio";
    else if (file.type === "image/gif") type = "gif";

    setMediaFile(file);
    setMediaType(type);
  };

  const uploadPost = async () => {
    if (!mediaFile || !currentUser) return;

    try {
      setUploading(true);
      const uploadResult = await storageHelpers.uploadMedia(mediaFile, currentUser.id, mediaType);

      await client.models.MediaPost.create({
        userId: currentUser.id,
        username: currentUser.username,
        fishEmoji: currentUser.fishEmoji,
        mediaUrl: uploadResult.url,
        mediaType,
        caption: caption || null,
      });

      setCaption("");
      setMediaFile(null);
      setShowUpload(false);
      await loadPosts();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!confirm("Delete this post?")) return;
    try {
      await client.models.MediaPost.delete({ id: postId });
      await loadPosts();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const addComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim() || !currentUser) return;

    try {
      await client.models.MediaComment.create({
        mediaPostId: postId,
        userId: currentUser.id,
        username: currentUser.username,
        commentText: text,
      });
      setCommentText({ ...commentText, [postId]: "" });
      await loadPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await client.models.MediaComment.delete({ id: commentId });
      await loadPosts();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Real-time subscription
  useEffect(() => {
    const subscription = client.models.MediaPost.observeQuery().subscribe({
      next: (data) => {
        // Reload to get comments
        loadPosts();
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Instagram-style Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Media Feed</h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition"
          >
            {showUpload ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Upload Modal - Instagram Style */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Create New Post</h2>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setMediaFile(null);
                    setCaption("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl mb-4 hover:border-blue-500 transition text-center"
                >
                  {mediaFile ? (
                    <div className="space-y-2">
                      {mediaType === "photo" || mediaType === "gif" ? (
                        <img
                          src={URL.createObjectURL(mediaFile)}
                          alt="Preview"
                          className="max-h-64 rounded-lg mx-auto"
                        />
                      ) : mediaType === "video" ? (
                        <video
                          src={URL.createObjectURL(mediaFile)}
                          controls
                          className="max-h-64 rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="text-center p-8 bg-gray-100 rounded-lg">
                          <Music size={48} className="mx-auto text-blue-500 mb-2" />
                          <p className="text-sm text-gray-600">{mediaFile.name}</p>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload size={48} className="mx-auto text-gray-400" />
                      <p className="text-gray-600 font-medium">Select Photo, Video, or Audio</p>
                      <p className="text-sm text-gray-400">Click to browse</p>
                    </div>
                  )}
                </button>

                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none mb-4"
                  maxLength={500}
                />

                <button
                  onClick={uploadPost}
                  disabled={!mediaFile || uploading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Share Post"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed - Instagram/Tumblr Style */}
        <div className="space-y-6 py-6">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Image size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No posts yet</p>
              <p className="text-gray-400 text-sm">Share something to get started! 🐠</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Post Header - Instagram Style */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                      {post.fishEmoji || "🐠"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">@{post.username}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {post.userId === currentUser?.id && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  )}
                </div>

                {/* Media - Full Width */}
                <div className="w-full bg-black">
                  {post.mediaType === "photo" || post.mediaType === "gif" ? (
                    <img
                      src={post.mediaUrl}
                      alt={post.caption || "Media"}
                      className="w-full object-contain max-h-[600px]"
                    />
                  ) : post.mediaType === "video" ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      className="w-full max-h-[600px]"
                    />
                  ) : post.mediaType === "audio" ? (
                    <div className="p-12 bg-gradient-to-br from-blue-500 to-purple-600">
                      <div className="max-w-md mx-auto">
                        <Music size={64} className="mx-auto text-white mb-4" />
                        <audio src={post.mediaUrl} controls className="w-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 bg-gray-100 text-center">
                      <LinkIcon size={48} className="mx-auto text-blue-500 mb-3" />
                      <a
                        href={post.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {post.mediaUrl}
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions Bar - Instagram Style */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <button className="hover:opacity-70 transition">
                      <Heart size={24} className="text-gray-900" />
                    </button>
                    <button
                      onClick={() =>
                        setShowComments({
                          ...showComments,
                          [post.id]: !showComments[post.id],
                        })
                      }
                      className="hover:opacity-70 transition"
                    >
                      <MessageCircle size={24} className="text-gray-900" />
                    </button>
                    <button className="hover:opacity-70 transition">
                      <Share2 size={24} className="text-gray-900" />
                    </button>
                  </div>
                </div>

                {/* Caption */}
                {post.caption && (
                  <div className="px-4 py-2">
                    <p className="text-gray-900">
                      <span className="font-semibold">@{post.username}</span>{" "}
                      {post.caption}
                    </p>
                  </div>
                )}

                {/* Comments Section */}
                {(showComments[post.id] || (post.comments && post.comments.length > 0)) && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    {post.comments && post.comments.length > 0 && (
                      <div className="space-y-3 mb-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {comment.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-semibold">@{comment.username}</span>{" "}
                                <span className="text-gray-700">{comment.commentText}</span>
                              </p>
                            </div>
                            {comment.userId === currentUser?.id && (
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="text-gray-400 hover:text-red-500 transition"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[post.id] || ""}
                        onChange={(e) =>
                          setCommentText({ ...commentText, [post.id]: e.target.value })
                        }
                        onKeyPress={(e) => e.key === "Enter" && addComment(post.id)}
                        className="flex-1 px-4 py-2 rounded-full bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        disabled={!commentText[post.id]?.trim()}
                        className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 transition"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
