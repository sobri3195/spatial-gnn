# PathoST-GNN - Spatial Transcriptomics Analysis Platform

[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)](https://supabase.com/)

**PathoST-GNN** is a comprehensive web-based platform for analyzing Whole Slide Images (WSI) with integrated spatial transcriptomics (ST) data. Built for pathologists, researchers, and bioinformaticians to explore gene expression patterns in tissue samples.

---

## 🚀 Features

### 1. **Whole Slide Image (WSI) Management**
- **Upload & Processing**: Support for large-format WSI files (SVS, TIFF, NDPI)
- **Interactive Viewer**: Pan, zoom, and navigate high-resolution tissue images
- **Thumbnail Generation**: Quick preview of loaded slides
- **Metadata Tracking**: Automatic extraction of resolution, tissue type, and file information
- **File Validation**: Size limits (500MB) and format validation

### 2. **Spatial Transcriptomics Integration**
- **ST Data Points**: Overlay spatial transcriptomics data on tissue images
- **Gene Expression Mapping**: Visualize gene expression levels at specific tissue locations
- **Interactive Overlay**: Toggle ST data visualization on/off
- **Coordinate System**: Precise mapping between image coordinates and ST barcodes

### 3. **Gene Expression Analysis**
- **Gene Database**: Comprehensive gene library with symbols, names, and descriptions
- **Multi-Gene Selection**: Select and analyze multiple genes simultaneously
- **Common Markers**: Quick access to frequently used gene markers (CD3D, CD4, CD8A, etc.)
- **Expression Statistics**: 
  - Average expression values
  - Min/Max expression ranges
  - Cell count per gene
  - Normalized expression values
- **Real-time Analysis**: On-demand expression analysis with progress indicators
- **Visual Results**: Expression bars, heatmaps, and statistical summaries
- **CSV Export**: Download analysis results for external processing

### 4. **Region Annotation System**
- **Interactive Region Selection**: Draw and annotate regions of interest (ROI)
- **Custom Naming**: Label regions with descriptive names
- **Color Coding**: 8 preset colors for easy visual differentiation
- **Live Preview**: See region boundaries before saving
- **Coordinate Storage**: Precise geometric data for each annotation
- **CRUD Operations**: Create, view, edit, and delete annotations

### 5. **Analysis Session Management**
- **Session Saving**: Save complete analysis workflows
- **Auto-naming**: Intelligent session naming with timestamps
- **Parameter Tracking**: Store selected genes, regions, and settings
- **Session History**: Track analysis start and completion times
- **Status Monitoring**: Pending, running, completed, and failed states
- **Report Generation**: Export comprehensive analysis reports

### 6. **Admin Dashboard**
- **System Overview**: Real-time statistics and monitoring
- **Data Management**:
  - WSI images list with file details
  - Gene database with full CRUD operations
  - Annotation tracking
  - Session history
- **Quick Actions**:
  - Refresh data
  - Clear all data (with confirmation)
  - Delete individual items
- **Database Statistics**:
  - Total WSI count
  - Gene database size
  - Annotation count
  - Active sessions

### 7. **Sample Data System**
- **One-Click Examples**: Load complete sample datasets
- **Sample WSI**: Pre-configured breast tissue sample
- **Sample Annotations**: 3 pre-defined regions (tumor, stroma, immune)
- **Sample Genes**: Pre-selected marker genes (ACTB, CD45, etc.)
- **Sample Session**: Complete analysis workflow example

### 8. **Advanced UI Features**
- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Mode**: Theme persistence via local storage
- **Glass Morphism**: Modern frosted glass UI effects
- **Animations**: Smooth transitions and loading states
- **Status Panel**: Real-time progress indicator (0-100%)
- **Toast Notifications**: User-friendly feedback system
- **Keyboard Shortcuts**: Quick access to common actions

### 9. **Settings & Customization**
- **Visualization Settings**:
  - Grid overlay toggle
  - Region labels visibility
  - Color scheme preferences
- **Analysis Parameters**:
  - Expression thresholds
  - Normalization methods
- **Export Options**:
  - Report formats (PDF, CSV, JSON)
  - Image resolution settings
- **Persistent Preferences**: All settings saved to local storage

### 10. **Data Export & Reporting**
- **Multiple Formats**:
  - CSV: Analysis results and expression data
  - JSON: Complete session data
  - Reports: Formatted analysis summaries
- **Customizable Reports**:
  - WSI information
  - Selected genes
  - Annotation details
  - Expression statistics
  - Timestamps and metadata

---

## 🏗️ Technology Stack

### Frontend
- **React 18.3**: Modern component-based UI
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **TailwindCSS**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Lucide Icons**: Beautiful icon system

### Backend (Lovable Cloud)
- **Supabase**: PostgreSQL database
- **Row Level Security**: Data protection
- **Real-time Subscriptions**: Live data updates
- **Auto-generated Types**: Type-safe database queries

### State Management
- **React Hooks**: Custom hooks for logic
- **TanStack Query**: Server state management
- **Local Storage**: Settings persistence

---

## 📊 Database Schema

### Tables

#### `wsi_images`
- `id` (uuid, primary key)
- `filename` (text)
- `resolution_x`, `resolution_y` (integer)
- `tissue_type` (enum: breast, lung, colon, etc.)
- `file_size_mb` (numeric)
- `thumbnail_url` (text, optional)
- `metadata` (jsonb)
- `upload_date` (timestamp)

#### `genes`
- `id` (uuid, primary key)
- `gene_symbol` (text, unique)
- `gene_name` (text)
- `description` (text)
- `chromosome` (text)
- `category` (text)

#### `st_data_points`
- `id` (uuid, primary key)
- `wsi_id` (uuid, foreign key)
- `barcode` (text)
- `x_coordinate`, `y_coordinate` (numeric)
- `total_counts` (integer)

#### `gene_expressions`
- `id` (uuid, primary key)
- `st_point_id` (uuid, foreign key)
- `gene_id` (uuid, foreign key)
- `expression_value` (numeric)
- `normalized_value` (numeric)

#### `annotations`
- `id` (uuid, primary key)
- `wsi_id` (uuid, foreign key)
- `name` (text)
- `annotation_type` (enum: region, point, polygon)
- `coordinates` (jsonb)
- `color` (text)
- `description` (text)

#### `analysis_sessions`
- `id` (uuid, primary key)
- `wsi_id` (uuid, foreign key)
- `session_name` (text)
- `selected_genes` (text array)
- `parameters` (jsonb)
- `status` (enum: pending, running, completed, failed)
- `started_at`, `completed_at` (timestamp)

#### `analysis_results`
- `id` (uuid, primary key)
- `session_id` (uuid, foreign key)
- `annotation_id` (uuid, foreign key)
- `gene_id` (uuid, foreign key)
- `avg_expression`, `min_expression`, `max_expression` (numeric)
- `cell_count` (integer)
- `heatmap_data` (jsonb)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

**Quick Setup (Recommended):**
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Run setup script
./setup.sh
```

**Manual Setup:**
1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment (optional)**
```bash
cp .env.example .env
# Edit .env and add your Supabase credentials
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:8080
```

> 💡 **Tip**: The app works in demo mode without Supabase configuration!

### Quick Start Guide

1. **Load Sample Data**
   - Click the lightbulb icon (💡) in the sidebar
   - Click "Load Example" to load sample WSI, genes, and annotations

2. **Upload Your Own WSI**
   - Click "Load WSI" in the sidebar
   - Select a supported image file (< 500MB)
   - Wait for processing to complete

3. **Annotate Regions**
   - Click "Region Select" in the sidebar
   - Define region coordinates
   - Choose a color and name
   - Save the region

4. **Select Genes**
   - Use the Gene Query panel on the right
   - Search for genes or use common markers
   - Click to add genes to selection

5. **Run Analysis**
   - Click "Run Analysis" button
   - View expression statistics
   - Export results as CSV

6. **Save Session**
   - Click "Save Session" in the sidebar
   - Enter a session name
   - Session is saved to database

---

## 🎨 UI Components

### Main Layout
- **Sidebar (Left)**: Navigation and quick actions
- **Canvas Viewer (Center)**: WSI display and interaction
- **Gene Panel (Right)**: Gene selection and analysis
- **Admin Panel (Optional)**: Database management

### Key Components
- `CanvasViewer`: WSI visualization with zoom/pan
- `GeneQueryPanel`: Gene search and analysis
- `AnalysisResults`: Expression data visualization
- `StatusPanel`: Real-time progress tracking
- `AdminPanel`: System monitoring and CRUD
- `UploadDialog`: File upload with validation
- `RegionSelector`: ROI annotation tool
- `SessionDialog`: Session management
- `SettingsDialog`: User preferences

---

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL (auto-configured)
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anon key (auto-configured)
- `VITE_SUPABASE_PROJECT_ID`: Supabase project ID (auto-configured)

### Settings
All user settings are persisted in `localStorage`:
- Theme preferences
- Grid overlay settings
- Region label visibility
- Default colors
- Export preferences

---

## 📦 Custom Hooks

### `useWSI`
Manages WSI loading, storage, and clearing
```typescript
const { currentWSI, loading, loadWSI, clearWSI } = useWSI();
```

### `useGeneQuery`
Handles gene selection and expression analysis
```typescript
const { 
  availableGenes, 
  selectedGenes, 
  expressionData, 
  addGene, 
  removeGene, 
  runAnalysis 
} = useGeneQuery();
```

### `useAnnotations`
Manages region annotations
```typescript
const { annotations, addAnnotation, loadAnnotations } = useAnnotations(wsiId);
```

### `useSession`
Session management and report generation
```typescript
const { saveSession, exportReport } = useSession();
```

### `useSampleData`
Load example datasets
```typescript
const { loadCompleteExample } = useSampleData();
```

---

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AdminPanel.tsx  # Admin dashboard
│   ├── AnalysisResults.tsx  # Analysis visualization
│   ├── CanvasViewer.tsx     # WSI viewer
│   ├── GeneQueryPanel.tsx   # Gene selection
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useWSI.ts
│   ├── useGeneQuery.ts
│   ├── useAnnotations.ts
│   └── ...
├── integrations/       # External integrations
│   └── supabase/       # Supabase client & types
├── pages/              # Page components
│   ├── Index.tsx       # Main application
│   └── NotFound.tsx    # 404 page
├── lib/                # Utilities
│   └── utils.ts        # Helper functions
└── index.css           # Global styles & design tokens
```

### Design System
Colors are defined as HSL values in `src/index.css`:
```css
:root {
  --primary: 220 90% 56%;
  --accent: 170 80% 50%;
  --background: 220 15% 8%;
  /* ... more tokens */
}
```

### Adding New Features
1. Create component in `src/components/`
2. Add custom hook in `src/hooks/` if needed
3. Update database schema via Supabase if required
4. Import and use in `src/pages/Index.tsx`
5. Update this README

---

## 📚 API Reference

### Supabase Queries

#### Fetch WSI Images
```typescript
const { data, error } = await supabase
  .from("wsi_images")
  .select("*")
  .order("upload_date", { ascending: false });
```

#### Insert Annotation
```typescript
const { data, error } = await supabase
  .from("annotations")
  .insert({
    wsi_id: wsiId,
    name: "Tumor Region",
    coordinates: { x1: 0, y1: 0, x2: 100, y2: 100 },
    color: "#ff0000"
  });
```

#### Run Gene Expression Query
```typescript
const { data, error } = await supabase
  .from("gene_expressions")
  .select(`
    gene_id,
    expression_value,
    genes!inner(gene_symbol)
  `)
  .in("gene_id", selectedGeneIds);
```

---

## 🔐 Security

- **Row Level Security (RLS)**: All tables have public access policies
- **Data Validation**: Input validation on client and server
- **File Size Limits**: 500MB maximum for WSI uploads
- **Type Safety**: TypeScript for compile-time type checking
- **Error Handling**: Comprehensive error catching and user feedback

> **Note**: Current implementation uses public access. For production, implement user authentication and proper RLS policies.

---

## 🚀 Deployment

### Deploy to Netlify

This project is configured for seamless Netlify deployment.

**Quick Deploy:**
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Set environment variables (see below)
4. Deploy automatically

**Detailed Guides:**
- 📖 [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) - Complete deployment guide
- 📋 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- 📄 [DEPLOYMENT.md](./DEPLOYMENT.md) - Configuration details

**Required Environment Variables:**
```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Live Demo:** [https://spasial.netlify.app](https://spasial.netlify.app)

### Deploy to Other Platforms

The project also works with:
- **Vercel**: Update build command to `npm run build`
- **Cloudflare Pages**: Same configuration as Netlify
- **AWS Amplify**: Use the provided `netlify.toml` as reference

### Custom Domain

1. Go to Netlify Dashboard > Domain settings
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. SSL certificate auto-provisioned

---

## 🤝 Contributing

This project was built with [Lovable](https://lovable.dev). To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🆘 Support

- **Documentation**: [Lovable Docs](https://docs.lovable.dev)
- **Community**: [Lovable Discord](https://discord.gg/lovable)
- **Issues**: Use GitHub Issues for bug reports

---

## 🎯 Roadmap

- [ ] User authentication system
- [ ] Advanced heatmap visualizations
- [ ] Machine learning integration
- [ ] Collaborative analysis features
- [ ] Mobile app support
- [ ] 3D tissue reconstruction
- [ ] Multi-slide comparison
- [ ] Automated region detection

---

## 📸 Screenshots

### Main Interface
![Main Interface](https://via.placeholder.com/800x400?text=Main+Interface)

### Gene Expression Analysis
![Gene Analysis](https://via.placeholder.com/800x400?text=Gene+Analysis)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

---

## ⚡ Performance

- **Fast Loading**: Optimized lazy loading for large images
- **Real-time Updates**: Sub-second response times
- **Efficient Rendering**: Virtual scrolling for large datasets
- **Caching**: Smart caching strategies for frequently accessed data

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Lovable](https://lovable.dev) - AI-powered development platform
- [React](https://reactjs.org) - UI framework
- [Supabase](https://supabase.com) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [TailwindCSS](https://tailwindcss.com) - Styling framework

---

**Project URL**: https://lovable.dev/projects/d3f19f48-3853-4a50-9757-2fb99cfd4a1a

**Last Updated**: October 2025
