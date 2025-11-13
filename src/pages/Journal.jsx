import React, { useState } from "react";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");

  const addEntry = () => {
    if (!text.trim()) return;
    setEntries([...entries, { date: new Date().toLocaleString(), text }]);
    setText("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">Personal Journal 📔</h1>
      <textarea
        className="w-full h-32 p-3 rounded-xl bg-white/70 shadow-inner outline-none mb-3"
        placeholder="Write your thoughts..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={addEntry}
        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        Save Entry
      </button>

      <div className="mt-5 space-y-3">
        {entries.map((e, i) => (
          <div
            key={i}
            className="p-3 bg-blue-50 rounded-xl shadow-sm text-left"
          >
            <strong>{e.date}</strong>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
