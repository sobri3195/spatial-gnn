-- Add sample genes data
INSERT INTO genes (gene_symbol, gene_name, description, category) VALUES
('CD3D', 'CD3 Delta', 'T-cell marker', 'immune'),
('CD4', 'CD4 Antigen', 'Helper T-cell marker', 'immune'),
('CD8A', 'CD8 Alpha', 'Cytotoxic T-cell marker', 'immune'),
('CD19', 'CD19 Antigen', 'B-cell marker', 'immune'),
('CD68', 'CD68 Antigen', 'Macrophage marker', 'immune'),
('EPCAM', 'Epithelial Cell Adhesion Molecule', 'Epithelial marker', 'epithelial'),
('KRT18', 'Keratin 18', 'Epithelial marker', 'epithelial'),
('VIM', 'Vimentin', 'Mesenchymal marker', 'stromal'),
('COL1A1', 'Collagen Type I Alpha 1', 'Stromal marker', 'stromal'),
('ACTA2', 'Actin Alpha 2', 'Smooth muscle marker', 'stromal')
ON CONFLICT DO NOTHING;

-- Add sample ST data points (for testing gene expressions)
INSERT INTO st_data_points (barcode, x_coordinate, y_coordinate, total_counts) 
SELECT 
  'BARCODE_' || i,
  (random() * 1000)::numeric,
  (random() * 1000)::numeric,
  (1000 + random() * 5000)::integer
FROM generate_series(1, 100) i
ON CONFLICT DO NOTHING;

-- Add sample gene expressions
INSERT INTO gene_expressions (gene_id, st_point_id, expression_value, normalized_value)
SELECT 
  g.id,
  s.id,
  (random() * 100)::numeric,
  (random())::numeric
FROM genes g
CROSS JOIN st_data_points s
LIMIT 1000
ON CONFLICT DO NOTHING;