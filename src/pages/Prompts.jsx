import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import { dataHelpers } from "../utils/dataClient";

export default function Prompts({ user }) {
  const [prompt, setPrompt] = useState(null);
  const [responses, setResponses] = useState([]);
  const [myResponse, setMyResponse] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const authUser = await getCurrentUser();
        setCurrentUser({ id: authUser.userId, username: user?.username || "user" });
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
          "What made you smile today?",
          "Share a photo that represents your day.",
          "Describe your current mood using an emoji.",
          "What's one thing you're grateful for?",
          "What's on your mind right now?",
        ];
        const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
        const newPrompt = await client.models.Prompt.create({
          promptText: randomPrompt,
          date: today,
        });
        setPrompt(newPrompt);
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
    if (!myResponse.trim() || !prompt || !currentUser) return;

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

      await client.models.PromptResponse.create({
        promptId: prompt.id,
        userId: currentUser.id,
        username: currentUser.username,
        responseText: myResponse,
        expiresAt: expiresAt.toISOString(),
      });

      setMyResponse("");
      await loadResponses(prompt.id);
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response");
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Daily Prompts 🎯</h1>

      {prompt && (
        <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg">
          <p className="text-xl text-center mb-4">{prompt.promptText}</p>
          <p className="text-sm text-gray-500 text-center">
            Responses expire in 24 hours (like Instagram Notes)
          </p>
        </div>
      )}

      <div className="bg-white/70 rounded-xl p-4 mb-4">
        <textarea
          placeholder="Share your response..."
          value={myResponse}
          onChange={(e) => setMyResponse(e.target.value)}
          className="w-full h-24 p-3 rounded-lg bg-white/80 outline-none mb-3"
        />
        <button
          onClick={submitResponse}
          className="w-full px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Submit Response
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-blue-700">Responses ({responses.length})</h3>
        {responses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No responses yet. Be the first! 🐠</p>
        ) : (
          responses.map((r) => (
            <div key={r.id} className="bg-blue-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <strong>@{r.username}</strong>
                <span className="text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p>{r.responseText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
