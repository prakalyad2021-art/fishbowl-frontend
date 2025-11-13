import { generateClient } from 'aws-amplify/data';

export const client = generateClient();

// Helper functions for common operations
export const dataHelpers = {
  // User operations
  async createOrUpdateUser(userId, userData) {
    try {
      // First try to find by userId
      const existing = await client.models.User.list({
        filter: { userId: { eq: userId } },
      });
      
      if (existing.data.length > 0) {
        // User exists - update but preserve fishEmoji if not provided
        const updateData = { ...userData };
        // Don't overwrite fishEmoji if it's not in userData (to prevent changing it)
        if (!('fishEmoji' in userData) && existing.data[0].fishEmoji) {
          updateData.fishEmoji = existing.data[0].fishEmoji;
        }
        const updated = await client.models.User.update({
          id: existing.data[0].id,
          userId: userId,
          ...updateData,
          isOnline: true,
          lastSeen: new Date().toISOString(),
        });
        return updated;
      } else {
        // Create new user with userId
        const created = await client.models.User.create({
          userId: userId,
          ...userData,
          isOnline: true,
          lastSeen: new Date().toISOString(),
        });
        return created;
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  async getOnlineUsers() {
    try {
      const users = await client.models.User.list({
        filter: { isOnline: { eq: true } },
      });
      return users.data || [];
    } catch (error) {
      console.error('Error fetching online users:', error);
      return [];
    }
  },

  // Message operations
  async sendMessage(messageData) {
    try {
      return await client.models.Message.create({
        ...messageData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async getMessages() {
    try {
      const messages = await client.models.Message.list({
        sortDirection: 'ASC',
      });
      return messages.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Mood operations
  async updateMood(userId, username, fishEmoji, moodText) {
    try {
      return await client.models.Mood.create({
        userId,
        username,
        fishEmoji,
        moodText,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating mood:', error);
      throw error;
    }
  },

  async getRecentMoods() {
    try {
      const moods = await client.models.Mood.list({
        sortDirection: 'DESC',
        limit: 50,
      });
      return moods.data;
    } catch (error) {
      console.error('Error fetching moods:', error);
      return [];
    }
  },

  // Media operations
  async createMediaPost(postData) {
    try {
      return await client.models.MediaPost.create({
        ...postData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating media post:', error);
      throw error;
    }
  },

  async getMediaPosts() {
    try {
      const posts = await client.models.MediaPost.list({
        sortDirection: 'DESC',
      });
      return posts.data;
    } catch (error) {
      console.error('Error fetching media posts:', error);
      return [];
    }
  },

  async deleteMediaPost(postId) {
    try {
      return await client.models.MediaPost.delete({ id: postId });
    } catch (error) {
      console.error('Error deleting media post:', error);
      throw error;
    }
  },

  // Journal operations
  async createJournalEntry(entryData) {
    try {
      return await client.models.JournalEntry.create({
        ...entryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  },

  async getJournalEntries(userId) {
    try {
      const entries = await client.models.JournalEntry.list({
        filter: { userId: { eq: userId } },
        sortDirection: 'DESC',
      });
      return entries.data;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  },

  async deleteJournalEntry(entryId) {
    try {
      return await client.models.JournalEntry.delete({ id: entryId });
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  },

  // Calendar operations
  async createCalendarEvent(eventData) {
    try {
      return await client.models.CalendarEvent.create(eventData);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },

  async getCalendarEvents() {
    try {
      const events = await client.models.CalendarEvent.list({
        sortDirection: 'ASC',
      });
      return events.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  },

  // Stats operations
  async updateUserStats(userId, date, statsData) {
    try {
      const existing = await client.models.UserStats.list({
        filter: {
          userId: { eq: userId },
          date: { eq: date },
        },
      });

      if (existing.data.length > 0) {
        return await client.models.UserStats.update({
          id: existing.data[0].id,
          ...statsData,
        });
      } else {
        return await client.models.UserStats.create({
          userId,
          date,
          ...statsData,
        });
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },

  async getUserStats(userId, startDate, endDate) {
    try {
      const stats = await client.models.UserStats.list({
        filter: {
          userId: { eq: userId },
          date: { between: [startDate, endDate] },
        },
        sortDirection: 'ASC',
      });
      return stats.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return [];
    }
  },
};

