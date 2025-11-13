# Fishbowl Frontend

A React + Vite frontend application for the Fishbowl social platform.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

## 📦 AWS Amplify Deployment

This app is configured for AWS Amplify deployment.

### Deployment Steps:

1. **Connect Repository to AWS Amplify**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git repository (GitHub, GitLab, Bitbucket, etc.)
   - Select the branch to deploy

2. **Build Settings**
   - AWS Amplify will automatically detect the `amplify.yml` configuration file
   - The build process will:
     - Install dependencies (`npm ci`)
     - Build the app (`npm run build`)
     - Deploy from the `dist` directory

3. **SPA Routing**
   - The `public/_redirects` file ensures all routes redirect to `index.html` for client-side routing
   - This is automatically copied to the build output

4. **Environment Variables** (if needed)
   - Add any required environment variables in the Amplify Console
   - Under App settings → Environment variables

### Manual Deployment (Alternative)

If you need to deploy manually:

1. Build the app: `npm run build`
2. The `dist` folder contains the production-ready files
3. Upload the contents of `dist` to your hosting service

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Styling
- **AWS Amplify** - Deployment & hosting
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── assets/         # Static assets
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## ✅ Pre-Deployment Checklist

- [x] HTML syntax errors fixed
- [x] Production build configured
- [x] AWS Amplify configuration added
- [x] SPA routing redirects configured
- [x] Build tested and working

## 🐛 Troubleshooting

**Build fails:**
- Ensure all dependencies are installed: `npm ci`
- Check Node.js version (recommended: 18+)

**Routes not working:**
- Verify `_redirects` file is in `public/` directory
- Check AWS Amplify redirect rules in console

**Styling issues:**
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` and `postcss.config.js`
