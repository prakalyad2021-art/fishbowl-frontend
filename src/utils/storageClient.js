import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export const storageHelpers = {
  async uploadMedia(file, userId, mediaType) {
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const result = await uploadData({
        key: `media/${fileName}`,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      // Get the public URL
      const url = await getUrl({
        key: `media/${fileName}`,
        options: {
          expiresIn: 3600, // 1 hour
        },
      });

      return {
        url: url.url.toString(),
        key: `media/${fileName}`,
        type: mediaType,
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  },

  async deleteMedia(key) {
    try {
      await remove({ key });
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  },

  async getMediaUrl(key) {
    try {
      const url = await getUrl({
        key,
        options: {
          expiresIn: 3600,
        },
      });
      return url.url.toString();
    } catch (error) {
      console.error('Error getting media URL:', error);
      throw error;
    }
  },
};

