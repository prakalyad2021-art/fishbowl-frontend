import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import { Heart, MessageCircle, Clock, Send } from "lucide-react";

export default function Prompts({ user }) {
  const [prompt, setPrompt] = useState(null);
  const [responses, setResponses] = useState([]);
  const [myResponse, setMyResponse] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const authUser = await getCurrentUser();
        const email = user?.attributes?.email || authUser.signInDetails?.loginId || "";
        const username = email ? email.split('@')[0] : (user?.username || "user");
        setCurrentUser({ id: authUser.userId, username });
        await loadTodayPrompt();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (user) init();
  }, [user]);

  const loadTodayPrompt = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const prompts = await client.models.Prompt.list({
        filter: { date: { eq: today } },
      });

      if (prompts.data.length > 0) {
        const todayPrompt = prompts.data[0];
        setPrompt(todayPrompt);
        await loadResponses(todayPrompt.id);
      } else {
        // Create today's prompt if doesn't exist
        const dailyPrompts = [
          "What made you smile today? 😊",
          "Share a moment that made your day better ✨",
          "What's one thing you're grateful for? 🙏",
          "Describe your current mood with an emoji 🎭",
          "What's on your mind right now? 💭",
          "Share something that inspired you today 🌟",
          "What's a small win you had today? 🎉",
        ];
        const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
        const newPrompt = await client.models.Prompt.create({
          promptText: randomPrompt,
          date: today,
        });
        setPrompt(newPrompt.data);
      }
    } catch (error) {
      console.error("Error loading prompt:", error);
    }
  };

  const loadResponses = async (promptId) => {
    try {
      const allResponses = await client.models.PromptResponse.list({
        filter: { promptId: { eq: promptId } },
      });
      // Filter out expired responses (24 hours)
      const valid = allResponses.data.filter((r) => {
        if (!r.expiresAt) return true;
        return new Date(r.expiresAt) > new Date();
      });
      setResponses(valid);
    } catch (error) {
      console.error("Error loading responses:", error);
    }
  };

  const submitResponse = async () => {
    if (!myResponse.trim() || !prompt || !currentUser || submitting) return;

    try {
      setSubmitting(true);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

      console.log('Submitting response:', {
        promptId: prompt.id,
        userId: currentUser.id,
        username: currentUser.username,
        responseText: myResponse,
      });

      const result = await client.models.PromptResponse.create({
        promptId: prompt.id,
        userId: currentUser.id,
        username: currentUser.username,
        responseText: myResponse,
        expiresAt: expiresAt.toISOString(),
      });

      console.log('Response created:', result);

      setMyResponse("");
      await loadResponses(prompt.id);
    } catch (error) {
      console.error("Error submitting response:", error);
      console.error("Error details:", error.message, error.errors);
      alert(`Failed to submit response: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!prompt) return;
    const subscription = client.models.PromptResponse.observeQuery({
      filter: { promptId: { eq: prompt.id } },
    }).subscribe({
      next: (data) => {
        const valid = data.items.filter((r) => {
          if (!r.expiresAt) return true;
          return new Date(r.expiresAt) > new Date();
        });
        setResponses(valid);
      },
    });
    return () => subscription.unsubscribe();
  }, [prompt]);

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return "24h";
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "Expired";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Instagram Notes Style Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Daily Prompt</h1>
          <p className="text-sm text-gray-500 mt-1">Share your thoughts • Expires in 24h</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Today's Prompt Card - Instagram Notes Style */}
        {prompt && (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 mb-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="opacity-80" />
                <span className="text-sm opacity-90">Today's Prompt</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 leading-tight">{prompt.promptText}</h2>
              <p className="text-sm opacity-80 mt-4">
                {responses.length} {responses.length === 1 ? "response" : "responses"}
              </p>
            </div>
          </div>
        )}

        {/* Response Input - Instagram Notes Style */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Share your response..."
                value={myResponse}
                onChange={(e) => setMyResponse(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none text-gray-800 placeholder-gray-400"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{myResponse.length}/500</span>
                <button
                  onClick={submitResponse}
                  disabled={!myResponse.trim() || submitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? "Posting..." : (
                    <>
                      <Send size={16} />
                      Post Response
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Responses Feed - Instagram Notes Style */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Responses ({responses.length})
          </h3>
          {responses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No responses yet. Be the first to share! 🐠</p>
            </div>
          ) : (
            responses.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {r.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">@{r.username}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{r.responseText}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition">
                    <Heart size={18} />
                    <span className="text-sm">Like</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Clock size={14} />
                    <span>Expires in {getTimeRemaining(r.expiresAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
