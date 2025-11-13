import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

export const storageHelpers = {
  async uploadMedia(file, userId, mediaType) {
    try {
      // Get identity ID from auth session - this is the Cognito Identity ID
      const session = await fetchAuthSession({ forceRefresh: true });
      const identityId = session.identityId;
      
      if (!identityId) {
        throw new Error('Identity ID not available. User must be authenticated.');
      }
      
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      // Use identity ID in path - Amplify will handle the substitution
      // The path pattern in storage resource is: media/{entity_id}/*
      // So we use: media/{identityId}/filename
      const path = `media/${identityId}/${fileName}`;
      
      console.log('Uploading to path:', path);
      
      const result = await uploadData({
        key: path,
        data: file,
        options: {
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const percentage = ((transferredBytes / totalBytes) * 100).toFixed(0);
              console.log(`Upload progress: ${percentage}%`);
            }
          },
        },
      }).result;

      console.log('Upload result:', result);

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
      console.error('Error name:', error.name);
      if (error.errors) {
        console.error('Error errors:', error.errors);
      }
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

