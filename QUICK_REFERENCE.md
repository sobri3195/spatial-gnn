# ⚡ Quick Reference Card

## 🚀 Quick Commands

```bash
# Setup
./setup.sh                    # Automated setup
npm install                   # Manual install

# Development
npm run dev                   # Start dev server (port 8080)
npm run build                 # Build for production
npm run preview               # Preview production build
npm run lint                  # Run linter

# Deployment
npm run deploy                # Build and show deploy message
npm run clean                 # Clean node_modules and dist
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `netlify.toml` | Netlify configuration |
| `.env.example` | Environment template |
| `STATUS.md` | Current project status |
| `QUICKSTART.md` | 5-min setup guide |
| `NETLIFY_SETUP.md` | Full deployment guide |

## 🔧 Environment Variables

Required in Netlify Dashboard or `.env` file:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxxx...
```

Get from: **Supabase Dashboard** → Project Settings → API

## 🌐 Deployment Steps

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Configure Netlify**
   - Connect repository
   - Add environment variables
   - Deploy!

3. **Live at:** https://spasial.netlify.app

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm run clean && npm install` |
| Config missing | Check environment variables in Netlify |
| 404 on refresh | Already fixed in netlify.toml |
| DB queries fail | Verify Supabase credentials |

## 📖 Documentation

- **README.md** - Full documentation
- **QUICKSTART.md** - Quick setup
- **NETLIFY_SETUP.md** - Deployment guide
- **DEPLOYMENT_CHECKLIST.md** - Verification steps
- **STATUS.md** - Current status

## 💡 Tips

- ✅ Works in demo mode without Supabase
- ✅ Run `./setup.sh` for quickest setup
- ✅ Use `npm run deploy` to verify build before deploying
- ✅ Check browser console for detailed errors
- ✅ Admin panel shows database stats

## 🎯 Port & URLs

- **Dev Server:** http://localhost:8080
- **Production:** https://spasial.netlify.app
- **Supabase:** https://supabase.com/dashboard
- **Netlify:** https://app.netlify.com

## ⚙️ Key Features

- 🖼️ WSI Viewer (zoom/pan)
- 🧬 Gene Expression Analysis
- 📍 Region Annotations
- 💾 Session Management
- 🔧 Admin Panel (CRUD)
- 📤 Export (CSV/JSON/PDF)
- 🎨 Dark/Light Theme
- 📱 Responsive Design

## 🔐 Security

- ✅ Environment variables not in code
- ✅ Security headers configured
- ✅ HTTPS enforced (Netlify)
- ✅ XSS protection enabled

## 📊 Build Output

```
dist/
├── index.html (1.9KB)
├── assets/
│   ├── index.css (64KB)
│   ├── react-vendor.js (157KB)
│   ├── ui-vendor.js (73KB)
│   ├── supabase.js (149KB)
│   └── index.js (193KB)
├── _redirects
└── robots.txt
```

## 🎊 All Set!

Everything is configured and ready to deploy. Choose your path:

- **Quick Demo:** `npm install && npm run dev`
- **Full Setup:** `./setup.sh`
- **Deploy:** See NETLIFY_SETUP.md

---

**Need help?** Check the documentation files or STATUS.md for current status.

**Happy coding! 🚀**
