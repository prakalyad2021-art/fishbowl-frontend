# 🐠 Fishbowl App - AWS Services Used

## Complete List of AWS Services (10 Services)

### 1. **AWS Amplify Hosting** 🌐
- **Purpose**: Hosts the React frontend application
- **Usage**: Continuous deployment from GitHub, automatic builds
- **Location**: `amplify.yml` - build configuration
- **URL**: `main.ddnqhb2lupx6m.amplifyapp.com`
- **Free Tier**: ✅ Yes (5GB storage, 15GB transfer/month)

### 2. **Amazon Cognito** 🔐
- **Purpose**: User authentication and authorization
- **Components Used**:
  - **Cognito User Pool**: User sign-up, sign-in, password management
  - **Cognito Identity Pool**: Provides AWS credentials for authenticated users
- **Location**: `amplify/auth/resource.ts`
- **Features**:
  - Email-based authentication
  - Password policy enforcement
  - Session management
- **Free Tier**: ✅ Yes (50,000 MAU free)

### 3. **AWS AppSync** 📡
- **Purpose**: GraphQL API for real-time data synchronization
- **Usage**: 
  - Real-time subscriptions (user presence, messages, moods)
  - CRUD operations for all data models
  - Automatic schema generation from `amplify/data/resource.ts`
- **Location**: `amplify/data/resource.ts`
- **Models**: User, Message, Mood, Prompt, PromptResponse, MediaPost, MediaComment, JournalEntry, CalendarEvent, UserStats
- **Free Tier**: ✅ Yes (250,000 queries/month)

### 4. **Amazon DynamoDB** 💾
- **Purpose**: NoSQL database for all application data
- **Usage**: 
  - Auto-provisioned by AppSync for each GraphQL model
  - Stores: users, messages, moods, prompts, media posts, journal entries, calendar events, stats
- **Tables Created**: 10 tables (one per model)
- **Location**: Auto-created via AppSync
- **Free Tier**: ✅ Yes (25GB storage, 25 read/write units)

### 5. **Amazon S3** 📦
- **Purpose**: Object storage for media files (photos, videos, audio, GIFs)
- **Bucket Name**: `amplify-fishbowlfrontend--fishbowlmediabucket557c1-9wgbrqy5cyz8`
- **Usage**: 
  - User-uploaded media files
  - Path structure: `media/{identity_id}/filename`
  - Access control via IAM policies
- **Location**: `amplify/storage/resource.ts`, `src/utils/storageClient.js`
- **Free Tier**: ✅ Yes (5GB storage, 20,000 GET requests, 2,000 PUT requests)

### 6. **AWS Lambda** ⚡
- **Purpose**: Serverless function for calendar event reminders
- **Function Name**: `calendarReminder`
- **Usage**: 
  - Scheduled daily to check for calendar events
  - Sends reminders to tagged users
  - Queries DynamoDB for events
- **Location**: `amplify/functions/calendarReminder/handler.ts`
- **Runtime**: Node.js
- **Free Tier**: ✅ Yes (1M requests/month, 400,000 GB-seconds)

### 7. **Amazon EventBridge** ⏰
- **Purpose**: Event-driven scheduling for Lambda function
- **Usage**: 
  - Triggers calendar reminder Lambda daily at 9 AM UTC
  - Cron expression: `cron(0 9 * * ? *)`
- **Status**: Configured via AWS Console (manual setup)
- **Location**: `amplify/backend.ts` (commented instructions)
- **Free Tier**: ✅ Yes (14M custom events/month)

### 8. **AWS CloudWatch** 📊
- **Purpose**: Logging and monitoring
- **Usage**: 
  - Automatic logging for Lambda functions
  - AppSync API logging
  - Error tracking and debugging
- **Location**: Automatic with all services
- **Free Tier**: ✅ Yes (5GB ingestion, 5GB storage)

### 9. **AWS IAM** 🔑
- **Purpose**: Identity and Access Management
- **Usage**: 
  - Manages permissions for authenticated users
  - S3 bucket access policies
  - Lambda execution roles
  - AppSync authorization
- **Location**: Auto-configured by Amplify
- **Free Tier**: ✅ Yes (always free)

### 10. **AWS Amplify Console** 🚀
- **Purpose**: CI/CD pipeline and backend management
- **Usage**: 
  - Automatic builds from GitHub
  - Backend resource management
  - Environment configuration
- **Location**: `amplify.yml`, `amplify/backend.ts`
- **Free Tier**: ✅ Yes (included with Amplify Hosting)

---

## Service Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              AWS Amplify Hosting (Frontend)             │
│         React App (main.ddnqhb2lupx6m.amplifyapp.com)   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐            ┌─────▼─────┐
    │ Cognito │            │  AppSync  │
    │  Auth   │            │  GraphQL  │
    └────┬────┘            └─────┬─────┘
         │                       │
         │              ┌────────┴────────┐
         │              │                 │
    ┌────▼────┐   ┌────▼────┐    ┌──────▼──────┐
    │Identity │   │DynamoDB │    │     S3      │
    │  Pool   │   │  Tables  │    │   Storage   │
    └─────────┘   └──────────┘    └─────────────┘
                           
    ┌──────────────────────────────────────┐
    │  EventBridge → Lambda (Reminders)    │
    └──────────────────────────────────────┘
    
    ┌──────────────────────────────────────┐
    │  CloudWatch (Logging & Monitoring)  │
    └──────────────────────────────────────┘
    
    ┌──────────────────────────────────────┐
    │  IAM (Permissions & Access Control)  │
    └──────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. **User Authentication Flow**
```
User → Cognito User Pool → Identity Pool → IAM Credentials → Access AWS Services
```

### 2. **Real-time Chat Flow**
```
User sends message → AppSync GraphQL → DynamoDB → AppSync Subscription → All connected clients
```

### 3. **Media Upload Flow**
```
User uploads file → S3 (via IAM credentials) → Get URL → Save to DynamoDB → Display in feed
```

### 4. **Calendar Reminder Flow**
```
EventBridge (9 AM daily) → Lambda Function → Query DynamoDB → Send reminders
```

---

## Free Tier Compliance ✅

All 10 services are within AWS Free Tier limits:
- **Amplify Hosting**: 5GB storage, 15GB transfer/month
- **Cognito**: 50,000 MAU
- **AppSync**: 250,000 queries/month
- **DynamoDB**: 25GB storage, 25 read/write units
- **S3**: 5GB storage, 20,000 GET, 2,000 PUT requests
- **Lambda**: 1M requests, 400,000 GB-seconds
- **EventBridge**: 14M custom events/month
- **CloudWatch**: 5GB ingestion, 5GB storage
- **IAM**: Always free
- **Amplify Console**: Included with Hosting

---

## Key Features Implemented

1. **Real-time Synchronization**: AppSync subscriptions for live updates
2. **User Authentication**: Cognito-based sign-up/sign-in
3. **Media Storage**: S3 for photos, videos, audio, GIFs
4. **Database**: DynamoDB for all structured data
5. **Serverless Functions**: Lambda for scheduled tasks
6. **Event Scheduling**: EventBridge for daily reminders
7. **Monitoring**: CloudWatch for logs and errors
8. **Access Control**: IAM policies for secure access
9. **CI/CD**: Automatic deployment from GitHub
10. **Scalability**: All services auto-scale based on demand

---

## Files Reference

- **Backend Config**: `amplify/backend.ts`
- **Auth**: `amplify/auth/resource.ts`
- **Data/API**: `amplify/data/resource.ts`
- **Storage**: `amplify/storage/resource.ts`
- **Lambda**: `amplify/functions/calendarReminder/`
- **Frontend Config**: `amplify.yml`
- **Outputs**: `amplify_outputs.json`

---

**Total AWS Services Used: 10** ✅
**All within Free Tier: Yes** ✅
**Production Ready: Yes** ✅

