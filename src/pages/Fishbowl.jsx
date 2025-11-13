import React, { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { dataHelpers } from "../utils/dataClient";
import { client } from "../utils/dataClient";

const fishEmojis = ["🐠", "🐟", "🐡", "🦈", "🐙", "🐬"];

export default function Fishbowl({ user }) {
  const [fishPositions, setFishPositions] = useState([]);
  const [myMood, setMyMood] = useState("(・∀・)");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userMoods, setUserMoods] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user and fetch data
  useEffect(() => {
    const initUser = async () => {
      try {
        const authUser = await getCurrentUser();
        const userId = authUser.userId;
        const email = user?.attributes?.email || authUser.signInDetails?.loginId || "";
        // Extract username from email (part before @)
        const username = email ? email.split('@')[0] : (user?.username || authUser.username || "user");
        
        // Get or assign fish emoji - IMPORTANT: Only assign if user doesn't exist
        const existingUser = await client.models.User.list({
          filter: { userId: { eq: userId } },
        });
        
        let fishEmoji;
        let isNewUser = false;
        
        if (existingUser.data.length > 0 && existingUser.data[0].fishEmoji) {
          // User exists - use their existing fish emoji (NEVER change it)
          fishEmoji = existingUser.data[0].fishEmoji;
        } else {
          // New user - assign fish emoji ONCE and save it permanently
          isNewUser = true;
          fishEmoji = fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
        }

        // Create or update user profile
        // Only update fishEmoji if it's a new user
        const userDataToSave = {
          username,
          email,
          mood: myMood,
          isOnline: true,
        };
        
        // Only set fishEmoji if it's a new user (to prevent changing existing fish)
        if (isNewUser) {
          userDataToSave.fishEmoji = fishEmoji;
        }

        const userResult = await dataHelpers.createOrUpdateUser(userId, userDataToSave);

        const userData = userResult?.data || userResult;
        // Always use the fishEmoji we determined (existing or new)
        const finalFishEmoji = userData?.fishEmoji || fishEmoji;
        
        setCurrentUser({ 
          id: userId, 
          userId: userId, // Add userId field for consistency
          username, 
          email,
          fishEmoji: finalFishEmoji
        });
        await loadData();
        setLoading(false);
      } catch (error) {
        console.error("Error initializing user:", error);
        setLoading(false);
      }
    };

    if (user) {
      initUser();
    }

    // Set up real-time subscription for users - set up immediately, will update when currentUser is set
    let subscription;
    if (user) {
      subscription = client.models.User.observeQuery().subscribe({
        next: (data) => {
          // Get all online users
          const online = data.items.filter((u) => u.isOnline === true);
          
          // Ensure current user is included if they exist
          let allOnline = [...online];
          if (currentUser && currentUser.isOnline) {
            const currentUserInList = allOnline.find(u => (u.userId || u.id) === currentUser.userId);
            if (!currentUserInList) {
              allOnline.push({
                id: currentUser.id,
                userId: currentUser.userId,
                username: currentUser.username,
                email: currentUser.email,
                fishEmoji: currentUser.fishEmoji,
                mood: myMood,
                isOnline: true,
              });
            }
          }
          
          setOnlineUsers(allOnline);
          
          // Update fish positions based on online users
          const positions = allOnline.map((user, i) => {
            // Reuse existing position if fish already exists
            const existing = fishPositions.find(f => (f.userId === (user?.userId || user?.id)));
            return {
              x: existing?.x || Math.random() * 80 + 10,
              y: existing?.y || Math.random() * 60 + 20,
              drift: existing?.drift || Math.random() * 2 - 1,
              direction: existing?.direction || (Math.random() > 0.5 ? 1 : -1),
              userId: user?.userId || user?.id,
              username: user?.username,
              fishEmoji: user?.fishEmoji || fishEmojis[i % fishEmojis.length],
              mood: user?.mood || "(・∀・)",
            };
          });
          setFishPositions(positions);
        },
        error: (err) => {
          console.error("User subscription error:", err);
        }
      });
    }

    // Set up real-time subscription for moods
    const moodSubscription = client.models.Mood.observeQuery().subscribe({
      next: (data) => {
        const moodMap = {};
        data.items.forEach((mood) => {
          moodMap[mood.userId] = mood.moodText;
        });
        setUserMoods(moodMap);
      },
      error: (err) => {
        console.error("Mood subscription error:", err);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
      if (moodSubscription) moodSubscription.unsubscribe();
    };
  }, [user, currentUser, myMood]);

  const loadData = async () => {
    try {
      const users = await dataHelpers.getOnlineUsers();
      // Ensure current user is included
      const allUsers = [...(users || [])];
      if (currentUser) {
        const currentUserInList = allUsers.find(u => (u.userId || u.id) === currentUser.userId);
        if (!currentUserInList) {
          // Add current user if not in list
          allUsers.push({
            id: currentUser.id,
            userId: currentUser.userId,
            username: currentUser.username,
            email: currentUser.email,
            fishEmoji: currentUser.fishEmoji,
            mood: myMood,
            isOnline: true,
          });
        }
      }
      setOnlineUsers(allUsers);
      
      // Set fish positions from loaded users (including current user)
      if (allUsers.length > 0) {
        const positions = allUsers.map((user, i) => {
          // Reuse existing position if fish already exists
          const existing = fishPositions.find(f => (f.userId === (user?.userId || user?.id)));
          return {
            x: existing?.x || Math.random() * 80 + 10,
            y: existing?.y || Math.random() * 60 + 20,
            drift: existing?.drift || Math.random() * 2 - 1,
            direction: existing?.direction || (Math.random() > 0.5 ? 1 : -1),
            userId: user?.userId || user?.id,
            username: user?.username,
            fishEmoji: user?.fishEmoji || fishEmojis[i % fishEmojis.length],
            mood: user?.mood || "(・∀・)",
          };
        });
        setFishPositions(positions);
      } else if (currentUser && currentUser.fishEmoji) {
        // If no other users, at least show current user
        setFishPositions([{
          x: 50,
          y: 50,
          drift: 0.5,
          direction: 1,
          userId: currentUser.id || currentUser.userId,
          username: currentUser.username,
          fishEmoji: currentUser.fishEmoji,
          mood: myMood,
        }]);
      }

      const moods = await dataHelpers.getRecentMoods();
      const moodMap = {};
      moods.forEach((mood) => {
        moodMap[mood.userId] = mood.moodText;
      });
      setUserMoods(moodMap);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Update mood
  const handleUpdateMood = async () => {
    if (!currentUser) {
      alert("Please log in");
      return;
    }
    if (!myMood.trim()) {
      alert("Please enter a mood");
      return;
    }

    try {
      console.log("Updating mood...", { userId: currentUser.id, mood: myMood });
      
      // Create mood entry
      await dataHelpers.updateMood(
        currentUser.id,
        currentUser.username,
        currentUser.fishEmoji || "🐡",
        myMood
      );

      // Update user's current mood in User model
      await dataHelpers.createOrUpdateUser(currentUser.id, {
        username: currentUser.username,
        email: currentUser.email,
        mood: myMood,
        isOnline: true,
      });

      console.log("Mood updated successfully");
      alert("Mood updated! 💭 Your thought bubble will appear above your fish!");
    } catch (error) {
      console.error("Error updating mood:", error);
      const errorMessage = error.message || error.toString() || "Unknown error";
      alert(`Failed to update mood: ${errorMessage}\n\nCheck console for details.`);
    }
  };

  // Gentle swimming motion
  useEffect(() => {
    const interval = setInterval(() => {
      setFishPositions((prev) =>
        prev.map((fish) => {
          let newX = fish.x + fish.drift * fish.direction * 0.2;
          if (newX < 10 || newX > 85) fish.direction *= -1;
          return { ...fish, x: newX };
        })
      );
    }, 300);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-700">Loading Fishbowl...</div>
      </div>
    );
  }

  // Get all users (active and inactive) for the friends list
  const allUsers = [...onlineUsers];
  const inactiveUsers = allUsers.filter((u) => !u.isOnline);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f5f5f5] text-gray-800 overflow-hidden p-6">
      {/* Header */}
      <h1
        className="text-6xl font-bold text-center mb-8"
        style={{
          fontFamily: "'Hatsukoi', 'Segoe UI', sans-serif",
          color: "#1a75d1",
          textShadow: "0 0 15px rgba(100,180,255,0.5)",
        }}
      >
        Fishbowl
      </h1>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-10 w-[95%] max-w-7xl">
        {/* Fishbowl container */}
        <div
          className="relative w-full lg:w-[65%] h-[500px] rounded-[40px] overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(to bottom, #64b3f4, #c2e59c)",
            opacity: 0.95,
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow:
              "inset 0 0 20px rgba(255,255,255,0.4), 0 10px 40px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Glassy highlight */}
          <div
            className="absolute top-0 left-0 w-full h-1/3 rounded-t-[40px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%)",
              mixBlendMode: "screen",
              filter: "blur(10px)",
            }}
          ></div>

          {/* Bubbles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`bubble-${i}`}
              className="absolute animate-bubble"
              style={{
                left: `${Math.random() * 95}%`,
                bottom: `${Math.random() * 80}px`,
                width: `${8 + Math.random() * 14}px`,
                aspectRatio: "1 / 1",
                background:
                  "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.9), rgba(255,255,255,0.1) 70%, transparent 100%)",
                borderRadius: "50%",
                filter: "blur(0.3px)",
                boxShadow:
                  "inset 0 0 4px rgba(255,255,255,0.7), 0 0 2px rgba(255,255,255,0.3)",
                opacity: 0.85,
                "--bubble-duration": `${15 + Math.random() * 15}s`,
                "--bubble-delay": `${Math.random() * 12}s`,
              }}
            ></div>
          ))}

          {/* Floating fish with thought bubbles - only show active users */}
          {fishPositions.length > 0 ? (
            fishPositions
              .filter((fish) => fish.userId) // Only show users with IDs
              .map((fish, i) => {
                const moodText = userMoods[fish.userId] || fish.mood || "(・∀・)";
                return (
                  <div
                    key={fish.userId || `fish-${i}`}
                    className="absolute transition-all duration-500 ease-in-out flex flex-col items-center z-10"
                    style={{
                      left: `${fish.x}%`,
                      top: `${fish.y}%`,
                    }}
                  >
                    {/* Thought bubble with mood */}
                    <div className="mb-1 relative">
                      <div className="px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200 whitespace-nowrap">
                        <span className="text-xs font-medium text-gray-800">💭 {moodText}</span>
                      </div>
                      {/* Bubble tail */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white/90 border-r-2 border-b-2 border-blue-200 rotate-45"></div>
                    </div>
                    <span
                      className="text-5xl cursor-pointer hover:scale-110 transition-transform"
                      style={{ filter: "drop-shadow(0 0 8px rgba(255,255,150,0.9))" }}
                      title={`@${fish.username || 'user'}`}
                    >
                      {fish.fishEmoji || "🐠"}
                    </span>
                    <span className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/60 backdrop-blur-sm text-gray-700 font-medium">
                      @{fish.username || 'user'}
                    </span>
                  </div>
                );
              })
          ) : currentUser && currentUser.fishEmoji ? (
            // Show current user even if no other users
            <div
              className="absolute transition-all duration-500 ease-in-out flex flex-col items-center z-10"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="mb-1 relative">
                <div className="px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-800">💭 {myMood}</span>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white/90 border-r-2 border-b-2 border-blue-200 rotate-45"></div>
              </div>
              <span
                className="text-5xl cursor-pointer hover:scale-110 transition-transform"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,255,150,0.9))" }}
                title={`@${currentUser.username || 'you'}`}
              >
                {currentUser.fishEmoji}
              </span>
              <span className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/60 backdrop-blur-sm text-gray-700 font-medium">
                @{currentUser.username || 'you'}
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <p className="text-lg">No fish swimming yet... 🐠</p>
            </div>
          )}
        </div>

        {/* Right panels */}
        <div className="flex flex-col gap-6 w-full lg:w-[30%]">
          {/* User panel */}
          <div
            className="w-full p-6 rounded-3xl text-center shadow-lg"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(245,245,245,0.5))",
              border: "1px solid rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="text-6xl mb-2">
              {currentUser?.fishEmoji || "🐡"}
            </span>
            <h2 className="font-semibold text-lg text-blue-700 mb-4">
              @{currentUser?.username || "you"}
            </h2>
            <input
              type="text"
              placeholder="(・∀・)"
              value={myMood}
              onChange={(e) => setMyMood(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUpdateMood()}
              className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-sm text-center outline-none placeholder:text-gray-600 mb-3 w-full"
              style={{
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "inset 0 0 6px rgba(255,255,255,0.6)",
              }}
            />
            <button
              onClick={handleUpdateMood}
              className="px-4 py-2 rounded-full font-medium text-blue-700 hover:scale-105 transition w-full"
              style={{
                background: "linear-gradient(145deg, #dff0ff, #eaf8ff)",
                boxShadow:
                  "inset 0 1px 3px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Update Mood
            </button>
          </div>

          {/* Active friends panel */}
          <div
            className="w-full max-h-[500px] overflow-y-auto p-4 rounded-3xl shadow-lg"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.85), rgba(245,245,245,0.5))",
              border: "1px solid rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3 className="font-semibold text-blue-700 mb-3 text-center">
              Active Friends ({onlineUsers.length})
            </h3>
            <div className="flex flex-col gap-3">
              {onlineUsers.length === 0 ? (
                <p className="text-gray-500 text-center text-sm">
                  No friends online yet. Invite them to join! 🐠
                </p>
              ) : (
                onlineUsers.map((friend) => {
                  const friendId = friend.userId || friend.id;
                  return (
                    <div
                      key={friendId || friend.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition"
                    >
                      <span className="text-2xl">{friend.fishEmoji || "🐠"}</span>
                      <div className="flex-1">
                        <span className="font-medium">@{friend.username || "user"}</span>
                        {(userMoods[friendId] || friend.mood) && (
                          <p className="text-xs text-gray-600">
                            {userMoods[friendId] || friend.mood}
                          </p>
                        )}
                      </div>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                  );
                })
              )}
              {/* Show inactive friends (greyed out) */}
              {inactiveUsers.length > 0 && (
                <>
                  <div className="border-t border-gray-300 my-2"></div>
                  <h4 className="text-xs text-gray-500 mb-2">Inactive</h4>
                  {inactiveUsers.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 p-2 rounded-xl filter grayscale opacity-40"
                    >
                      <span className="text-2xl">{friend.fishEmoji || "🐠"}</span>
                      <span className="font-medium">@{friend.username}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
