import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, TrendingUp, Database, Loader2 } from "lucide-react";
import { useGeneQuery } from "@/hooks/useGeneQuery";
import { useEffect } from "react";
import { AnalysisResults } from "./AnalysisResults";

interface GeneQueryPanelProps {
  onGenesChange?: (genes: string[]) => void;
  onAnalysisStateChange?: (running: boolean) => void;
}

export const GeneQueryPanel = ({ 
  onGenesChange, 
  onAnalysisStateChange 
}: GeneQueryPanelProps) => {
  const [query, setQuery] = useState("");
  const { 
    availableGenes, 
    selectedGenes, 
    expressionData, 
    loading, 
    addGene, 
    removeGene, 
    runAnalysis 
  } = useGeneQuery();

  const commonGenes = availableGenes.slice(0, 8).map(g => g.gene_symbol);

  const handleAddFromInput = () => {
    if (query.trim()) {
      addGene(query.toUpperCase());
      setQuery("");
    }
  };

  // Notify parent of gene changes
  useEffect(() => {
    if (onGenesChange) {
      onGenesChange(selectedGenes);
    }
  }, [selectedGenes, onGenesChange]);

  // Notify parent of analysis state
  useEffect(() => {
    if (onAnalysisStateChange) {
      onAnalysisStateChange(loading);
    }
  }, [loading, onAnalysisStateChange]);

  const handleRunAnalysis = async () => {
    await runAnalysis();
  };

  return (
    <div className="h-full glass-panel border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Gene Query</h2>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search genes (e.g., COL1A1)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddFromInput();
              }
            }}
          />
        </div>
      </div>

      {/* Selected Genes */}
      {selectedGenes.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Selected Genes
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedGenes.map((gene) => (
              <Badge
                key={gene}
                variant="secondary"
                className="gap-1 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
              >
                {gene}
                <button
                  onClick={() => removeGene(gene)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Common Genes */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-accent" />
              <div className="text-xs font-medium text-muted-foreground">
                Common Markers
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {commonGenes.map((gene) => (
                <Button
                  key={gene}
                  variant="outline"
                  size="sm"
                  onClick={() => addGene(gene)}
                  disabled={selectedGenes.includes(gene)}
                  className="justify-start hover:border-primary hover:text-primary transition-all"
                >
                  {gene}
                </Button>
              ))}
            </div>
          </div>

          {/* Analysis Results */}
          {expressionData.length > 0 && (
            <AnalysisResults expressionData={expressionData} />
          )}
        </div>
      </ScrollArea>

      {/* Action Button */}
      <div className="p-4 border-t border-border">
        <Button
          className="w-full gap-2"
          disabled={selectedGenes.length === 0 || loading}
          onClick={handleRunAnalysis}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Run Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
