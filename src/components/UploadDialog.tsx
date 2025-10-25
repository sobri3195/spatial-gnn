import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileImage, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_EXTENSIONS = ['.svs', '.tif', '.tiff', '.ndpi', '.vms', '.vmu'];

export const UploadDialog = ({ open, onOpenChange, onUpload }: UploadDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setUploadedFile(null);
      setUploading(false);
      setUploadProgress(0);
      setError("");
    }
  }, [open]);

  const validateFile = (file: File): string | null => {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return `Invalid file format. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }
      setError("");
      setUploadedFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }
      setError("");
      setUploadedFile(file);
    }
  };

  const handleUpload = async () => {
    if (uploadedFile && !uploading) {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        await onUpload(uploadedFile);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadedFile(null);
          setUploading(false);
          setUploadProgress(0);
          onOpenChange(false);
        }, 500);
      } catch (error) {
        clearInterval(progressInterval);
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Load Whole Slide Image
          </DialogTitle>
          <DialogDescription>
            Upload a WSI file to begin analysis. Supported formats: {ALLOWED_EXTENSIONS.join(', ')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : error
                ? "border-destructive/50"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              {uploadedFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileImage className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Drag and drop your WSI file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".svs,.tif,.ndpi"
                    onChange={handleFileInput}
                  />
                </>
              )}
            </div>
          </div>

          {/* File Info & Progress */}
          {uploadedFile && (
            <div className="glass-panel rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-mono text-foreground">
                    {uploadedFile.name.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-mono text-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className={uploading ? "text-primary border-primary" : "text-accent border-accent"}>
                    {uploading ? "Processing..." : "Ready to process"}
                  </Badge>
                </div>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              disabled={!uploadedFile || uploading || !!error} 
              className="gap-2" 
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Load WSI
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

