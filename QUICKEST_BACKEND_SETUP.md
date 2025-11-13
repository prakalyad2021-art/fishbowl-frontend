# ⚡ QUICKEST Backend Setup (2 minutes)

## Option 1: Use AWS Console (Fastest if you have console access)

Since CLI needs credentials setup, use the console:

1. **Go to AWS Amplify Console**
   - https://us-east-1.console.aws.amazon.com/amplify/apps/ddnqhb2lupx6m

2. **Click "Backend" in left sidebar** (if visible)
   - If NOT visible, continue to step 3

3. **Go to "App settings" → "General"**
   - Scroll to "Backend" section
   - Click "Enable backend" or "Create backend environment"
   - Select branch: `main`
   - Click "Create"

4. **Wait 2-3 minutes** for backend to deploy

5. **Get amplify_outputs.json**
   - Go to "Backend" → "Backend environments" → Click your environment
   - Click "Download outputs" or copy the JSON
   - Replace `amplify_outputs.json` in your project

## Option 2: Quick CLI Setup (If you have AWS Access Keys)

If you have AWS Access Key ID and Secret Access Key:

```bash
# 1. Configure AWS credentials (one-time, takes 30 seconds)
npx @aws-amplify/backend-cli configure profile

# When prompted:
# - Enter: y (yes, you have IAM credentials)
# - Access Key ID: [paste your key]
# - Secret Access Key: [paste your secret]
# - Region: us-east-1
# - Profile name: default

# 2. Deploy backend
npx @aws-amplify/backend-cli sandbox --once

# 3. Copy amplify_outputs.json from output
# 4. Replace file in project
```

## Option 3: I'll Create a Placeholder That Works

I can create a working `amplify_outputs.json` structure that will work once backend is created. The frontend code will work, it just needs the real values later.

**Which option do you prefer?** Console is fastest if you can access it!


