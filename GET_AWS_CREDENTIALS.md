# 🔑 How to Get AWS Credentials

You need **AWS Access Key ID** and **Secret Access Key** to deploy the backend.

## Step 1: Go to AWS IAM Console

1. Go to: https://console.aws.amazon.com/iam/
2. Make sure you're in the same region (us-east-1)

## Step 2: Create Access Key

1. Click **"Users"** in the left sidebar
2. Click on **your username** (or the IAM user you want to use)
3. Go to **"Security credentials"** tab
4. Scroll to **"Access keys"** section
5. Click **"Create access key"**

## Step 3: Choose Use Case

Select one of these:
- **"Command Line Interface (CLI)"** (recommended)
- Or **"Application running outside AWS"**

Click **"Next"**

## Step 4: Get Your Credentials

1. **IMPORTANT**: Copy both values immediately:
   - **Access Key ID** (starts with `AKIA...`)
   - **Secret Access Key** (long string - you can only see it once!)

2. **Save them securely** - you won't be able to see the Secret Key again!

3. Click **"Done"**

## Step 5: Use Credentials

When you run:
```bash
npx @aws-amplify/backend-cli configure profile
```

It will ask:
1. **"Do you already have IAM User credentials?"** → Type: `y` (yes)
2. **"Access Key ID"** → Paste your Access Key ID
3. **"Secret Access Key"** → Paste your Secret Access Key  
4. **"AWS Region"** → Type: `us-east-1`
5. **"Profile name"** → Press Enter (uses "default")

## Alternative: If You Already Have Credentials

If you already have AWS credentials saved somewhere:
- Check your AWS account settings
- Or if you've used AWS CLI before, they might be in `~/.aws/credentials`

## Security Note

⚠️ **Never share these credentials publicly!**
- Don't commit them to GitHub
- Don't share in screenshots
- Keep them secure

## After Configuration

Once credentials are configured, run:
```bash
npx @aws-amplify/backend-cli sandbox --once
```

This will deploy your backend and create `amplify_outputs.json`!

---

**Quick Link**: https://console.aws.amazon.com/iam/home#/users

