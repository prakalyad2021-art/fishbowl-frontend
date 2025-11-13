import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/react/build-a-backend/storage
 */
export const storage = defineStorage({
  name: 'fishbowlMedia',
  access: (allow: any) => ({
    'media/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write']), // Allow authenticated users to write
    ],
    'media/*': [
      allow.authenticated.to(['read']), // Allow reading all media
    ],
  }),
});

