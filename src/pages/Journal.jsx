import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "../utils/dataClient";
import { Trash2, Search, Tag } from "lucide-react";

export default function Journal({ user }) {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const authUser = await getCurrentUser();
        setCurrentUser({ id: authUser.userId });
        await loadEntries();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (user) init();
  }, [user]);

  const loadEntries = async () => {
    if (!currentUser) return;

    try {
      const allEntries = await client.models.JournalEntry.list({
        filter: { userId: { eq: currentUser.id } },
        sortDirection: "DESC",
      });
      setEntries(allEntries.data);

      // Extract all unique tags
      const tagSet = new Set();
      allEntries.data.forEach((entry) => {
        if (entry.tags) {
          entry.tags.forEach((tag) => tagSet.add(tag));
        }
      });
      setAllTags(Array.from(tagSet));
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  };

  useEffect(() => {
    if (currentUser) loadEntries();
  }, [currentUser]);

  const saveEntry = async () => {
    if (!content.trim() || !currentUser) return;

    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await client.models.JournalEntry.create({
        userId: currentUser.id,
        title: title || null,
        content,
        tags: tagArray.length > 0 ? tagArray : null,
      });

      setTitle("");
      setContent("");
      setTags("");
      await loadEntries();
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry");
    }
  };

  const deleteEntry = async (entryId) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await client.models.JournalEntry.delete({ id: entryId });
      await loadEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || entry.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6">Personal Journal 📔</h1>

      {/* Search and Filter */}
      <div className="bg-white/80 rounded-xl p-4 mb-4 shadow-md">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 outline-none"
            />
          </div>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/80 outline-none"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* New Entry Form */}
      <div className="bg-white/80 rounded-xl p-4 mb-6 shadow-md">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/80 outline-none mb-3"
        />
        <textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-3 rounded-lg bg-white/80 outline-none mb-3"
        />
        <div className="flex gap-2 mb-3">
          <Tag size={20} className="text-gray-400 mt-2" />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-white/80 outline-none"
          />
        </div>
        <button
          onClick={saveEntry}
          className="w-full px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Save Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No entries yet. Start writing! 📝</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white/80 rounded-xl p-4 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {entry.title && (
                    <h3 className="font-semibold text-lg mb-2">{entry.title}</h3>
                  )}
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
              <p className="mb-3 whitespace-pre-wrap">{entry.content}</p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, i) => (
                    <span
                      key={i}
                      onClick={() => setFilterTag(tag)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs cursor-pointer hover:bg-blue-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
