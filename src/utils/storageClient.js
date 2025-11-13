import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export const storageHelpers = {
  async uploadMedia(file, userId, mediaType) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const path = `media/${userId}/${fileName}`;
      
      const result = await uploadData({
        key: path,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      // Get the public URL - use longer expiration for posts
      const url = await getUrl({
        key: path,
        options: {
          expiresIn: 31536000, // 1 year for posts
        },
      });

      return {
        url: url.url.toString(),
        key: path,
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

