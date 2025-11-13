import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via Cognito can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      email: a.string().required(),
      fishEmoji: a.string(),
      mood: a.string(),
      isOnline: a.boolean(),
      lastSeen: a.datetime(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(['read', 'update']),
      allow.owner().to(['read', 'update', 'delete']),
    ]),

  Message: a
    .model({
      content: a.string().required(),
      senderId: a.id().required(),
      senderUsername: a.string().required(),
      senderFishEmoji: a.string(),
      mediaUrl: a.string(),
      mediaType: a.string(), // 'image', 'video', 'gif', 'audio'
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
    ]),

  Mood: a
    .model({
      userId: a.id().required(),
      username: a.string().required(),
      fishEmoji: a.string(),
      moodText: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
    ]),

  Prompt: a
    .model({
      promptText: a.string().required(),
      date: a.date().required(),
      responses: a.hasMany('PromptResponse', 'promptId'),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(['read']),
    ]),

  PromptResponse: a
    .model({
      prompt: a.belongsTo('Prompt', 'promptId'),
      promptId: a.id().required(),
      userId: a.id().required(),
      username: a.string().required(),
      responseText: a.string().required(),
      createdAt: a.datetime(),
      expiresAt: a.datetime(), // 24 hours from creation
    })
    .authorization((allow: any) => [
      allow.authenticated().to(['read', 'create']),
      allow.owner().to(['delete']),
    ]),

  MediaPost: a
    .model({
      userId: a.id().required(),
      username: a.string().required(),
      fishEmoji: a.string(),
      mediaUrl: a.string().required(),
      mediaType: a.string().required(), // 'photo', 'video', 'gif', 'audio', 'embed'
      caption: a.string(),
      comments: a.hasMany('MediaComment', 'mediaPostId'),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
      allow.owner().to(['delete']),
    ]),

  MediaComment: a
    .model({
      mediaPost: a.belongsTo('MediaPost', 'mediaPostId'),
      mediaPostId: a.id().required(),
      userId: a.id().required(),
      username: a.string().required(),
      commentText: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(['read', 'create']),
      allow.owner().to(['delete']),
    ]),

  JournalEntry: a
    .model({
      userId: a.id().required(),
      title: a.string(),
      content: a.string().required(),
      tags: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
    ]),

  CalendarEvent: a
    .model({
      title: a.string().required(),
      description: a.string(),
      eventDate: a.date().required(),
      eventTime: a.time(),
      createdBy: a.id().required(),
      createdByUsername: a.string().required(),
      taggedUsers: a.id().array(), // User IDs tagged in event
      reminderSent: a.boolean(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
      allow.owner().to(['update', 'delete']),
    ]),

  UserStats: a
    .model({
      userId: a.id().required(),
      date: a.date().required(),
      moodCheckIns: a.integer(),
      mediaShared: a.integer(),
      isActive: a.boolean(),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/react/build-a-backend/data/connect-to-API
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client in your components
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this code in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>

