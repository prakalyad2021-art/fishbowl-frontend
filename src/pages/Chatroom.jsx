import React, { useState, useEffect, useRef } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { dataHelpers } from "../utils/dataClient";
import { client } from "../utils/dataClient";
import { storageHelpers } from "../utils/storageClient";
import { Image, Send, X } from "lucide-react";

const fishEmojis = ["🐠", "🐟", "🐡", "🦈", "🐙", "🐬"];

export default function Chatroom({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        const authUser = await getCurrentUser();
        const userId = authUser.userId;
        const email = user?.attributes?.email || authUser.signInDetails?.loginId || "";
        const username = email ? email.split('@')[0] : (user?.username || authUser.username || "user");
        
        // Get user's fish emoji from User model - MUST match Fishbowl
        const existingUser = await client.models.User.list({
          filter: { userId: { eq: userId } },
        });
        
        let fishEmoji;
        if (existingUser.data.length > 0 && existingUser.data[0].fishEmoji) {
          // Use existing fish emoji (never change it)
          fishEmoji = existingUser.data[0].fishEmoji;
        } else {
          // User doesn't exist yet - assign one and save it
          fishEmoji = fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
          // Create user with fish emoji
          await dataHelpers.createOrUpdateUser(userId, {
            username,
            email,
            fishEmoji,
            isOnline: true,
          });
        }
        
        setCurrentUser({ id: userId, username, fishEmoji });
        await loadMessages();
      } catch (error) {
        console.error("Error initializing user:", error);
      }
    };

    if (user) {
      initUser();
    }

    // Set up real-time subscription for messages
    const subscription = client.models.Message.observeQuery().subscribe({
      next: (data) => {
        setMessages(data.items);
        // Auto-scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadMessages = async () => {
    try {
      const msgs = await dataHelpers.getMessages();
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const fileType = file.type;
    let mediaType = "image";
    if (fileType.startsWith("video/")) mediaType = "video";
    else if (fileType.startsWith("audio/")) mediaType = "audio";
    else if (fileType === "image/gif") mediaType = "gif";

    setMediaFile(file);
    
    // Create preview
    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(file.name);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() && !mediaFile) {
      alert("Please enter a message or attach a file");
      return;
    }
    if (!currentUser) {
      alert("Please log in");
      return;
    }

    try {
      setUploading(true);
      let mediaUrl = null;
      let mediaType = null;

      // Upload media if present
      if (mediaFile) {
        console.log("Uploading media for chat...");
        const fileType = mediaFile.type;
        if (fileType.startsWith("video/")) mediaType = "video";
        else if (fileType.startsWith("audio/")) mediaType = "audio";
        else if (fileType === "image/gif") mediaType = "gif";
        else mediaType = "image";

        const uploadResult = await storageHelpers.uploadMedia(
          mediaFile,
          currentUser.id,
          mediaType
        );
        mediaUrl = uploadResult.url;
        console.log("Media uploaded:", mediaUrl);
      }

      // Send message
      console.log("Sending message...", { content: newMessage, mediaUrl });
      await dataHelpers.sendMessage({
        content: newMessage || (mediaFile ? "📎 Media" : ""),
        senderId: currentUser.id,
        senderUsername: currentUser.username,
        senderFishEmoji: currentUser.fishEmoji || fishEmojis[0],
        mediaUrl,
        mediaType,
      });
      console.log("Message sent successfully");

      setNewMessage("");
      setMediaFile(null);
      setMediaPreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error.message || error.toString() || "Unknown error";
      alert(`Failed to send message: ${errorMessage}\n\nCheck console for details.`);
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">FishTalk 💬</h1>

      <div className="flex-1 overflow-y-auto bg-white/70 rounded-2xl shadow-inner p-4 space-y-3 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation! 🐠</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg shadow-sm ${
                msg.senderId === currentUser?.id
                  ? "bg-blue-500 text-white ml-auto max-w-[80%]"
                  : "bg-blue-50 max-w-[80%]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{msg.senderFishEmoji || "🐠"}</span>
                <strong className="text-sm">@{msg.senderUsername}</strong>
                <span className="text-xs opacity-70">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
              {msg.mediaUrl && (
                <div className="mb-2 rounded-lg overflow-hidden">
                  {msg.mediaType === "image" || msg.mediaType === "gif" ? (
                    <img
                      src={msg.mediaUrl}
                      alt="Media"
                      className="max-w-full max-h-64 object-contain rounded"
                    />
                  ) : msg.mediaType === "video" ? (
                    <video
                      src={msg.mediaUrl}
                      controls
                      className="max-w-full max-h-64 rounded"
                    />
                  ) : msg.mediaType === "audio" ? (
                    <audio src={msg.mediaUrl} controls className="w-full" />
                  ) : null}
                </div>
              )}
              {msg.content && <p className="text-sm">{msg.content}</p>}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="mb-2 p-2 bg-white/80 rounded-lg flex items-center gap-2">
          {typeof mediaPreview === "string" && mediaPreview.startsWith("data:") ? (
            <img
              src={mediaPreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
              📎
            </div>
          )}
          <span className="flex-1 text-sm truncate">
            {typeof mediaPreview === "string" && !mediaPreview.startsWith("data:")
              ? mediaPreview
              : mediaFile?.name}
          </span>
          <button
            onClick={() => {
              setMediaPreview(null);
              setMediaFile(null);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <label className="cursor-pointer p-2 bg-white/80 rounded-full hover:bg-white transition">
          <Image size={20} className="text-blue-600" />
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !uploading && handleSend()}
          className="flex-1 px-4 py-2 rounded-full bg-white/80 shadow-inner outline-none"
          disabled={uploading}
        />
        <button
          onClick={handleSend}
          disabled={uploading || (!newMessage.trim() && !mediaFile)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            "Sending..."
          ) : (
            <>
              <Send size={18} />
              Send
            </>
          )}
        </button>
      </div>
    </div>
  );
}
