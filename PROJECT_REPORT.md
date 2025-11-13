# Fishbowl - Social Media Application
## Final Project Report

---

## Team Information

**Team Name:** [Your Team Name]

**Team Members:**
1. **Name:** [Member 1 Name] | **Registration No:** [Reg No 1]
2. **Name:** [Member 2 Name] | **Registration No:** [Reg No 2] (if applicable)
3. **Name:** [Member 3 Name] | **Registration No:** [Reg No 3] (if applicable)

**Project Duration:** [Start Date] to [End Date]

---

## Objective

The objective of this project is to develop a real-time social media application called "Fishbowl" that enables users to:

- **Connect and interact** with friends in a unique, visually engaging environment
- **Share moods and thoughts** through an interactive fishbowl interface where each user is represented as a fish
- **Communicate in real-time** through group chat with media support
- **Engage with daily prompts** similar to Instagram Notes (24-hour expiration)
- **Share multimedia content** (photos, videos, audio, GIFs) in an Instagram/Tumblr-style feed
- **Maintain personal journals** with tags and search functionality
- **Coordinate events** through a shared calendar with user tagging and reminders
- **Track personal statistics** and activity over time

The application leverages AWS cloud services to provide scalable, serverless infrastructure with real-time synchronization capabilities, ensuring all users see updates instantly across all features.

---

## List of Modules

1. **Authentication Module** - User sign-up, sign-in, and session management
2. **Fishbowl Module** - Main home page with real-time user presence and mood sharing
3. **Chatroom Module** - Real-time group chat with media attachments
4. **Prompts Module** - Daily prompts with 24-hour response expiration
5. **Media Module** - Instagram/Tumblr-style feed for sharing multimedia content
6. **Journal Module** - Personal journal entries with tags and search
7. **Calendar Module** - Shared calendar with event creation and user tagging
8. **Stats Module** - User activity statistics and visualization

---

## Detailed Description of Modules

### 1. Authentication Module

**Purpose:** Handles user registration, login, and session management using AWS Cognito.

**Features:**
- Email-based authentication
- Secure password policy enforcement (8+ characters, uppercase, lowercase, numbers, symbols)
- Automatic session management
- Identity pool integration for AWS service access

**Technology:** AWS Cognito User Pool + Identity Pool

**Files:**
- `src/App.jsx` - Authenticator wrapper and routing
- `amplify/auth/resource.ts` - Cognito configuration

---

### 2. Fishbowl Module (Main Feature)

**Purpose:** The core interactive feature where users are represented as fish swimming in a virtual fishbowl, displaying real-time presence and moods.

**Features:**
- **Real-time User Presence:** Shows all online users as fish in the bowl
- **Fixed Fish Emoji:** Each user gets a permanent fish emoji assigned on first login
- **Mood Bubbles:** Users can update their mood, displayed as thought bubbles (💭) above their fish
- **Active Friends List:** Side panel showing all online friends with their current moods
- **Real-time Synchronization:** Uses AppSync subscriptions to update instantly when users come online/offline or change moods
- **Username from Email:** Automatically extracts username from email address

**Technology:** React, AWS AppSync (GraphQL subscriptions), DynamoDB

**Files:**
- `src/pages/Fishbowl.jsx` - Main fishbowl component with real-time subscriptions
- `src/utils/dataClient.js` - Data operations and user management

**Key Functionality:**
- User initialization with fish emoji assignment (one-time, permanent)
- Real-time subscription to User model for online status
- Real-time subscription to Mood model for mood updates
- Fish position management with smooth animations
- Mood update handler that creates Mood entries and updates User model

---

### 3. Chatroom Module

**Purpose:** Real-time group chat functionality with support for text messages and media attachments.

**Features:**
- **Real-time Messaging:** Instant message delivery via AppSync subscriptions
- **Media Support:** Upload and share images, videos, audio files, and GIFs
- **User Identification:** Each message shows sender's username and fish emoji
- **Message History:** Persistent message storage in DynamoDB
- **Auto-scroll:** Automatically scrolls to latest messages
- **Media Preview:** Preview media before sending

**Technology:** React, AWS AppSync (GraphQL + Subscriptions), DynamoDB, S3

**Files:**
- `src/pages/Chatroom.jsx` - Chat interface with real-time updates
- `src/utils/dataClient.js` - Message CRUD operations
- `src/utils/storageClient.js` - Media upload to S3

**Key Functionality:**
- Real-time subscription to Message model
- Media upload to S3 with identity-based paths
- Message creation with sender information
- Media URL storage in message records

---

### 4. Prompts Module

**Purpose:** Daily prompt system similar to Instagram Notes, where users respond to prompts with 24-hour expiration.

**Features:**
- **Daily Prompts:** Automatically creates a new prompt each day
- **24-Hour Expiration:** Responses expire after 24 hours (like Instagram Notes)
- **Real-time Updates:** See new responses as they're posted
- **Response Feed:** View all responses from friends
- **Time Remaining Display:** Shows how much time is left before expiration

**Technology:** React, AWS AppSync (GraphQL + Subscriptions), DynamoDB

**Files:**
- `src/pages/Prompts.jsx` - Prompt display and response interface
- `amplify/data/resource.ts` - Prompt and PromptResponse models

**Key Functionality:**
- Automatic daily prompt creation if none exists
- Response creation with expiration timestamp
- Real-time subscription to PromptResponse model
- Filter expired responses client-side

---

### 5. Media Module

**Purpose:** Instagram/Tumblr-style feed for sharing multimedia content with captions and comments.

**Features:**
- **Media Upload:** Support for photos, videos, audio files, and GIFs
- **Feed Display:** Vertical scrollable feed showing all posts
- **Captions:** Add text captions to posts
- **Comments:** Comment on posts with real-time updates
- **Delete Functionality:** Users can delete their own posts and comments
- **Post Header:** Shows user's fish emoji, username, and timestamp
- **Media Preview:** Full-width media display with proper formatting

**Technology:** React, AWS AppSync (GraphQL + Subscriptions), DynamoDB, S3

**Files:**
- `src/pages/Media.jsx` - Media feed and upload interface
- `src/utils/storageClient.js` - S3 upload/download operations
- `amplify/data/resource.ts` - MediaPost and MediaComment models

**Key Functionality:**
- File selection and type detection
- S3 upload with identity-based paths
- Post creation with media URL
- Real-time subscription for new posts
- Comment system with nested relationships

---

### 6. Journal Module

**Purpose:** Personal journal for users to write private entries with tags and search functionality.

**Features:**
- **Private Entries:** Only the owner can view their journal entries
- **Tags System:** Add multiple tags to entries for organization
- **Search Functionality:** Search entries by title or content
- **Tag Filtering:** Filter entries by specific tags
- **Date Display:** Shows creation date for each entry
- **Delete Functionality:** Users can delete their entries

**Technology:** React, AWS AppSync (GraphQL), DynamoDB

**Files:**
- `src/pages/Journal.jsx` - Journal interface with search and filter
- `amplify/data/resource.ts` - JournalEntry model

**Key Functionality:**
- Entry creation with tags array
- Client-side search and filtering
- Owner-based authorization (only owner can read/write)

---

### 7. Calendar Module

**Purpose:** Shared calendar for group event planning with user tagging and reminder system.

**Features:**
- **Event Creation:** Create events with title, description, date, and time
- **User Tagging:** Tag specific users in events for notifications
- **Date Filtering:** Filter events by specific date
- **Event Display:** Show all events with creator information
- **Reminder System:** Lambda function scheduled to send reminders (via EventBridge)
- **Delete Functionality:** Event creators can delete their events

**Technology:** React, AWS AppSync (GraphQL + Subscriptions), DynamoDB, Lambda, EventBridge

**Files:**
- `src/pages/Calendar.jsx` - Calendar interface
- `amplify/functions/calendarReminder/handler.ts` - Lambda function for reminders
- `amplify/data/resource.ts` - CalendarEvent model

**Key Functionality:**
- Event creation with tagged users array
- Real-time subscription for event updates
- Date-based filtering
- Lambda function for scheduled reminders (runs daily at 9 AM UTC)

---

### 8. Stats Module

**Purpose:** Track and visualize user activity statistics over time.

**Features:**
- **Activity Tracking:** Tracks mood check-ins, media shared, active days
- **Data Visualization:** Charts and graphs using Recharts library
- **Time-based Analysis:** View stats over different time periods
- **Private Stats:** Only the user can view their own statistics

**Technology:** React, AWS AppSync (GraphQL), DynamoDB, Recharts

**Files:**
- `src/pages/Stats.jsx` - Statistics display with charts
- `amplify/data/resource.ts` - UserStats model

**Key Functionality:**
- Stats aggregation and updates
- Chart rendering with Recharts
- Date range filtering

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│  React 19 (Vite) + Tailwind CSS v4 + Framer Motion         │
│  - Fishbowl, Chatroom, Prompts, Media, Journal, Calendar    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS/WebSocket
                     │
┌────────────────────▼────────────────────────────────────────┐
│              AWS Amplify Hosting                            │
│         (Static Site Hosting + CI/CD)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐            ┌─────▼─────┐
    │ Cognito │            │  AppSync  │
    │  Auth   │            │  GraphQL  │
    │         │            │  + Real-  │
    │ User    │            │   time    │
    │ Pool    │            │Subscriptions│
    │ Identity│            └─────┬─────┘
    │  Pool   │                 │
    └─────────┘          ┌──────┴──────┐
                         │             │
                    ┌────▼────┐   ┌───▼────┐
                    │DynamoDB │   │   S3   │
                    │  Tables │   │ Storage│
                    └─────────┘   └────────┘
                         │
    ┌─────────────────────┴─────────────────────┐
    │                                           │
┌───▼────┐                              ┌──────▼──────┐
│Lambda  │                              │ EventBridge │
│Function│◄─────────────────────────────│  Scheduler  │
│(Reminder)                              │  (Daily)    │
└────────┘                              └─────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Supporting Services                            │
│  - CloudWatch (Logging)                                    │
│  - IAM (Permissions)                                       │
│  - Amplify Console (CI/CD)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

**1. Authentication Flow:**
```
User → Cognito User Pool → Identity Pool → IAM Credentials → Access AWS Services
```

**2. Real-time Data Flow:**
```
User Action → AppSync GraphQL Mutation → DynamoDB → AppSync Subscription → All Connected Clients
```

**3. Media Upload Flow:**
```
User Upload → S3 (via IAM credentials) → Get Presigned URL → Save URL to DynamoDB → Display in Feed
```

**4. Scheduled Task Flow:**
```
EventBridge (9 AM daily) → Lambda Function → Query DynamoDB → Process Reminders
```

### Technology Stack

**Frontend:**
- React 19 (Vite) - UI framework
- Tailwind CSS v4 - Styling
- Framer Motion - Animations
- React Router 7 - Navigation
- Lucide React - Icons
- Recharts - Data visualization

**Backend:**
- AWS Amplify Gen 2 - Backend framework
- AWS AppSync - GraphQL API
- Amazon DynamoDB - NoSQL database
- Amazon S3 - Object storage
- AWS Lambda - Serverless functions
- Amazon EventBridge - Event scheduling

**Authentication:**
- Amazon Cognito - User authentication

**Infrastructure:**
- AWS Amplify Hosting - Frontend hosting
- AWS CloudWatch - Logging and monitoring
- AWS IAM - Access control

---

## Individual Contribution

**[Member 1 Name - Reg No]**
- Designed and implemented the Fishbowl module with real-time synchronization
- Set up AWS AppSync GraphQL API and DynamoDB tables
- Implemented user authentication flow with Cognito
- Configured S3 storage for media uploads
- Set up real-time subscriptions for chat and user presence
- Deployed backend infrastructure using AWS Amplify Gen 2

**[Member 2 Name - Reg No]** (if applicable)
- [Add contributions]

**[Member 3 Name - Reg No]** (if applicable)
- [Add contributions]

---

## Tools/Software Requirements

### Development Tools
- **Node.js** (v18 or higher) - JavaScript runtime
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **VS Code** or **WebStorm** - Code editor
- **AWS CLI** - AWS command-line interface
- **AWS Amplify CLI** - Backend deployment

### Frontend Dependencies
- `react` (v19) - UI library
- `react-router-dom` (v7) - Routing
- `@aws-amplify/ui-react` - Amplify UI components
- `aws-amplify` - AWS Amplify SDK
- `tailwindcss` (v4) - CSS framework
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `recharts` - Chart library

### Backend Dependencies
- `@aws-amplify/backend` - Amplify backend framework
- `@aws-amplify/backend-cli` - Backend CLI tools
- `aws-lambda` - Lambda function types

### Cloud Services
- AWS Account (Free Tier eligible)
- GitHub Account (for CI/CD)

### Browser Requirements
- Modern browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- WebSocket support (for real-time features)

---

## AWS Services (10 Services Used)

### 1. AWS Amplify Hosting
- **Purpose:** Hosts the React frontend application
- **Usage:** Continuous deployment from GitHub, automatic builds
- **Free Tier:** 5GB storage, 15GB transfer/month
- **Screenshot:** [Take screenshot of Amplify Console showing deployment status]

### 2. Amazon Cognito
- **Purpose:** User authentication and authorization
- **Components:** User Pool + Identity Pool
- **Free Tier:** 50,000 MAU (Monthly Active Users)
- **Screenshot:** [Take screenshot of Cognito User Pool in AWS Console showing user pool details]

### 3. AWS AppSync
- **Purpose:** GraphQL API with real-time subscriptions
- **Usage:** All data operations and real-time updates
- **Free Tier:** 250,000 queries/month
- **Screenshot:** [Take screenshot of AppSync Console showing API endpoint and schema]

### 4. Amazon DynamoDB
- **Purpose:** NoSQL database for all application data
- **Tables:** 10 tables (User, Message, Mood, Prompt, PromptResponse, MediaPost, MediaComment, JournalEntry, CalendarEvent, UserStats)
- **Free Tier:** 25GB storage, 25 read/write units
- **Screenshot:** [Take screenshot of DynamoDB Console showing all tables]

### 5. Amazon S3
- **Purpose:** Object storage for media files
- **Bucket:** `amplify-fishbowlfrontend--fishbowlmediabucket557c1-9wgbrqy5cyz8`
- **Free Tier:** 5GB storage, 20,000 GET requests, 2,000 PUT requests
- **Screenshot:** [Take screenshot of S3 Console showing bucket and uploaded media files]

### 6. AWS Lambda
- **Purpose:** Serverless function for calendar reminders
- **Function:** `calendarReminder`
- **Free Tier:** 1M requests/month, 400,000 GB-seconds
- **Screenshot:** [Take screenshot of Lambda Console showing function details and code]

### 7. Amazon EventBridge
- **Purpose:** Event-driven scheduling for Lambda
- **Usage:** Daily trigger at 9 AM UTC
- **Free Tier:** 14M custom events/month
- **Screenshot:** [Take screenshot of EventBridge Console showing rule configuration]

### 8. AWS CloudWatch
- **Purpose:** Logging and monitoring
- **Usage:** Automatic logging for all services
- **Free Tier:** 5GB ingestion, 5GB storage
- **Screenshot:** [Take screenshot of CloudWatch Logs showing Lambda function logs]

### 9. AWS IAM
- **Purpose:** Identity and Access Management
- **Usage:** Permissions for authenticated users, S3 access policies
- **Free Tier:** Always free
- **Screenshot:** [Take screenshot of IAM Console showing roles and policies]

### 10. AWS Amplify Console
- **Purpose:** CI/CD pipeline and backend management
- **Usage:** Automatic builds, backend resource management
- **Free Tier:** Included with Amplify Hosting
- **Screenshot:** [Take screenshot of Amplify Console showing build history and backend resources]

---

## Screenshots Required

### Application Screenshots

1. **Login/Sign-up Page**
   - Show Cognito authentication form
   - [File: `src/App.jsx` - Authenticator component]

2. **Fishbowl Home Page**
   - Show fishbowl with multiple users' fish
   - Show mood bubbles above fish
   - Show active friends list
   - [File: `src/pages/Fishbowl.jsx`]

3. **Chatroom**
   - Show real-time messages
   - Show media attachments in chat
   - [File: `src/pages/Chatroom.jsx`]

4. **Prompts Page**
   - Show daily prompt card
   - Show response input and feed
   - [File: `src/pages/Prompts.jsx`]

5. **Media Feed**
   - Show Instagram-style feed with posts
   - Show upload modal
   - Show comments on posts
   - [File: `src/pages/Media.jsx`]

6. **Journal Page**
   - Show journal entries with tags
   - Show search and filter functionality
   - [File: `src/pages/Journal.jsx`]

7. **Calendar Page**
   - Show calendar events
   - Show event creation form with user tagging
   - [File: `src/pages/Calendar.jsx`]

8. **Stats Page**
   - Show charts and statistics
   - [File: `src/pages/Stats.jsx`]

### AWS Console Screenshots

1. **Amplify Console**
   - App overview showing frontend and backend
   - Build history
   - Deployment status

2. **Cognito Console**
   - User Pool details
   - User list showing registered users
   - Identity Pool configuration

3. **AppSync Console**
   - API endpoint
   - GraphQL schema
   - Data sources (DynamoDB tables)

4. **DynamoDB Console**
   - List of all 10 tables
   - Sample data from one table (e.g., User table)

5. **S3 Console**
   - Bucket overview
   - Media files in `media/` folder structure

6. **Lambda Console**
   - Function code
   - Configuration (timeout, memory)
   - Test execution results

7. **EventBridge Console**
   - Rule configuration
   - Schedule expression (cron)
   - Target (Lambda function)

8. **CloudWatch Console**
   - Log groups
   - Sample log entries from Lambda

9. **IAM Console**
   - Roles created by Amplify
   - Policies attached to roles

---

## Coding of the Project

### Frontend Code Structure

**Main Application Entry:**
- `src/main.jsx` - Application entry point, Amplify configuration
- `src/App.jsx` - Main app component with routing and authentication

**Page Components:**
- `src/pages/Fishbowl.jsx` - Fishbowl module with real-time user presence
- `src/pages/Chatroom.jsx` - Real-time chat with media support
- `src/pages/Prompts.jsx` - Daily prompts with 24-hour expiration
- `src/pages/Media.jsx` - Instagram-style media feed
- `src/pages/Journal.jsx` - Personal journal with tags
- `src/pages/Calendar.jsx` - Shared calendar with events
- `src/pages/Stats.jsx` - User statistics visualization

**Utility Files:**
- `src/utils/dataClient.js` - AppSync GraphQL client and data operations
- `src/utils/storageClient.js` - S3 storage operations for media uploads

**Components:**
- `src/components/BottomNav.jsx` - Bottom navigation bar

**Configuration:**
- `amplify.yml` - Amplify build configuration
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Project dependencies

### Backend Code Structure

**Backend Definition:**
- `amplify/backend.ts` - Main backend configuration

**Authentication:**
- `amplify/auth/resource.ts` - Cognito User Pool and Identity Pool setup

**Data/API:**
- `amplify/data/resource.ts` - GraphQL schema with 10 models (User, Message, Mood, Prompt, PromptResponse, MediaPost, MediaComment, JournalEntry, CalendarEvent, UserStats)

**Storage:**
- `amplify/storage/resource.ts` - S3 bucket configuration with access rules

**Lambda Functions:**
- `amplify/functions/calendarReminder/handler.ts` - Calendar reminder Lambda function
- `amplify/functions/calendarReminder/resource.ts` - Lambda function resource definition
- `amplify/functions/calendarReminder/package.json` - Lambda dependencies

**Configuration:**
- `amplify/package.json` - Backend dependencies
- `amplify/tsconfig.json` - TypeScript configuration
- `amplify_outputs.json` - Generated backend configuration (auto-generated)

### Key Code Files (Reference for Report)

**For detailed code, refer to these files in the repository:**

1. **Authentication Implementation:**
   - `src/App.jsx` (lines 1-50) - Authenticator wrapper
   - `amplify/auth/resource.ts` - Cognito configuration

2. **Real-time Fishbowl:**
   - `src/pages/Fishbowl.jsx` (full file) - Complete fishbowl implementation
   - `src/utils/dataClient.js` (lines 8-50) - User operations

3. **Real-time Chat:**
   - `src/pages/Chatroom.jsx` (full file) - Chat implementation
   - `src/utils/dataClient.js` (lines 52-75) - Message operations

4. **Media Upload:**
   - `src/pages/Media.jsx` (full file) - Media feed
   - `src/utils/storageClient.js` (full file) - S3 upload implementation

5. **GraphQL Schema:**
   - `amplify/data/resource.ts` (full file) - All data models

6. **Lambda Function:**
   - `amplify/functions/calendarReminder/handler.ts` (full file) - Reminder logic

7. **Storage Configuration:**
   - `amplify/storage/resource.ts` (full file) - S3 access rules

---

## References

[Add your references here - papers, documentation, tutorials, etc.]

**Suggested References:**
- AWS Amplify Documentation: https://docs.amplify.aws/
- AWS AppSync Documentation: https://docs.aws.amazon.com/appsync/
- React Documentation: https://react.dev/
- AWS Free Tier: https://aws.amazon.com/free/
- GraphQL Documentation: https://graphql.org/
- Tailwind CSS Documentation: https://tailwindcss.com/

---

## Conclusion

This project successfully demonstrates the implementation of a full-stack social media application using AWS cloud services. The application leverages 10 AWS services within the Free Tier, providing a scalable, serverless architecture with real-time capabilities. Key achievements include:

- Real-time synchronization across all features
- Secure authentication and authorization
- Scalable media storage and delivery
- Serverless backend infrastructure
- Modern, responsive user interface

The project showcases practical application of cloud computing concepts, serverless architecture, real-time data synchronization, and modern web development practices.

---

**Total Lines of Code:** [Calculate and add]
**Total AWS Services:** 10
**Total DynamoDB Tables:** 10
**Total React Components:** 8 pages + utilities
**Deployment Status:** ✅ Production Ready
**Free Tier Compliance:** ✅ Yes

