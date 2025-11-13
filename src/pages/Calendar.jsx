import React, { useState } from "react";

export default function Calendar() {
  const [events, setEvents] = useState([
    { date: "2025-11-12", event: "Mood Check-In" },
    { date: "2025-11-15", event: "Group Activity" },
  ]);
  const [newEvent, setNewEvent] = useState("");
  const [newDate, setNewDate] = useState("");

  const addEvent = () => {
    if (!newDate || !newEvent) return;
    setEvents([...events, { date: newDate, event: newEvent }]);
    setNewEvent("");
    setNewDate("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">Shared Calendar 📅</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/70 outline-none"
        />
        <input
          type="text"
          placeholder="Event..."
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/70 outline-none"
        />
        <button
          onClick={addEvent}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div
            key={i}
            className="bg-white/70 p-3 rounded-lg shadow-sm"
          >
            <strong>{e.date}:</strong> {e.event}
          </div>
        ))}
      </div>
    </div>
  );
}
