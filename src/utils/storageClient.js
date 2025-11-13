import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

export const storageHelpers = {
  async uploadMedia(file, userId, mediaType) {
    try {
      // Get identity ID from auth session
      const session = await fetchAuthSession();
      const identityId = session.identityId || userId; // Fallback to userId if identityId not available
      
      const fileName = `${Date.now()}_${file.name}`;
      // Use identity ID in path to match storage resource pattern: media/{entity_id}/*
      const path = `media/${identityId}/${fileName}`;
      
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
      console.error('Error details:', error.message, error.stack);
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

