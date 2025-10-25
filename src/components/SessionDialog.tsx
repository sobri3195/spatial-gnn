import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sessionName: string) => void;
}

export const SessionDialog = ({ open, onOpenChange, onSave }: SessionDialogProps) => {
  const [sessionName, setSessionName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      // Generate default name with timestamp
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
      const defaultName = `Analisis_${today}_${Date.now().toString().slice(-4)}`;
      setSessionName(defaultName);
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    const trimmedName = sessionName.trim();
    
    if (!trimmedName) {
      setError("Session name is required");
      toast.error("Please enter a session name");
      return;
    }

    if (trimmedName.length < 3) {
      setError("Session name must be at least 3 characters");
      toast.error("Session name too short");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Session name must be less than 100 characters");
      toast.error("Session name too long");
      return;
    }

    onSave(trimmedName);
    setSessionName("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Save className="w-5 h-5 text-primary" />
            Save Session
          </DialogTitle>
          <DialogDescription>
            Save your current analysis session for later use
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-name">Session Name</Label>
            <Input
              id="session-name"
              placeholder="e.g., Breast Cancer Analysis 2024"
              value={sessionName}
              onChange={(e) => {
                setSessionName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className={`glass-panel ${error ? "border-destructive" : ""}`}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          <div className="glass-panel rounded-lg p-3 text-xs text-muted-foreground">
            Session will save: WSI data, selected genes, annotations, and analysis results
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!sessionName.trim()} className="gap-2">
              <Save className="w-4 h-4" />
              Save Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
