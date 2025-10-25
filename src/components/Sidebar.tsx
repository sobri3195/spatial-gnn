import { Button } from "@/components/ui/button";
import { StatusPanel } from "@/components/StatusPanel";
import type { WSIData } from "@/hooks/useWSI";
import type { Annotation } from "@/hooks/useAnnotations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Search,
  MousePointer2,
  Layers,
  Settings,
  Download,
  Save,
  Trash2,
  Activity,
  ChevronRight,
  Shield,
  Lightbulb,
} from "lucide-react";

interface SidebarProps {
  onAction: (action: string) => void;
  currentWSI: WSIData | null;
  annotations: Annotation[];
  selectedGenes: string[];
  analysisRunning: boolean;
}

export const Sidebar = ({ 
  onAction, 
  currentWSI, 
  annotations, 
  selectedGenes,
  analysisRunning 
}: SidebarProps) => {

  const sections = [
    {
      id: "upload",
      title: "Data Management",
      icon: Upload,
      items: [
        { id: "load-wsi", label: "Load New WSI", icon: Upload },
        { id: "clear-all", label: "Clear All", icon: Trash2 },
      ],
    },
    {
      id: "analysis",
      title: "Analysis Tools",
      icon: Activity,
      items: [
        { id: "gene-query", label: "Gene Query", icon: Search },
        { id: "region-select", label: "Region Selection", icon: MousePointer2 },
        { id: "st-overlay", label: "ST Data Overlay", icon: Layers },
      ],
    },
    {
      id: "session",
      title: "Session",
      icon: Save,
      items: [
        { id: "save-session", label: "Save Session", icon: Save },
        { id: "export", label: "Export Report", icon: Download },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="h-full w-72 glass-panel border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">PathoST-GNN</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <section.icon className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 hover:bg-secondary/50 hover:text-primary transition-all"
                    onClick={() => onAction(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                ))}
              </div>
              {section.id !== "session" && (
                <Separator className="my-4 bg-border/50" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Status */}
      <div className="p-4 border-t border-border space-y-2">
        <StatusPanel 
          currentWSI={currentWSI}
          annotations={annotations}
          selectedGenes={selectedGenes}
          analysisRunning={analysisRunning}
        />
        <Separator className="my-2" />
        <div className="space-y-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => onAction("toggle-admin")}
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => onAction("load-example")}
          >
            <Lightbulb className="w-4 h-4" />
            Load Example
          </Button>
        </div>
      </div>
    </div>
  );
};
