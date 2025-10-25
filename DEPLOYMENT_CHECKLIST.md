# 🚀 Deployment Checklist for Netlify

Use this checklist to ensure your deployment is successful and complete.

## Pre-Deployment Checklist

### ✅ Repository Setup
- [ ] Code is committed to Git repository
- [ ] `.gitignore` includes `node_modules`, `dist`, `.env`
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket

### ✅ Supabase Setup
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database schema applied (see `supabase/migrations/`)
- [ ] Row Level Security (RLS) policies configured
- [ ] Supabase credentials saved:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

### ✅ Local Testing
- [ ] `npm install` runs successfully
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` shows working build locally
- [ ] All features tested in development mode

## Netlify Deployment Steps

### 1️⃣ Initial Setup
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Build settings confirmed:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Node version: 20

### 2️⃣ Environment Variables
Navigate to: **Site settings > Environment variables > Add a variable**

Add the following variables:
- [ ] `VITE_SUPABASE_URL` = `https://xxxxxxxxxxxxx.supabase.co`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` = `eyJxxxxxxxxxxxxxxxxxxxxxxxxx`

> ⚠️ Variables must start with `VITE_` prefix for Vite to include them

### 3️⃣ Deploy
- [ ] Click "Deploy site"
- [ ] Wait for build to complete (1-5 minutes)
- [ ] Check deploy logs for errors
- [ ] Note the deployment URL

## Post-Deployment Checklist

### ✅ Verification
- [ ] Site loads without errors
- [ ] Open browser console (F12) - no errors
- [ ] Configuration status shows "Configuration Complete"
- [ ] Can load WSI images
- [ ] Gene query panel works
- [ ] Analysis runs successfully
- [ ] Admin panel displays data
- [ ] All dialogs open correctly

### ✅ Performance
- [ ] Page loads in < 3 seconds
- [ ] Images load properly
- [ ] Animations are smooth
- [ ] No console warnings

### ✅ Security
- [ ] HTTPS is enabled (automatic with Netlify)
- [ ] Security headers configured (from `netlify.toml`)
- [ ] No sensitive data in client-side code
- [ ] Environment variables not exposed in build
- [ ] Supabase RLS policies active

### ✅ SEO & Accessibility
- [ ] Favicon displays correctly
- [ ] Page title is correct
- [ ] Meta description is present
- [ ] Open Graph tags working
- [ ] Robots.txt accessible at `/robots.txt`

## Troubleshooting

### ❌ Build Fails
**Check:**
- [ ] Build logs in Netlify dashboard
- [ ] Node version matches (20)
- [ ] All dependencies in `package.json`
- [ ] No TypeScript errors locally

**Fix:**
```bash
# Test locally first
npm install
npm run build
```

### ❌ App Shows "Configuration Missing"
**Check:**
- [ ] Environment variables set in Netlify
- [ ] Variables start with `VITE_` prefix
- [ ] No typos in variable names
- [ ] Values are correct (from Supabase)

**Fix:**
1. Go to Site settings > Environment variables
2. Verify values
3. Trigger new deploy: Deploys > Trigger deploy > Clear cache and deploy

### ❌ Database Queries Fail
**Check:**
- [ ] Supabase project is active
- [ ] Database tables exist
- [ ] RLS policies allow public access (or auth is configured)
- [ ] API keys are valid

**Fix:**
1. Test Supabase connection:
   ```javascript
   // In browser console
   const { data, error } = await window.supabase.from('wsi_images').select('*')
   console.log(data, error)
   ```

### ❌ 404 on Page Refresh
**Already Fixed!** ✅
- `netlify.toml` has SPA redirects configured
- `public/_redirects` file exists

## Performance Optimization

### ✅ Applied Optimizations
- [x] Code splitting enabled
- [x] Asset caching headers (1 year)
- [x] Compression (Brotli/Gzip)
- [x] Lazy loading for heavy components
- [x] Optimized bundle chunks

### 🎯 Further Optimizations (Optional)
- [ ] Enable Netlify Analytics
- [ ] Set up CDN for images
- [ ] Configure asset optimization
- [ ] Enable prerendering for static routes

## Monitoring & Maintenance

### 📊 Monitor
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Check Netlify Analytics regularly
- [ ] Review error logs weekly
- [ ] Monitor Supabase usage

### 🔄 Updates
- [ ] Keep dependencies updated
- [ ] Review security advisories
- [ ] Test before deploying updates
- [ ] Use Netlify deploy previews for PRs

### 🔐 Security
- [ ] Review RLS policies monthly
- [ ] Rotate API keys if compromised
- [ ] Check for outdated dependencies
- [ ] Monitor Netlify security logs

## Custom Domain Setup (Optional)

- [ ] Domain purchased
- [ ] DNS records updated:
  ```
  Type: A
  Name: @
  Value: 75.2.60.5
  
  Type: CNAME
  Name: www
  Value: your-site.netlify.app
  ```
- [ ] SSL certificate auto-provisioned (24-48 hours)
- [ ] HTTPS redirect enabled
- [ ] Domain verified in Netlify

## Rollback Plan

If something goes wrong:
1. [ ] Go to Deploys tab in Netlify
2. [ ] Find previous working deploy
3. [ ] Click "Publish deploy"
4. [ ] Site instantly rolls back

## Support Resources

- 📖 [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) - Detailed setup guide
- 📖 [README.md](./README.md) - Project documentation
- 🌐 [Netlify Docs](https://docs.netlify.com)
- 🌐 [Supabase Docs](https://supabase.com/docs)
- 💬 [Netlify Community](https://community.netlify.com)

## Final Notes

✅ **Deployment Complete!**

Your site should be live at: `https://your-site-name.netlify.app`

**Next Steps:**
1. Share the URL with your team
2. Set up monitoring
3. Plan for custom domain (if needed)
4. Keep dependencies updated

**Important URLs:**
- Live Site: `https://spasial.netlify.app`
- Netlify Dashboard: `https://app.netlify.com`
- Supabase Dashboard: `https://supabase.com/dashboard`

---

**Last Updated:** October 25, 2024

**Happy deploying! 🎉**
