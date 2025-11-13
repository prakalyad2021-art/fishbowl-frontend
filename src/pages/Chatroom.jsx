import React, { useState } from "react";

export default function Chatroom() {
  const [messages, setMessages] = useState([
    { sender: "🐠 @alice", text: "Hey friends!" },
    { sender: "🐟 @bob", text: "Just chilling 🧊" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: "🐡 @you", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">FishTalk 💬</h1>

      <div className="flex-1 overflow-y-auto bg-white/70 rounded-2xl shadow-inner p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="p-3 rounded-lg bg-blue-50 shadow-sm">
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full bg-white/80 shadow-inner outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
