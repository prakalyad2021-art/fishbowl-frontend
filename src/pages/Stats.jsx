import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Stats({ user }) {
  const [stats, setStats] = useState([]);
  const [summary, setSummary] = useState({
    moodCheckIns: 0,
    mediaShared: 0,
    activeDays: 0,
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const authUser = await getCurrentUser();
        setCurrentUser({ id: authUser.userId });
        await loadStats();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (user) init();
  }, [user]);

  const loadStats = async () => {
    if (!currentUser) return;

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];

      // Get user stats
      const userStats = await client.models.UserStats.list({
        filter: {
          userId: { eq: currentUser.id },
          date: { between: [startDate, endDate] },
        },
      });

      // Get moods
      const moods = await client.models.Mood.list({
        filter: { userId: { eq: currentUser.id } },
      });

      // Get media posts
      const media = await client.models.MediaPost.list({
        filter: { userId: { eq: currentUser.id } },
      });

      // Process stats
      const statsMap = {};
      userStats.data.forEach((stat) => {
        statsMap[stat.date] = stat;
      });

      // Fill in missing days and calculate
      const chartData = [];
      let activeDays = 0;
      let totalMoods = 0;
      let totalMedia = 0;

      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const dayMoods = moods.data.filter(
          (m) => new Date(m.createdAt).toISOString().split("T")[0] === dateStr
        ).length;
        const dayMedia = media.data.filter(
          (m) => new Date(m.createdAt).toISOString().split("T")[0] === dateStr
        ).length;

        if (dayMoods > 0 || dayMedia > 0) activeDays++;
        totalMoods += dayMoods;
        totalMedia += dayMedia;

        chartData.push({
          date: dateStr.split("-").slice(1).join("/"),
          moodCheckIns: dayMoods,
          mediaShared: dayMedia,
        });
      }

      setStats(chartData);
      setSummary({
        moodCheckIns: totalMoods,
        mediaShared: totalMedia,
        activeDays,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    if (currentUser) loadStats();
  }, [currentUser]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6 text-center">My Stats 📊</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 rounded-xl p-4 text-center shadow-md">
          <div className="text-3xl font-bold text-blue-600">{summary.moodCheckIns}</div>
          <div className="text-sm text-gray-600">Mood Check-Ins</div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 text-center shadow-md">
          <div className="text-3xl font-bold text-blue-600">{summary.mediaShared}</div>
          <div className="text-sm text-gray-600">Media Shared</div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 text-center shadow-md">
          <div className="text-3xl font-bold text-blue-600">{summary.activeDays}</div>
          <div className="text-sm text-gray-600">Active Days</div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Line Chart - Mood Check-Ins */}
        <div className="bg-white/80 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Mood Check-Ins (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="moodCheckIns"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Check-Ins"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Media Shared */}
        <div className="bg-white/80 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Media Shared (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="mediaShared" fill="#3b82f6" name="Media Posts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
