import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WSIData {
  id: string;
  filename: string;
  resolution_x: number;
  resolution_y: number;
  tissue_type: string;
  file_size_mb: number;
  upload_date: string;
  thumbnail_url?: string;
  metadata?: any;
}

export const useWSI = () => {
  const [currentWSI, setCurrentWSI] = useState<WSIData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadWSI = async (file: File) => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        toast.warning("Running in demo mode - data will not persist");
        // Create demo WSI for local testing
        const demoData: WSIData = {
          id: crypto.randomUUID(),
          filename: file.name,
          resolution_x: 20000,
          resolution_y: 15000,
          tissue_type: "breast",
          file_size_mb: file.size / (1024 * 1024),
          upload_date: new Date().toISOString(),
          metadata: {
            original_size: file.size,
            format: file.name.split('.').pop(),
            demo_mode: true
          }
        };
        setCurrentWSI(demoData);
        toast.success(`WSI loaded (demo): ${file.name}`);
        return demoData;
      }

      // Simulate processing
      const resolution = { x: 20000, y: 15000 };
      
      const { data, error } = await supabase
        .from("wsi_images")
        .insert({
          filename: file.name,
          resolution_x: resolution.x,
          resolution_y: resolution.y,
          tissue_type: "breast",
          file_size_mb: file.size / (1024 * 1024),
          metadata: {
            original_size: file.size,
            format: file.name.split('.').pop()
          }
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentWSI(data as WSIData);
      toast.success(`WSI loaded: ${file.name}`);
      return data;
    } catch (error: any) {
      toast.error("Failed to load WSI: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearWSI = async () => {
    if (!currentWSI) return;
    
    try {
      const { error } = await supabase
        .from("wsi_images")
        .delete()
        .eq("id", currentWSI.id);

      if (error) throw error;

      setCurrentWSI(null);
      toast.success("WSI cleared");
    } catch (error: any) {
      toast.error("Failed to clear WSI: " + error.message);
    }
  };

  return {
    currentWSI,
    loading,
    loadWSI,
    clearWSI,
  };
};
