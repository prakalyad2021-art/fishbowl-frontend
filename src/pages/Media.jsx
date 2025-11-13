import React, { useState, useEffect, useRef } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import { storageHelpers } from "../utils/storageClient";
import { Image, Video, Music, Link as LinkIcon, Trash2, MessageCircle, Send, X } from "lucide-react";

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
  const fileInputRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const authUser = await getCurrentUser();
        setCurrentUser({
          id: authUser.userId,
          username: user?.username || "user",
          fishEmoji: fishEmojis[Math.floor(Math.random() * fishEmojis.length)],
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
      setPosts(allPosts.data);
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
        setPosts(data.items);
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-700">Media Feed 🖼</h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          {showUpload ? "Cancel" : "+ Upload"}
        </button>
      </div>

      {showUpload && (
        <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 border-2 border-dashed border-blue-300 rounded-xl mb-4 hover:bg-blue-50"
          >
            {mediaFile ? mediaFile.name : "Click to select media"}
          </button>
          {mediaFile && (
            <div className="mb-4">
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
                  <Music size={48} className="mx-auto text-blue-500" />
                  <p>{mediaFile.name}</p>
                </div>
              )}
            </div>
          )}
          <input
            type="text"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/80 outline-none mb-4"
          />
          <button
            onClick={uploadPost}
            disabled={!mediaFile || uploading}
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Post"}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts yet. Share something! 🐠</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white/80 rounded-2xl shadow-lg overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{post.fishEmoji || "🐠"}</span>
                  <div>
                    <strong>@{post.username}</strong>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {post.userId === currentUser?.id && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                )}
              </div>

              {/* Media */}
              <div className="w-full">
                {post.mediaType === "photo" || post.mediaType === "gif" ? (
                  <img src={post.mediaUrl} alt={post.caption || "Media"} className="w-full" />
                ) : post.mediaType === "video" ? (
                  <video src={post.mediaUrl} controls className="w-full" />
                ) : post.mediaType === "audio" ? (
                  <div className="p-8 bg-gray-100">
                    <audio src={post.mediaUrl} controls className="w-full" />
                  </div>
                ) : (
                  <div className="p-8 bg-gray-100 text-center">
                    <LinkIcon size={48} className="mx-auto text-blue-500" />
                    <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer">
                      {post.mediaUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="p-4 border-b">
                  <p>
                    <strong>@{post.username}:</strong> {post.caption}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {post.comments?.items?.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <strong className="text-sm">@{comment.username}:</strong>
                      <span className="text-sm flex-1">{comment.commentText}</span>
                      {comment.userId === currentUser?.id && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [post.id]: e.target.value })
                    }
                    onKeyPress={(e) => e.key === "Enter" && addComment(post.id)}
                    className="flex-1 px-3 py-2 rounded-full bg-white/80 outline-none text-sm"
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
