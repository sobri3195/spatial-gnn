import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Maximize2, Move, Info } from "lucide-react";
import { toast } from "sonner";
import type { WSIData } from "@/hooks/useWSI";
import type { Annotation } from "@/hooks/useAnnotations";

interface CanvasViewerProps {
  currentWSI: WSIData | null;
  annotations: Annotation[];
  showSTOverlay: boolean;
  onLoadWSI: () => void;
}

export const CanvasViewer = ({ 
  currentWSI, 
  annotations, 
  showSTOverlay,
  onLoadWSI 
}: CanvasViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [panMode, setPanMode] = useState(true);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 200);
    setZoom(newZoom);
    toast.info(`Zoom: ${newZoom}%`);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 50);
    setZoom(newZoom);
    toast.info(`Zoom: ${newZoom}%`);
  };

  const handleResetZoom = () => {
    setZoom(100);
    toast.info("Zoom reset to 100%");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="glass-panel border-b border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant={panMode ? "secondary" : "ghost"} 
            size="sm" 
            className="gap-2"
            onClick={() => setPanMode(!panMode)}
          >
            <Move className="w-4 h-4" />
            <span className="text-sm">Pan</span>
          </Button>
          <div className="w-px h-6 bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <button
            onClick={handleResetZoom}
            className="text-sm font-mono text-muted-foreground min-w-[4rem] text-center hover:text-foreground transition-colors cursor-pointer"
          >
            {zoom}%
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border" />
          <Button variant="ghost" size="sm" onClick={handleResetZoom}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {currentWSI && (
            <Badge variant="outline" className="gap-2 text-xs">
              <Info className="w-3 h-3" />
              {annotations.length} Annotation{annotations.length !== 1 ? 's' : ''}
            </Badge>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm border ${showSTOverlay ? 'bg-primary/30 border-primary' : 'bg-muted border-border'}`} />
              <span>ST Overlay</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-accent/30 border border-accent" />
              <span>Regions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Gradient Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />
        </div>

        {/* Canvas Content */}
        {currentWSI ? (
          <div className="absolute inset-0 p-8">
            <div 
              className="w-full h-full relative rounded-lg overflow-hidden border border-border/50 bg-gradient-to-br from-muted/30 to-background shadow-2xl"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
            >
              {/* WSI Simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
              
              {/* ST Overlay Points */}
              {showSTOverlay && (
                <div className="absolute inset-0">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary/40 border border-primary animate-pulse"
                      style={{
                        left: `${Math.random() * 90 + 5}%`,
                        top: `${Math.random() * 90 + 5}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Annotations */}
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="absolute rounded-lg border-2 bg-transparent pointer-events-none"
                  style={{
                    borderColor: annotation.color,
                    left: '20%',
                    top: '20%',
                    width: '30%',
                    height: '30%',
                    boxShadow: `0 0 20px ${annotation.color}50`
                  }}
                >
                  <div 
                    className="absolute -top-6 left-0 text-xs font-medium px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: annotation.color,
                      color: 'white'
                    }}
                  >
                    {annotation.name}
                  </div>
                </div>
              ))}

              {/* WSI Info Overlay */}
              <div className="absolute bottom-4 left-4 glass-panel p-3 text-xs space-y-1">
                <div className="font-semibold text-foreground">{currentWSI.filename}</div>
                <div className="text-muted-foreground">
                  {currentWSI.resolution_x} × {currentWSI.resolution_y} px
                </div>
                <div className="text-muted-foreground">
                  {currentWSI.tissue_type} | {currentWSI.file_size_mb.toFixed(2)} MB
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-24 h-24 mx-auto rounded-2xl glass-panel flex items-center justify-center glow-effect">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  No WSI Loaded
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload a Whole Slide Image to begin analysis
                </p>
              </div>
              <Button className="gap-2" onClick={onLoadWSI}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Load New WSI
              </Button>
            </div>
          </div>
        )}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>
    </div>
  );
};
