# ⚡ Quick Start Guide

Get PathoST-GNN running in 5 minutes!

## 🎯 Option 1: Local Development (No Database)

The app works in **demo mode** without Supabase configuration.

```bash
# Clone the repository
git clone <repository-url>
cd <project-folder>

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:8080
```

✅ **What works in demo mode:**
- Load WSI files (data stored in memory)
- Annotate regions
- Select genes
- View UI and interactions

❌ **What doesn't work:**
- Data persistence (reloads clear data)
- Database queries
- Session management

## 🚀 Option 2: Full Setup with Database

### Step 1: Setup Supabase (5 minutes)

1. **Create Supabase account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub (fastest)

2. **Create new project**
   - Click "New Project"
   - Name: `pathostgnn` (or anything)
   - Database password: (save this!)
   - Region: Choose closest to you
   - Wait 2-3 minutes for project creation

3. **Get API credentials**
   - Go to Project Settings > API
   - Copy:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public key** (starts with `eyJ...`)

4. **Setup database**
   ```bash
   # Navigate to supabase folder
   cd supabase/migrations
   
   # Copy the SQL from migration files and run in Supabase SQL Editor
   # Go to Supabase Dashboard > SQL Editor > New Query
   # Paste and run each migration file
   ```

### Step 2: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

Add:
```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

✅ You should see "Configuration Complete" message in the app!

## 🌐 Option 3: Deploy to Netlify (Production)

### Quick Deploy
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect GitHub and select repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
6. Click "Deploy"

**Live in 3 minutes!** 🎉

For detailed deployment guide: [NETLIFY_SETUP.md](./NETLIFY_SETUP.md)

## 📚 Using the Application

### 1. Load Sample Data (Easiest)

```
1. Click the 💡 (lightbulb) icon in sidebar
2. Click "Load Example"
3. Sample WSI, genes, and annotations are loaded
```

### 2. Upload Your Own WSI

```
1. Click "Load WSI" in sidebar
2. Select image file (< 500MB)
3. Wait for processing
4. WSI appears in canvas viewer
```

### 3. Annotate Regions

```
1. Click "Region Select" in sidebar
2. Enter coordinates or use preset
3. Choose color and name
4. Click "Add Region"
```

### 4. Query Genes

```
1. Use Gene Query panel on the right
2. Click common markers (CD3D, CD4, etc.)
   OR
   Type gene symbol and press Enter
3. Click "Run Analysis"
4. View expression results
```

### 5. Save Your Work

```
1. Click "Save Session" in sidebar
2. Enter session name
3. Session saved to database
```

### 6. Export Results

```
1. Click "Export" in sidebar
2. Choose format (CSV, JSON, PDF)
3. Download analysis report
```

## 🎨 Interface Overview

```
┌─────────────────────────────────────────────────────────┐
│  [Sidebar]  │   [Canvas Viewer]   │ [Gene Panel] │ [Admin] │
│             │                     │              │         │
│  • Load WSI │   Your WSI Image    │  Gene Search │  Stats  │
│  • Clear    │   + Annotations     │  Selected    │  Data   │
│  • Regions  │   + ST Overlay      │  Analysis    │  CRUD   │
│  • ST       │   Zoom Controls     │  Results     │         │
│  • Session  │                     │              │         │
│  • Export   │                     │              │         │
│  • Settings │                     │              │         │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Troubleshooting

### App not loading?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database queries failing?
- Check if Supabase credentials are correct
- Verify `.env` file has `VITE_` prefix
- Check browser console for specific errors

### Build errors?
```bash
# Check for TypeScript errors
npm run build

# Fix any type errors reported
```

### Port 8080 already in use?
```bash
# Edit vite.config.ts and change port
# Or kill process using port:
lsof -ti:8080 | xargs kill -9
```

## 📖 Next Steps

- 📄 Full Documentation: [README.md](./README.md)
- 🚀 Deployment Guide: [NETLIFY_SETUP.md](./NETLIFY_SETUP.md)
- 📋 Deployment Checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 💡 Tips

- **Use demo mode** for UI testing without database
- **Load sample data** to see all features quickly
- **Check browser console** for detailed error messages
- **Admin panel** shows database statistics and CRUD ops
- **Keyboard shortcuts** for faster workflow

## 🆘 Need Help?

1. Check [README.md](./README.md) for full documentation
2. Review error messages in browser console
3. Check Netlify build logs for deployment issues
4. Verify Supabase dashboard for database status

---

**Ready to analyze! 🔬**
