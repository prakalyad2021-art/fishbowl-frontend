import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import { Calendar as CalendarIcon, Users, Trash2, Bell } from "lucide-react";

export default function Calendar({ user }) {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    taggedUsers: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const init = async () => {
      try {
        const authUser = await getCurrentUser();
        const email = user?.attributes?.email || authUser.signInDetails?.loginId || "";
        const username = email ? email.split('@')[0] : (user?.username || "user");
        setCurrentUser({ id: authUser.userId, username });
        await loadEvents();
        await loadUsers();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (user) init();
  }, [user]);

  const loadEvents = async () => {
    try {
      const allEvents = await client.models.CalendarEvent.list({
        sortDirection: "ASC",
      });
      setEvents(allEvents.data);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const users = await client.models.User.list();
      setAllUsers(users.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.eventDate || !currentUser) return;

    try {
      await client.models.CalendarEvent.create({
        title: newEvent.title,
        description: newEvent.description || null,
        eventDate: newEvent.eventDate,
        eventTime: newEvent.eventTime || null,
        createdBy: currentUser.id,
        createdByUsername: currentUser.username,
        taggedUsers: newEvent.taggedUsers,
        reminderSent: false,
      });

      setNewEvent({
        title: "",
        description: "",
        eventDate: "",
        eventTime: "",
        taggedUsers: [],
      });
      await loadEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!confirm("Delete this event?")) return;
    try {
      await client.models.CalendarEvent.delete({ id: eventId });
      await loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const toggleTagUser = (userId) => {
    // Use userId from User model (not the DynamoDB id)
    const userToTag = allUsers.find(u => u.id === userId);
    const tagId = userToTag?.userId || userId; // Use userId field if available, fallback to id
    
    setNewEvent({
      ...newEvent,
      taggedUsers: newEvent.taggedUsers.includes(tagId)
        ? newEvent.taggedUsers.filter((id) => id !== tagId)
        : [...newEvent.taggedUsers, tagId],
    });
  };

  const filteredEvents = events.filter((e) => {
    if (!selectedDate) return true;
    return e.eventDate === selectedDate;
  });

  // Real-time subscription
  useEffect(() => {
    const subscription = client.models.CalendarEvent.observeQuery().subscribe({
      next: (data) => {
        setEvents(data.items);
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6">Shared Calendar 📅</h1>

      {/* Create Event Form */}
      <div className="bg-white/80 rounded-xl p-4 mb-6 shadow-md">
        <input
          type="text"
          placeholder="Event title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-white/80 outline-none mb-3"
        />
        <textarea
          placeholder="Description (optional)"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="w-full h-20 p-3 rounded-lg bg-white/80 outline-none mb-3"
        />
        <div className="flex gap-2 mb-3">
          <input
            type="date"
            value={newEvent.eventDate}
            onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
            className="flex-1 px-3 py-2 rounded-lg bg-white/80 outline-none"
          />
          <input
            type="time"
            value={newEvent.eventTime}
            onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })}
            className="px-3 py-2 rounded-lg bg-white/80 outline-none"
          />
        </div>

        {/* Tag Users */}
        {allUsers.length > 0 && (
          <div className="mb-3">
            <label className="text-sm text-gray-600 mb-2 block">Tag Users:</label>
            <div className="flex flex-wrap gap-2">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => toggleTagUser(u.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    newEvent.taggedUsers.includes(u.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  @{u.username}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={createEvent}
          className="w-full px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Create Event
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white/80 rounded-xl p-4 mb-6 shadow-md">
        <label className="text-sm text-gray-600 mb-2 block">Filter by Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/80 outline-none"
        />
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No events on this date. Create one! 📅</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white/80 rounded-xl p-4 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon size={20} className="text-blue-500" />
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.eventDate} {event.eventTime && `at ${event.eventTime}`}
                  </p>
                  {event.description && <p className="mb-2">{event.description}</p>}
                  <p className="text-xs text-gray-500">
                    Created by @{event.createdByUsername}
                  </p>
                  {event.taggedUsers && event.taggedUsers.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-600">
                        Tagged: {event.taggedUsers.length} user(s)
                      </span>
                      {!event.reminderSent && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <Bell size={12} />
                          Reminder pending
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {event.createdBy === currentUser?.id && (
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
