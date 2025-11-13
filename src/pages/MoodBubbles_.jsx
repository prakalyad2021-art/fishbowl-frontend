import { useState } from "react";
import { Smile, Frown, Meh, Heart, Sun } from "lucide-react";

export default function MoodBubbles() {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { id: "happy", icon: Smile, color: "bg-cyan-400", label: "Happy" },
    { id: "calm", icon: Sun, color: "bg-sky-400", label: "Calm" },
    { id: "meh", icon: Meh, color: "bg-blue-400", label: "Meh" },
    { id: "sad", icon: Frown, color: "bg-indigo-400", label: "Sad" },
    { id: "love", icon: Heart, color: "bg-pink-500", label: "Loved" },
  ];

  return (
    <div className="relative flex flex-col h-full w-full rounded-3xl bg-gradient-to-br from-cyan-500/70 via-sky-600/60 to-blue-700/70 p-6 text-white">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-semibold drop-shadow-md">Mood Bubbles 💭</h2>
        <p className="text-sm text-white/80">
          Pick your mood for today — it’ll float in the bowl.
        </p>
      </div>

      {/* Mood Picker */}
      <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
        {moods.map(({ id, icon: Icon, color, label }) => (
          <button
            key={id}
            onClick={() => setSelectedMood(id)}
            className={`flex flex-col items-center justify-center rounded-2xl p-4 shadow-md backdrop-blur-md transition-all border border-white/30
              ${selectedMood === id ? `${color} scale-110` : "bg-white/20 hover:bg-white/30"}
            `}
          >
            <Icon className="w-8 h-8 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Mood Trend Placeholder */}
      <div className="flex-1 flex flex-col justify-center items-center rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-inner">
        <h3 className="text-lg font-medium mb-2">Weekly Mood Trend</h3>
        <div className="flex space-x-3">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full ${
                selectedMood ? "bg-white/70" : "bg-white/30"
              }`}
              style={{
                opacity: 0.6 + Math.random() * 0.3,
                transform: `scale(${0.8 + Math.random() * 0.4})`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Footer Bubble Text */}
      {selectedMood && (
        <div className="absolute bottom-4 left-0 w-full text-center text-white/90 text-sm animate-pulse">
          Your fish feels <strong>{selectedMood}</strong> today 🐠
        </div>
      )}
    </div>
  );
}
