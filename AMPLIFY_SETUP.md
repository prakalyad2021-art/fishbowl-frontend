# 🚀 AWS Amplify Gen 2 Setup Guide

## Prerequisites
- AWS Account (Free Tier eligible)
- Node.js 18+ installed
- AWS CLI configured (optional, for local development)

## Step 1: Install Amplify CLI (for local development/testing)

```bash
npm install -g @aws-amplify/backend-cli
```

## Step 2: Deploy Backend to AWS

### Option A: Using AWS Amplify Console (Recommended)

1. **Go to AWS Amplify Console**
   - Navigate to: https://console.aws.amazon.com/amplify
   - Select your app: `fishbowl-frontend`

2. **Enable Backend**
   - Go to "Backend environments" in the left sidebar
   - Click "Get started" or "Create backend"
   - Connect your GitHub repository
   - Amplify will detect the `amplify/` folder

3. **Deploy Backend**
   - Amplify will automatically build and deploy your backend
   - This creates:
     - Cognito User Pool (Auth)
     - AppSync GraphQL API (Data)
     - DynamoDB Tables (Storage)
     - S3 Bucket (Media Storage)

4. **Get Configuration**
   - After deployment, go to "Backend" → "Outputs"
   - Download or copy the `amplify_outputs.json`
   - Replace the placeholder file in your project root

### Option B: Using Amplify CLI (Local Development)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/backend-cli

# Deploy backend
npx ampx sandbox

# This will:
# - Create all AWS resources
# - Generate amplify_outputs.json
# - Keep resources running until you stop it (Ctrl+C)
```

## Step 3: Update amplify_outputs.json

After backend deployment, replace the placeholder `amplify_outputs.json` with the real one from AWS Console or CLI output.

## Step 4: Push to GitHub

```bash
git add .
git commit -m "Add Amplify Gen 2 backend"
git push
```

## Step 5: Verify Deployment

1. Go to your Amplify app in AWS Console
2. Check "Backend" section - should show all resources
3. Check "Hosting" - frontend should auto-deploy

## AWS Services Used (8+ for project requirements)

1. **Cognito** - User authentication
2. **AppSync** - GraphQL API with real-time subscriptions
3. **DynamoDB** - NoSQL database for all data
4. **S3** - Media storage (photos, videos, GIFs, audio)
5. **Amplify Hosting** - Frontend hosting
6. **Lambda** - Calendar reminder functions (to be added)
7. **EventBridge** - Scheduled reminders (to be added)
8. **CloudWatch** - Logging and monitoring (automatic)

## Troubleshooting

**Backend not deploying:**
- Check `amplify/backend.ts` syntax
- Verify all resource files exist
- Check AWS Console for error messages

**amplify_outputs.json missing:**
- Deploy backend first (Step 2)
- Download from AWS Console → Backend → Outputs

**Authentication not working:**
- Verify Cognito User Pool is created
- Check amplify_outputs.json has correct auth config

**Data operations failing:**
- Verify AppSync API is deployed
- Check DynamoDB tables are created
- Verify authorization rules in schema

## Next Steps

After backend is deployed:
1. Test authentication (sign up/sign in)
2. Test data operations (create/read/update/delete)
3. Test media uploads
4. Implement real-time features
5. Add Lambda functions for calendar reminders


