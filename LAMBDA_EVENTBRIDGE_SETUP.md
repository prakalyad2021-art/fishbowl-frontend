# 🗓️ Lambda + EventBridge Setup for Calendar Reminders

## ✅ Lambda Function Created

The `calendarReminder` Lambda function has been created in:
- `amplify/functions/calendarReminder/`

This function will:
1. Check for calendar events happening today
2. Find events where `reminderSent = false`
3. Send reminders to tagged users
4. Update `reminderSent = true` after sending

## 🔧 Setting Up EventBridge Schedule

After deploying the backend, set up the EventBridge rule manually:

### Option 1: AWS Console (Easiest)

1. **Go to Amazon EventBridge Console**
   - Navigate to: https://console.aws.amazon.com/events/
   - Click "Rules" in the left sidebar

2. **Create a New Rule**
   - Click "Create rule"
   - Name: `daily-calendar-reminder`
   - Description: `Daily reminder check for calendar events`

3. **Define Schedule**
   - Select "Schedule"
   - Choose "Cron-based schedule"
   - Cron expression: `0 9 * * ? *` (9 AM UTC daily)
   - Or use "Rate-based schedule": `1 day`

4. **Set Target**
   - Target type: "AWS service"
   - Select a target: "Lambda function"
   - Function: `calendarReminder` (or the full function name from your deployment)

5. **Configure**
   - Click "Create"

### Option 2: AWS CLI

```bash
aws events put-rule \
  --name daily-calendar-reminder \
  --schedule-expression "cron(0 9 * * ? *)" \
  --description "Daily reminder check for calendar events"

aws lambda add-permission \
  --function-name calendarReminder \
  --statement-id allow-eventbridge \
  --action 'lambda:InvokeFunction' \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:us-east-1:YOUR_ACCOUNT_ID:rule/daily-calendar-reminder

aws events put-targets \
  --rule daily-calendar-reminder \
  --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:calendarReminder"
```

## 📝 Lambda Function Details

**Location:** `amplify/functions/calendarReminder/handler.ts`

**What it does:**
- Runs daily at 9 AM UTC
- Queries DynamoDB for events happening today
- Sends reminders to tagged users
- Updates event status

**Next Steps:**
After the backend is deployed, you can enhance the Lambda to:
1. Query AppSync GraphQL API for CalendarEvent
2. Send email notifications via SES
3. Send push notifications via SNS
4. Update DynamoDB records

## 🚀 Deploy

The Lambda function will be deployed automatically when you run:
```bash
npx ampx sandbox
```

Or when Amplify Console detects the `amplify/functions/` folder.

## ✅ Verification

After setup:
1. Check EventBridge rule is enabled
2. Check Lambda function exists
3. Test manually: Invoke Lambda from console
4. Check CloudWatch logs for execution

---

**Status:** Lambda function created ✅  
**Next:** Deploy backend and configure EventBridge rule


