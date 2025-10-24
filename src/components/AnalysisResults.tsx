import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Download, TrendingUp, Activity } from "lucide-react";
import { GeneExpression } from "@/hooks/useGeneQuery";
import { toast } from "sonner";

interface AnalysisResultsProps {
  expressionData: GeneExpression[];
  onExport?: () => void;
}

export const AnalysisResults = ({ expressionData, onExport }: AnalysisResultsProps) => {
  if (expressionData.length === 0) {
    return null;
  }

  const totalCells = expressionData.reduce((sum, d) => sum + d.cell_count, 0);
  const avgOverall = expressionData.reduce((sum, d) => sum + d.avg_expression, 0) / expressionData.length;

  const handleExportCSV = () => {
    const headers = ["Gene Symbol", "Avg Expression", "Min Expression", "Max Expression", "Cell Count"];
    const rows = expressionData.map(d => [
      d.gene_symbol,
      d.avg_expression.toFixed(2),
      d.min_expression.toFixed(2),
      d.max_expression.toFixed(2),
      d.cell_count
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Analysis results exported");
  };

  return (
    <Card className="p-4 space-y-4 bg-secondary/30 border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Analysis Results</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportCSV}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 bg-background/50">
          <div className="text-xs text-muted-foreground mb-1">Total Genes</div>
          <div className="text-2xl font-bold text-primary">{expressionData.length}</div>
        </Card>
        <Card className="p-3 bg-background/50">
          <div className="text-xs text-muted-foreground mb-1">Total Cells</div>
          <div className="text-2xl font-bold text-accent">{totalCells}</div>
        </Card>
        <Card className="p-3 bg-background/50 col-span-2">
          <div className="text-xs text-muted-foreground mb-1">Average Expression</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{avgOverall.toFixed(2)}</div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Gene-by-Gene Results */}
      <ScrollArea className="h-64">
        <div className="space-y-3">
          {expressionData.map((data, index) => (
            <Card key={data.gene_id} className="p-3 bg-background/50 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="font-mono font-semibold">{data.gene_symbol}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {data.cell_count} cells
                  </Badge>
                </div>
                
                {/* Expression Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Expression Level</span>
                    <span className="font-semibold text-foreground">{data.avg_expression.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700"
                      style={{ width: `${Math.min(100, data.avg_expression)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Min: {data.min_expression.toFixed(2)}</span>
                    <span>Max: {data.max_expression.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
