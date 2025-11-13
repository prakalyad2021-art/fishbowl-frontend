import React from "react";

export default function Stats() {
  const stats = [
    { label: "Chats this month", value: 42 },
    { label: "Shared media", value: 15 },
    { label: "Active days", value: 23 },
  ];

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">Monthly Stats 📊</h1>
      <div className="grid gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white/70 rounded-xl shadow-md p-4 text-lg font-medium"
          >
            {s.label}: <span className="text-blue-600">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
