import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [autoSave, setAutoSave] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState([70]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("pathost-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAutoSave(settings.autoSave ?? true);
        setShowOverlay(settings.showOverlay ?? true);
        setOverlayOpacity([settings.overlayOpacity ?? 70]);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage
    const settings = {
      autoSave,
      showOverlay,
      overlayOpacity: overlayOpacity[0],
    };
    localStorage.setItem("pathost-settings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your analysis preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-save Sessions</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save your work every 5 minutes
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-overlay">Show ST Overlay</Label>
              <p className="text-sm text-muted-foreground">
                Display spatial transcriptomics data overlay
              </p>
            </div>
            <Switch
              id="show-overlay"
              checked={showOverlay}
              onCheckedChange={setShowOverlay}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="overlay-opacity">Overlay Opacity</Label>
              <span className="text-sm text-muted-foreground">{overlayOpacity[0]}%</span>
            </div>
            <Slider
              id="overlay-opacity"
              value={overlayOpacity}
              onValueChange={setOverlayOpacity}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
