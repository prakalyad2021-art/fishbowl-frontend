import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import { Calendar as CalendarIcon, Users, Trash2, Bell, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

export default function Calendar({ user }) {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    taggedUsers: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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
    if (!newEvent.title || !newEvent.eventDate || !currentUser) {
      alert("Please fill in event title and date");
      return;
    }

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
      setShowEventModal(false);
      setSelectedDate(null);
      await loadEvents();
      alert("Event created successfully! 📅");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!confirm("Delete this event?")) return;
    try {
      console.log("Deleting event:", eventId);
      await client.models.CalendarEvent.delete({ id: eventId });
      setShowEventDetails(false);
      setSelectedEvent(null);
      // Wait a bit for the delete to propagate
      setTimeout(async () => {
        await loadEvents();
      }, 500);
    } catch (error) {
      console.error("Error deleting event:", error);
      console.error("Error details:", error.message, error.errors);
      alert(`Failed to delete event: ${error.message || "Unknown error"}`);
    }
  };

  const toggleTagUser = (userId) => {
    const userToTag = allUsers.find(u => u.id === userId);
    const tagId = userToTag?.userId || userId;
    
    setNewEvent({
      ...newEvent,
      taggedUsers: newEvent.taggedUsers.includes(tagId)
        ? newEvent.taggedUsers.filter((id) => id !== tagId)
        : [...newEvent.taggedUsers, tagId],
    });
  };

  // Calendar grid functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return events.filter(e => e.eventDate === dateStr);
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const dateStr = date.toISOString().split("T")[0];
    setSelectedDate(dateStr);
    setNewEvent({
      ...newEvent,
      eventDate: dateStr,
    });
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

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
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-blue-700">Shared Calendar 📅</h1>
          <button
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              setSelectedDate(today);
              setNewEvent({
                title: "",
                description: "",
                eventDate: today,
                eventTime: "",
                taggedUsers: [],
              });
              setShowEventModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus size={20} />
            New Event
          </button>
        </div>

        {/* Calendar Grid - Google Calendar Style */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Month Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              const dateEvents = getEventsForDate(date);
              const isCurrentDay = isToday(date);

  return (
                <div
                  key={index}
                  className={`min-h-[100px] border-r border-b border-gray-200 p-2 ${
                    !date ? "bg-gray-50" : "bg-white hover:bg-blue-50/30 cursor-pointer"
                  } transition`}
                  onClick={() => handleDateClick(date)}
                >
                  {date && (
                    <>
                      <div
                        className={`text-sm font-semibold mb-1 ${
                          isCurrentDay
                            ? "bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                            : "text-gray-700"
                        }`}
                      >
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dateEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded truncate hover:bg-blue-200 cursor-pointer"
                            title={event.title}
                          >
                            {event.eventTime ? `${event.eventTime.split(':').slice(0, 2).join(':')} ` : ""}
                            {event.title}
                          </div>
                        ))}
                        {dateEvents.length > 3 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dateEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-semibold text-xl">Create New Event</h2>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedDate(null);
                    setNewEvent({
                      title: "",
                      description: "",
                      eventDate: "",
                      eventTime: "",
                      taggedUsers: [],
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Add description (optional)"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full min-h-[100px] px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
        <input
          type="date"
                      value={newEvent.eventDate}
                      onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
        <input
                      type="time"
                      value={newEvent.eventTime}
                      onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                </div>

                {allUsers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tag Users (for reminders)
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                      {allUsers.map((u) => {
                        const userToTag = allUsers.find(usr => usr.id === u.id);
                        const tagId = userToTag?.userId || u.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => toggleTagUser(u.id)}
                            className={`px-3 py-1 rounded-full text-sm transition ${
                              newEvent.taggedUsers.includes(tagId)
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            @{u.username}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedDate(null);
                      setNewEvent({
                        title: "",
                        description: "",
                        eventDate: "",
                        eventTime: "",
                        taggedUsers: [],
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createEvent}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-semibold text-xl">Event Details</h2>
        <button
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
        </button>
      </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon size={20} className="text-blue-500" />
                    <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedEvent.eventDate} {selectedEvent.eventTime && `at ${selectedEvent.eventTime}`}
                  </p>
                  {selectedEvent.description && (
                    <p className="text-gray-700 mb-2">{selectedEvent.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Created by @{selectedEvent.createdByUsername}
                  </p>
                </div>

                {selectedEvent.taggedUsers && selectedEvent.taggedUsers.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Tagged: {selectedEvent.taggedUsers.length} user(s)
                    </span>
                    {!selectedEvent.reminderSent && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <Bell size={12} />
                        Reminder pending
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {selectedEvent.createdBy === currentUser?.id && (
                    <button
                      onClick={() => deleteEvent(selectedEvent.id)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 size={18} className="inline mr-2" />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowEventDetails(false);
                      setSelectedEvent(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
