# ⚡ Quick Guide: Get AWS Credentials

## Where to Get Them

1. **Go to**: https://console.aws.amazon.com/iam/home#/users
2. **Click your username**
3. **Click "Security credentials" tab**
4. **Scroll to "Access keys"**
5. **Click "Create access key"**
6. **Select "CLI" as use case**
7. **Copy both values:**
   - Access Key ID
   - Secret Access Key (only shown once!)

## What You'll Need

- ✅ **Access Key ID** (looks like: `AKIAIOSFODNN7EXAMPLE`)
- ✅ **Secret Access Key** (long random string)
- ✅ **Region**: `us-east-1`

## Then Run

```bash
# 1. Configure (you'll paste the credentials here)
npx @aws-amplify/backend-cli configure profile

# When prompted:
# - "Do you have IAM credentials?" → y
# - "Access Key ID" → paste your Access Key ID
# - "Secret Access Key" → paste your Secret Access Key
# - "Region" → us-east-1
# - "Profile name" → press Enter (default)

# 2. Deploy backend
npx @aws-amplify/backend-cli sandbox --once
```

## That's It!

After deployment, you'll get `amplify_outputs.json` with all the real values!

---

**Direct Link**: https://console.aws.amazon.com/iam/home#/users

