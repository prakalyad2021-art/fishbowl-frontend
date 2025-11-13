import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Image, Activity, BarChart3, Book, Calendar, Home } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: <Home size={22} />, path: "/" },
    { name: "Chat", icon: <MessageCircle size={22} />, path: "/chat" },
    { name: "Media", icon: <Image size={22} />, path: "/media" },
    { name: "Prompts", icon: <Activity size={22} />, path: "/prompts" },
    { name: "Stats", icon: <BarChart3 size={22} />, path: "/stats" },
    { name: "Journal", icon: <Book size={22} />, path: "/journal" },
    { name: "Calendar", icon: <Calendar size={22} />, path: "/calendar" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex bg-white/70 backdrop-blur-md shadow-lg rounded-2xl px-5 py-3 gap-6 border border-white/50 z-50">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center text-xs font-medium transition hover:scale-105 ${
            location.pathname === item.path ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {item.icon}
          <span className="mt-1">{item.name}</span>
        </button>
      ))}
    </nav>
  );
}
