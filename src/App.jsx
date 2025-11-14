import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
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
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Fishbowl user={user} />} />
                <Route path="/chat" element={<Chatroom user={user} />} />
                <Route path="/prompts" element={<Prompts user={user} />} />
                <Route path="/media" element={<Media user={user} />} />
                <Route path="/stats" element={<Stats user={user} />} />
                <Route path="/journal" element={<Journal user={user} />} />
                <Route path="/calendar" element={<Calendar user={user} />} />
              </Routes>
            </div>
            <BottomNav />
            <div className="fixed top-4 right-4">
              <button
                onClick={async () => {
                  // Set user offline before signing out
                  try {
                    const { getCurrentUser } = await import("aws-amplify/auth");
                    const { client } = await import("./utils/dataClient");
                    const authUser = await getCurrentUser();
                    const existing = await client.models.User.list({
                      filter: { userId: { eq: authUser.userId } },
                    });
                    if (existing.data.length > 0) {
                      await client.models.User.update({
                        id: existing.data[0].id,
                        isOnline: false,
                        lastSeen: new Date().toISOString(),
                      });
                    }
                  } catch (error) {
                    console.error("Error setting offline:", error);
                  }
                  signOut();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}
