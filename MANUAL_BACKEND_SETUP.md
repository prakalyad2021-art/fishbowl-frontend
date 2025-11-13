# 🔧 Manual Backend Setup (Console Method)

Since auto-detection isn't working, let's create resources manually through the console sections.

## Step 1: Create Authentication (Cognito)

1. Go to: https://us-east-1.console.aws.amazon.com/amplify/apps/ddnqhb2lupx6m
2. Click **"Authentication"** in left sidebar
3. Click **"Set up authentication"** or **"Create user pool"**
4. Configure:
   - **Sign-in method**: Email
   - **Password requirements**: Default (8+ chars)
   - Click **"Deploy"** or **"Create"**
5. Wait for creation (1-2 minutes)
6. **Copy the User Pool ID** and **Client ID** (you'll need these)

## Step 2: Create Data (AppSync + DynamoDB)

1. Click **"Data"** in left sidebar
2. Click **"Create data model"** or **"Add API"**
3. Choose: **"GraphQL API"** or **"AppSync"**
4. Configure:
   - **API name**: `fishbowl-api`
   - **Authorization**: Amazon Cognito User Pool (use the one from Step 1)
   - Click **"Create"**
5. After creation, you'll get an **API URL** - copy it

## Step 3: Create Storage (S3)

1. Click **"Storage"** in left sidebar
2. Click **"Create storage"** or **"Add storage"**
3. Choose: **"S3"**
4. Configure:
   - **Bucket name**: `fishbowl-media-[your-name]` (must be unique)
   - **Access**: Authenticated users can upload/read
   - Click **"Create"**
5. **Copy the bucket name**

## Step 4: Create amplify_outputs.json

After all resources are created, I'll help you create the `amplify_outputs.json` with the real values.

## Alternative: Use Individual AWS Services

If the Amplify console sections don't work, we can create resources directly:

1. **Cognito**: https://console.aws.amazon.com/cognito
2. **AppSync**: https://console.aws.amazon.com/appsync
3. **DynamoDB**: https://console.aws.amazon.com/dynamodb
4. **S3**: https://console.aws.amazon.com/s3

But the Amplify console sections are easier!

---

**Try Step 1 first (Authentication) and let me know what you see!**


