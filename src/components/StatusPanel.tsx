import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import type { WSIData } from "@/hooks/useWSI";
import type { Annotation } from "@/hooks/useAnnotations";

interface StatusPanelProps {
  currentWSI: WSIData | null;
  annotations: Annotation[];
  selectedGenes: string[];
  analysisRunning: boolean;
}

export const StatusPanel = ({ 
  currentWSI, 
  annotations, 
  selectedGenes,
  analysisRunning 
}: StatusPanelProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let calculatedProgress = 0;
    
    if (currentWSI) calculatedProgress += 40;
    if (annotations.length > 0) calculatedProgress += 20;
    if (selectedGenes.length > 0) calculatedProgress += 20;
    if (analysisRunning) calculatedProgress += 20;
    
    setProgress(calculatedProgress);
  }, [currentWSI, annotations, selectedGenes, analysisRunning]);

  const getStatusText = () => {
    if (progress === 0) return "Idle";
    if (progress < 50) return "Getting Started";
    if (progress < 80) return "In Progress";
    if (progress < 100) return "Almost Ready";
    return "Ready";
  };

  const getStatusColor = () => {
    if (progress === 0) return "text-muted-foreground";
    if (progress < 50) return "text-yellow-500";
    if (progress < 80) return "text-blue-500";
    return "text-accent";
  };

  return (
    <div className="glass-panel rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Status</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 0 ? 'bg-accent animate-pulse' : 'bg-muted'}`} />
          <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${currentWSI ? 'bg-green-500' : 'bg-muted'}`} />
          <span className="text-muted-foreground">WSI Loaded</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${annotations.length > 0 ? 'bg-green-500' : 'bg-muted'}`} />
          <span className="text-muted-foreground">{annotations.length} Regions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${selectedGenes.length > 0 ? 'bg-green-500' : 'bg-muted'}`} />
          <span className="text-muted-foreground">{selectedGenes.length} Genes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${analysisRunning ? 'bg-green-500' : 'bg-muted'}`} />
          <span className="text-muted-foreground">Analysis</span>
        </div>
      </div>
      
      <div className="text-xs text-center text-muted-foreground pt-1 border-t border-border/50">
        {progress}% Complete
      </div>
    </div>
  );
};
