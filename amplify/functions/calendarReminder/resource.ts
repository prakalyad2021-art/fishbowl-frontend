import { defineFunction } from '@aws-amplify/backend';

export const calendarReminder = defineFunction({
  name: 'calendarReminder',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
});

