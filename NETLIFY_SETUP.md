# Netlify Deployment Setup Guide

## 🚀 Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## 📋 Prerequisites

1. A [Supabase](https://supabase.com) account and project
2. A [Netlify](https://netlify.com) account
3. Your Supabase credentials

## 🔧 Step-by-Step Deployment

### 1. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Project Settings** > **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Deploy to Netlify

#### Option A: Via Netlify Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select this repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These are auto-detected from `netlify.toml`

3. **Add Environment Variables**
   - Go to **Site settings** > **Environment variables**
   - Click "Add a variable"
   - Add the following:
     ```
     VITE_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY = eyJxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - ⚠️ Make sure to use your actual Supabase credentials!

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 1-3 minutes)

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# When prompted, enter environment variables:
# VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx

# Deploy to production
netlify deploy --prod
```

### 3. Verify Deployment

1. Open your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Open browser console (F12)
3. Check for any errors
4. If you see "Supabase configuration missing" error:
   - Go to Netlify Dashboard > Site settings > Environment variables
   - Verify the variables are set correctly
   - Redeploy the site

## 🔄 Updating Environment Variables

If you need to update your Supabase credentials:

1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site settings** > **Environment variables**
4. Update the values
5. Go to **Deploys** tab
6. Click "Trigger deploy" > "Clear cache and deploy site"

## 🛠️ Troubleshooting

### Build Fails with "vite: not found"
- **Cause**: Dependencies not installed
- **Solution**: Netlify automatically runs `npm install`. Check build logs for errors.

### App Loads but Shows Errors
- **Cause**: Missing or incorrect environment variables
- **Solution**: 
  1. Check browser console for specific errors
  2. Verify environment variables in Netlify dashboard
  3. Ensure variables start with `VITE_` prefix
  4. Redeploy after updating variables

### Database Queries Fail
- **Cause**: Supabase RLS (Row Level Security) policies
- **Solution**:
  1. Go to Supabase Dashboard > Authentication
  2. Check your RLS policies in Database > Tables
  3. Ensure anonymous access is enabled if not using auth

### Site Returns 404 on Refresh
- **Cause**: SPA routing not configured
- **Solution**: Already handled! The `netlify.toml` has proper redirects.

## 📊 Performance Optimization

The `netlify.toml` includes:
- ✅ Caching headers for assets (1 year)
- ✅ Security headers (XSS, Frame Options, etc.)
- ✅ SPA routing redirects
- ✅ Node 20 for faster builds

## 🔐 Security Checklist

- [ ] Environment variables are set in Netlify (never in code)
- [ ] `.env` file is in `.gitignore`
- [ ] Supabase RLS policies are configured
- [ ] HTTPS is enabled (automatic with Netlify)
- [ ] Custom domain has SSL certificate

## 🌐 Custom Domain Setup

1. Go to Netlify Dashboard > Domain settings
2. Click "Add custom domain"
3. Enter your domain name
4. Update DNS records with your domain provider:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```
5. Wait for DNS propagation (up to 48 hours)
6. SSL certificate will be auto-provisioned

## 📈 Monitoring

Monitor your deployment:
- **Netlify Analytics**: Site settings > Analytics
- **Build Logs**: Deploys tab > Select a deploy > Build logs
- **Function Logs**: Functions tab (if using Netlify Functions)
- **Browser Console**: Open F12 in browser to check for JS errors

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Project README](./README.md)

## 💡 Tips

1. **Auto-deploy on push**: Netlify automatically deploys when you push to your main branch
2. **Preview deploys**: Pull requests get their own preview URLs
3. **Rollback**: You can instantly rollback to any previous deploy
4. **Build minutes**: Netlify free tier includes 300 build minutes/month

## 🆘 Need Help?

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review build logs in Netlify Dashboard
3. Check browser console for errors
4. Verify environment variables are set correctly
5. Create an issue in the repository

---

**Happy deploying! 🎉**
