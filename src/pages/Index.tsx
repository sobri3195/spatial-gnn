import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CanvasViewer } from "@/components/CanvasViewer";
import { GeneQueryPanel } from "@/components/GeneQueryPanel";
import { AdminPanel } from "@/components/AdminPanel";
import { UploadDialog } from "@/components/UploadDialog";
import { RegionSelector } from "@/components/RegionSelector";
import { SessionDialog } from "@/components/SessionDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ConfigStatus } from "@/components/ConfigStatus";
import { useWSI } from "@/hooks/useWSI";
import { useAnnotations } from "@/hooks/useAnnotations";
import { useSession } from "@/hooks/useSession";
import { useSampleData } from "@/hooks/useSampleData";
import { toast } from "sonner";

const Index = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [stOverlayEnabled, setStOverlayEnabled] = useState(true);
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(true);

  const { currentWSI, loadWSI, clearWSI } = useWSI();
  const { annotations, addAnnotation, loadAnnotations } = useAnnotations(currentWSI?.id);
  const { saveSession, exportReport } = useSession();
  const { loadCompleteExample } = useSampleData();

  const handleAction = (action: string) => {
    switch (action) {
      case "load-wsi":
        setUploadDialogOpen(true);
        break;
      case "clear-all":
        if (currentWSI) {
          clearWSI();
          setSelectedGenes([]);
        } else {
          toast.info("No data to clear");
        }
        break;
      case "gene-query":
        toast.info("Gene query panel is ready");
        break;
      case "region-select":
        if (!currentWSI) {
          toast.error("Please load a WSI first");
          return;
        }
        setRegionDialogOpen(true);
        break;
      case "st-overlay":
        setStOverlayEnabled(!stOverlayEnabled);
        toast.success(`ST overlay ${!stOverlayEnabled ? "enabled" : "disabled"}`);
        break;
      case "save-session":
        if (!currentWSI) {
          toast.error("Please load a WSI first");
          return;
        }
        setSessionDialogOpen(true);
        break;
      case "export":
        if (!currentWSI) {
          toast.error("No data to export");
          return;
        }
        exportReport({
          wsi: currentWSI,
          genes: selectedGenes,
          annotations,
          sessionName: `Analisis_${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}`,
        });
        break;
      case "settings":
        setSettingsDialogOpen(true);
        break;
      case "toggle-admin":
        setShowAdminPanel(!showAdminPanel);
        toast.success(`Admin panel ${!showAdminPanel ? "opened" : "closed"}`);
        break;
      case "load-example":
        loadCompleteExample().then((wsi) => {
          if (wsi) {
            loadAnnotations(wsi.id);
            setSelectedGenes(["CD3D", "CD4", "CD8A", "CD19", "EPCAM"]);
          }
        });
        break;
      default:
        console.log("Action:", action);
    }
  };

  const handleFileUpload = async (file: File) => {
    await loadWSI(file);
  };

  const handleAddRegion = async (region: { name: string; coordinates: any; color: string }) => {
    if (currentWSI) {
      await addAnnotation(currentWSI.id, {
        name: region.name,
        annotation_type: "region",
        coordinates: region.coordinates,
        color: region.color,
      });
    }
  };

  const handleSaveSession = async (sessionName: string) => {
    if (currentWSI) {
      await saveSession(sessionName, currentWSI.id, selectedGenes, {
        stOverlayEnabled,
        annotations: annotations.length,
      });
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        onAction={handleAction}
        currentWSI={currentWSI}
        annotations={annotations}
        selectedGenes={selectedGenes}
        analysisRunning={analysisRunning}
      />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <ConfigStatus />
          </div>
          <div className="flex-1">
            <CanvasViewer 
              currentWSI={currentWSI}
              annotations={annotations}
              showSTOverlay={stOverlayEnabled}
              onLoadWSI={() => setUploadDialogOpen(true)}
            />
          </div>
        </div>

        {/* Right Panel - Gene Query */}
        <div className="w-96">
          <GeneQueryPanel 
            onGenesChange={setSelectedGenes}
            onAnalysisStateChange={setAnalysisRunning}
          />
        </div>

        {/* Admin Panel (Optional) */}
        {showAdminPanel && (
          <div className="w-80">
            <AdminPanel />
          </div>
        )}
      </div>

      {/* Dialogs */}
      <UploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen}
        onUpload={handleFileUpload}
      />
      <RegionSelector
        open={regionDialogOpen}
        onOpenChange={setRegionDialogOpen}
        onAddRegion={handleAddRegion}
      />
      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        onSave={handleSaveSession}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </div>
  );
};

export default Index;
