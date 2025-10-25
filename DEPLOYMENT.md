# Deployment Guide for Netlify

This project has been configured to work seamlessly with Netlify.

⚠️ **Important**: For detailed step-by-step deployment instructions, see [NETLIFY_SETUP.md](./NETLIFY_SETUP.md)

## Changes Made

### 1. New Favicon
- Created a modern SVG favicon at `/public/favicon.svg` 
- The favicon features a gradient graph network design representing the PathoST-GNN project
- Added favicon links to `index.html`:
  - Primary: SVG favicon for modern browsers
  - Fallback: ICO favicon for older browsers

### 2. Netlify Configuration

#### netlify.toml
Created configuration file with:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18
- **SPA routing**: All routes redirect to `index.html` with status 200

#### _redirects
Created `/public/_redirects` file for SPA routing:
- Ensures React Router works correctly on Netlify
- All routes serve `index.html` while maintaining the URL

### 3. .gitignore
Added proper .gitignore file to exclude:
- `node_modules`
- `dist`
- Environment files
- Editor files
- Netlify cache

## Deploying to Netlify

### Option 1: Manual Deploy
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify

### Option 2: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Netlify will automatically use the settings from `netlify.toml`
4. Deploy will happen automatically on push

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Testing Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features Configured

✅ SVG favicon with fallback  
✅ SPA routing support  
✅ Optimized build settings  
✅ Node 18 environment  
✅ Proper redirects for React Router  
✅ .gitignore for clean repository  

## Environment Variables

If you need to add environment variables (like Supabase keys):
1. Go to Netlify dashboard → Site settings → Environment variables
2. Add your variables (they should start with `VITE_` for Vite to include them)
3. Redeploy the site

Example:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Notes

- The project uses Vite, which is fast and optimized for production
- All assets in `/public` are copied to the root of the build
- React Router uses client-side routing, handled by the `_redirects` file
