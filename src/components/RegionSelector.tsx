import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MousePointer2, Plus, Palette } from "lucide-react";
import { toast } from "sonner";

interface RegionSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRegion: (region: { name: string; coordinates: any; color: string }) => void;
}

const PRESET_COLORS = [
  "#00ffff", "#ff00ff", "#ffff00", "#00ff00",
  "#ff0000", "#0000ff", "#ff8800", "#8800ff"
];

export const RegionSelector = ({ open, onOpenChange, onAddRegion }: RegionSelectorProps) => {
  const [regionName, setRegionName] = useState("");
  const [color, setColor] = useState("#00ffff");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      // Generate default name
      const timestamp = Date.now().toString().slice(-4);
      setRegionName(`Region_${timestamp}`);
      setError("");
    }
  }, [open]);

  const handleAddRegion = () => {
    const trimmedName = regionName.trim();

    if (!trimmedName) {
      setError("Region name is required");
      toast.error("Please enter a region name");
      return;
    }

    if (trimmedName.length < 3) {
      setError("Region name must be at least 3 characters");
      return;
    }

    // Simulate region selection with random coordinates
    const coordinates = {
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 1000),
      width: Math.floor(Math.random() * 500) + 200,
      height: Math.floor(Math.random() * 500) + 200,
    };

    onAddRegion({
      name: trimmedName,
      coordinates,
      color,
    });

    toast.success(`Region "${trimmedName}" added successfully`);
    setRegionName("");
    setColor("#00ffff");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-primary" />
            Select Region
          </DialogTitle>
          <DialogDescription>
            Define a region of interest on the WSI for analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="region-name">Region Name</Label>
            <Input
              id="region-name"
              placeholder="e.g., Tumor Region 1"
              value={regionName}
              onChange={(e) => {
                setRegionName(e.target.value);
                setError("");
              }}
              className={`glass-panel ${error ? "border-destructive" : ""}`}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <Label htmlFor="region-color">Region Color</Label>
            </div>
            
            {/* Preset Colors */}
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                    color === presetColor ? "border-foreground ring-2 ring-primary" : "border-border"
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                id="region-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="glass-panel flex-1 font-mono"
                placeholder="#00ffff"
              />
            </div>
          </div>

          <div className="glass-panel rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Preview</span>
              <Badge 
                variant="outline" 
                style={{ 
                  backgroundColor: `${color}20`, 
                  borderColor: color,
                  color: color 
                }}
              >
                {regionName || "Region Name"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Click on the canvas to define the region boundaries after creating the region.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRegion} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Region
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
