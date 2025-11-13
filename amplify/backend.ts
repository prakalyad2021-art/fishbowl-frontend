import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { calendarReminder } from './functions/calendarReminder/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
  calendarReminder,
});

// Add EventBridge schedule for daily calendar reminders
// Runs daily at 9 AM UTC to check for events and send reminders
// Note: EventBridge schedule will be configured via AWS Console or CDK
// The Lambda function is ready - configure the schedule in AWS Console:
// 1. Go to EventBridge → Rules → Create rule
// 2. Schedule: cron(0 9 * * ? *) - 9 AM UTC daily
// 3. Target: calendarReminder Lambda function

