import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Fishbowl from "./pages/Fishbowl";
import Chatroom from "./pages/Chatroom";
import Prompts from "./pages/Prompts";
import Media from "./pages/Media";
import Stats from "./pages/Stats";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Fishbowl />} />
            <Route path="/chat" element={<Chatroom />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/media" element={<Media />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}
