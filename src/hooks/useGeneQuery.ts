import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Gene {
  id: string;
  gene_symbol: string;
  gene_name?: string;
  description?: string;
  category?: string;
}

export interface GeneExpression {
  gene_id: string;
  gene_symbol: string;
  avg_expression: number;
  min_expression: number;
  max_expression: number;
  cell_count: number;
}

export const useGeneQuery = () => {
  const [availableGenes, setAvailableGenes] = useState<Gene[]>([]);
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);
  const [expressionData, setExpressionData] = useState<GeneExpression[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAvailableGenes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("genes")
        .select("*")
        .order("gene_symbol");

      if (error) throw error;
      setAvailableGenes(data || []);
    } catch (error: any) {
      toast.error("Failed to load genes: " + error.message);
    }
  }, []);

  useEffect(() => {
    loadAvailableGenes();
  }, [loadAvailableGenes]);

  const runAnalysis = async (wsiId?: string) => {
    if (selectedGenes.length === 0) {
      toast.error("Please select at least one gene");
      return;
    }

    setLoading(true);
    try {
      // Get expression data for selected genes
      const { data, error } = await supabase
        .from("gene_expressions")
        .select(`
          gene_id,
          expression_value,
          normalized_value,
          genes!inner(gene_symbol)
        `)
        .in("gene_id", selectedGenes.map(symbol => 
          availableGenes.find(g => g.gene_symbol === symbol)?.id
        ).filter(Boolean));

      if (error) throw error;

      // Process results
      const processedData: Record<string, any> = {};
      
      data?.forEach((item: any) => {
        const geneSymbol = item.genes.gene_symbol;
        if (!processedData[geneSymbol]) {
          processedData[geneSymbol] = {
            values: [],
            gene_id: item.gene_id,
          };
        }
        // Ensure expression_value is a number
        const expressionValue = typeof item.expression_value === 'number' 
          ? item.expression_value 
          : parseFloat(item.expression_value || '0');
        processedData[geneSymbol].values.push(expressionValue);
      });

      const results: GeneExpression[] = Object.entries(processedData).map(([symbol, data]: [string, any]) => {
        const values = data.values.filter((v: number) => !isNaN(v) && isFinite(v));
        
        if (values.length === 0) {
          return {
            gene_id: data.gene_id,
            gene_symbol: symbol,
            avg_expression: 0,
            min_expression: 0,
            max_expression: 0,
            cell_count: 0,
          };
        }

        return {
          gene_id: data.gene_id,
          gene_symbol: symbol,
          avg_expression: Number((values.reduce((a: number, b: number) => a + b, 0) / values.length).toFixed(2)),
          min_expression: Number(Math.min(...values).toFixed(2)),
          max_expression: Number(Math.max(...values).toFixed(2)),
          cell_count: values.length,
        };
      });

      setExpressionData(results);
      
      if (results.length > 0) {
        toast.success(`Analysis complete: ${results.length} gene(s) analyzed with ${results.reduce((sum, r) => sum + r.cell_count, 0)} total cells`);
      } else {
        toast.warning("No expression data found for selected genes");
      }
    } catch (error: any) {
      toast.error("Analysis failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addGene = (geneSymbol: string) => {
    if (!selectedGenes.includes(geneSymbol)) {
      setSelectedGenes([...selectedGenes, geneSymbol]);
    }
  };

  const removeGene = (geneSymbol: string) => {
    setSelectedGenes(selectedGenes.filter(g => g !== geneSymbol));
  };

  const clearGenes = () => {
    setSelectedGenes([]);
    setExpressionData([]);
  };

  return {
    availableGenes,
    selectedGenes,
    expressionData,
    loading,
    addGene,
    removeGene,
    clearGenes,
    runAnalysis,
  };
};
