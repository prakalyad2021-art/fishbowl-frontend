import React, { useState } from "react";

export default function Prompts() {
  const [prompt, setPrompt] = useState("What made you smile today?");

  const newPrompt = () => {
    const prompts = [
      "Share a photo that represents your day.",
      "Describe your current mood using an emoji.",
      "What’s one thing you’re grateful for?",
    ];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">Daily Prompts 🎯</h1>
      <p className="text-lg mb-6">{prompt}</p>
      <button
        onClick={newPrompt}
        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        New Prompt
      </button>
    </div>
  );
}
