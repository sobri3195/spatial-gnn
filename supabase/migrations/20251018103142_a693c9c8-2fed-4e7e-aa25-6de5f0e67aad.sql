-- Create enum types
CREATE TYPE public.tissue_type AS ENUM ('lung', 'breast', 'liver', 'brain', 'kidney', 'colon');
CREATE TYPE public.analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE public.annotation_type AS ENUM ('region', 'marker', 'measurement');

-- Table for Whole Slide Images
CREATE TABLE public.wsi_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  tissue_type tissue_type NOT NULL,
  resolution_x INTEGER NOT NULL,
  resolution_y INTEGER NOT NULL,
  file_size_mb NUMERIC(10,2),
  upload_date TIMESTAMPTZ DEFAULT now(),
  metadata JSONB,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for Spatial Transcriptomics data points
CREATE TABLE public.st_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wsi_id UUID REFERENCES public.wsi_images(id) ON DELETE CASCADE,
  x_coordinate NUMERIC(12,4) NOT NULL,
  y_coordinate NUMERIC(12,4) NOT NULL,
  barcode TEXT,
  total_counts INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for genes
CREATE TABLE public.genes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gene_symbol TEXT UNIQUE NOT NULL,
  gene_name TEXT,
  description TEXT,
  chromosome TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for gene expression data
CREATE TABLE public.gene_expressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  st_point_id UUID REFERENCES public.st_data_points(id) ON DELETE CASCADE,
  gene_id UUID REFERENCES public.genes(id) ON DELETE CASCADE,
  expression_value NUMERIC(12,6) NOT NULL,
  normalized_value NUMERIC(12,6),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(st_point_id, gene_id)
);

-- Table for regions/annotations
CREATE TABLE public.annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wsi_id UUID REFERENCES public.wsi_images(id) ON DELETE CASCADE,
  annotation_type annotation_type DEFAULT 'region',
  name TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  color TEXT DEFAULT '#00ffff',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for analysis sessions
CREATE TABLE public.analysis_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wsi_id UUID REFERENCES public.wsi_images(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  status analysis_status DEFAULT 'pending',
  selected_genes TEXT[],
  parameters JSONB,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for analysis results
CREATE TABLE public.analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
  annotation_id UUID REFERENCES public.annotations(id) ON DELETE SET NULL,
  gene_id UUID REFERENCES public.genes(id) ON DELETE CASCADE,
  avg_expression NUMERIC(12,6),
  max_expression NUMERIC(12,6),
  min_expression NUMERIC(12,6),
  cell_count INTEGER,
  heatmap_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS but make everything public (no auth needed)
ALTER TABLE public.wsi_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gene_expressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no auth required)
CREATE POLICY "Public read access" ON public.wsi_images FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.wsi_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.wsi_images FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.wsi_images FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.st_data_points FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.st_data_points FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.st_data_points FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.st_data_points FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.genes FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.genes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.genes FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.genes FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.gene_expressions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.gene_expressions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.gene_expressions FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.gene_expressions FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.annotations FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.annotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.annotations FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.annotations FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.analysis_sessions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.analysis_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.analysis_sessions FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.analysis_sessions FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.analysis_results FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.analysis_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.analysis_results FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.analysis_results FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_st_data_points_wsi_id ON public.st_data_points(wsi_id);
CREATE INDEX idx_st_data_points_coordinates ON public.st_data_points(x_coordinate, y_coordinate);
CREATE INDEX idx_gene_expressions_st_point ON public.gene_expressions(st_point_id);
CREATE INDEX idx_gene_expressions_gene ON public.gene_expressions(gene_id);
CREATE INDEX idx_annotations_wsi_id ON public.annotations(wsi_id);
CREATE INDEX idx_analysis_sessions_wsi_id ON public.analysis_sessions(wsi_id);
CREATE INDEX idx_analysis_results_session ON public.analysis_results(session_id);

-- Insert sample genes
INSERT INTO public.genes (gene_symbol, gene_name, description, chromosome, category) VALUES
('COL1A1', 'Collagen Type I Alpha 1', 'Major component of type I collagen', '17', 'Structural'),
('ACTB', 'Actin Beta', 'Cytoskeletal structural protein', '7', 'Housekeeping'),
('GAPDH', 'Glyceraldehyde-3-Phosphate Dehydrogenase', 'Glycolytic enzyme', '12', 'Housekeeping'),
('CD45', 'Protein Tyrosine Phosphatase Receptor Type C', 'Pan-leukocyte marker', '1', 'Immune'),
('CD3', 'T-Cell Surface Glycoprotein CD3', 'T cell marker', '11', 'Immune'),
('CD8', 'T-Cell Surface Glycoprotein CD8', 'Cytotoxic T cell marker', '2', 'Immune'),
('FOXP3', 'Forkhead Box P3', 'Regulatory T cell marker', 'X', 'Immune'),
('IL2', 'Interleukin 2', 'T cell growth factor', '4', 'Cytokine'),
('EPCAM', 'Epithelial Cell Adhesion Molecule', 'Epithelial marker', '2', 'Epithelial'),
('KRT19', 'Keratin 19', 'Epithelial marker', '17', 'Epithelial'),
('VIM', 'Vimentin', 'Mesenchymal marker', '10', 'Mesenchymal'),
('CDH1', 'Cadherin 1', 'E-cadherin, epithelial marker', '16', 'Epithelial'),
('PECAM1', 'Platelet Endothelial Cell Adhesion Molecule', 'CD31, endothelial marker', '17', 'Endothelial'),
('VEGFA', 'Vascular Endothelial Growth Factor A', 'Angiogenesis factor', '6', 'Growth Factor'),
('MKI67', 'Marker of Proliferation Ki-67', 'Proliferation marker', '10', 'Proliferation');

-- Insert sample WSI images
INSERT INTO public.wsi_images (filename, tissue_type, resolution_x, resolution_y, file_size_mb, metadata, thumbnail_url) VALUES
('lung_sample_001.svs', 'lung', 50000, 45000, 2450.50, '{"scanner": "Aperio AT2", "magnification": "40x", "stain": "H&E"}', '/placeholder.svg'),
('breast_cancer_002.ndpi', 'breast', 60000, 55000, 3120.75, '{"scanner": "Hamamatsu NanoZoomer", "magnification": "40x", "stain": "H&E"}', '/placeholder.svg'),
('liver_tissue_003.tif', 'liver', 45000, 42000, 2100.25, '{"scanner": "Leica Aperio", "magnification": "20x", "stain": "H&E"}', '/placeholder.svg');

-- Get IDs for sample data
DO $$
DECLARE
  wsi1_id UUID;
  wsi2_id UUID;
  gene_col1a1_id UUID;
  gene_actb_id UUID;
  gene_cd45_id UUID;
  gene_cd3_id UUID;
  gene_epcam_id UUID;
  st_point_id UUID;
BEGIN
  -- Get WSI IDs
  SELECT id INTO wsi1_id FROM public.wsi_images WHERE filename = 'lung_sample_001.svs';
  SELECT id INTO wsi2_id FROM public.wsi_images WHERE filename = 'breast_cancer_002.ndpi';
  
  -- Get gene IDs
  SELECT id INTO gene_col1a1_id FROM public.genes WHERE gene_symbol = 'COL1A1';
  SELECT id INTO gene_actb_id FROM public.genes WHERE gene_symbol = 'ACTB';
  SELECT id INTO gene_cd45_id FROM public.genes WHERE gene_symbol = 'CD45';
  SELECT id INTO gene_cd3_id FROM public.genes WHERE gene_symbol = 'CD3';
  SELECT id INTO gene_epcam_id FROM public.genes WHERE gene_symbol = 'EPCAM';

  -- Insert sample ST data points for WSI 1 (100 points)
  FOR i IN 1..100 LOOP
    INSERT INTO public.st_data_points (wsi_id, x_coordinate, y_coordinate, barcode, total_counts)
    VALUES (
      wsi1_id,
      (random() * 45000)::NUMERIC(12,4),
      (random() * 40000)::NUMERIC(12,4),
      'BARCODE_' || LPAD(i::TEXT, 5, '0'),
      (500 + random() * 2000)::INTEGER
    );
  END LOOP;

  -- Insert sample ST data points for WSI 2 (100 points)
  FOR i IN 1..100 LOOP
    INSERT INTO public.st_data_points (wsi_id, x_coordinate, y_coordinate, barcode, total_counts)
    VALUES (
      wsi2_id,
      (random() * 55000)::NUMERIC(12,4),
      (random() * 50000)::NUMERIC(12,4),
      'BARCODE_' || LPAD((i+100)::TEXT, 5, '0'),
      (600 + random() * 2500)::INTEGER
    );
  END LOOP;

  -- Insert sample gene expressions for each ST point (5 genes per point)
  FOR st_point_id IN SELECT id FROM public.st_data_points LIMIT 50 LOOP
    INSERT INTO public.gene_expressions (st_point_id, gene_id, expression_value, normalized_value)
    VALUES 
      (st_point_id, gene_col1a1_id, (random() * 100)::NUMERIC(12,6), (random() * 10)::NUMERIC(12,6)),
      (st_point_id, gene_actb_id, (50 + random() * 50)::NUMERIC(12,6), (5 + random() * 5)::NUMERIC(12,6)),
      (st_point_id, gene_cd45_id, (random() * 80)::NUMERIC(12,6), (random() * 8)::NUMERIC(12,6)),
      (st_point_id, gene_cd3_id, (random() * 60)::NUMERIC(12,6), (random() * 6)::NUMERIC(12,6)),
      (st_point_id, gene_epcam_id, (random() * 90)::NUMERIC(12,6), (random() * 9)::NUMERIC(12,6));
  END LOOP;

  -- Insert sample annotations
  INSERT INTO public.annotations (wsi_id, annotation_type, name, coordinates, color, description)
  VALUES 
    (wsi1_id, 'region', 'Tumor Region 1', '{"type": "polygon", "points": [[1000, 1000], [5000, 1000], [5000, 5000], [1000, 5000]]}', '#ff6b6b', 'Primary tumor area'),
    (wsi1_id, 'region', 'Immune Infiltration', '{"type": "polygon", "points": [[6000, 6000], [10000, 6000], [10000, 10000], [6000, 10000]]}', '#4ecdc4', 'High immune cell density'),
    (wsi2_id, 'region', 'Stromal Area', '{"type": "polygon", "points": [[2000, 2000], [8000, 2000], [8000, 8000], [2000, 8000]]}', '#95e1d3', 'Connective tissue region'),
    (wsi2_id, 'marker', 'Necrotic Focus', '{"type": "circle", "center": [15000, 15000], "radius": 500}', '#f38181', 'Central necrosis');

  -- Insert sample analysis sessions
  INSERT INTO public.analysis_sessions (wsi_id, session_name, status, selected_genes, parameters)
  VALUES 
    (wsi1_id, 'Immune Profiling Analysis', 'completed', ARRAY['CD45', 'CD3', 'CD8', 'FOXP3'], '{"method": "GNN", "threshold": 0.5}'),
    (wsi1_id, 'Tumor Marker Expression', 'completed', ARRAY['EPCAM', 'KRT19', 'VIM'], '{"method": "Hypergraph", "layers": 3}'),
    (wsi2_id, 'Collagen Distribution', 'processing', ARRAY['COL1A1', 'VIM'], '{"method": "GNN", "neighborhood": 50}');

  -- Insert sample analysis results
  INSERT INTO public.analysis_results (session_id, gene_id, avg_expression, max_expression, min_expression, cell_count, heatmap_data)
  SELECT 
    s.id,
    gene_cd45_id,
    45.67,
    78.23,
    12.45,
    234,
    '{"resolution": [100, 100], "values": [[12.3, 15.6], [18.9, 22.1]]}'
  FROM public.analysis_sessions s
  WHERE s.session_name = 'Immune Profiling Analysis';

END $$;