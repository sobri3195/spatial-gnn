import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSampleData = () => {
  const loadSampleWSI = async () => {
    try {
      const { data, error } = await supabase
        .from("wsi_images")
        .insert({
          filename: "sample_breast_tissue.svs",
          resolution_x: 25000,
          resolution_y: 18000,
          tissue_type: "breast",
          file_size_mb: 245.5,
          metadata: {
            original_size: 257376256,
            format: "svs",
            scanner: "Aperio AT2",
            magnification: "40x",
          },
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Sample WSI loaded successfully");
      return data;
    } catch (error: any) {
      toast.error("Failed to load sample: " + error.message);
      throw error;
    }
  };

  const loadSampleAnnotations = async (wsiId: string) => {
    const sampleAnnotations = [
      {
        wsi_id: wsiId,
        name: "Tumor Region 1",
        annotation_type: "region" as const,
        coordinates: { x: 5000, y: 3000, width: 4000, height: 3500 },
        color: "#ff0000",
        description: "Primary tumor region with high cellularity",
      },
      {
        wsi_id: wsiId,
        name: "Normal Tissue",
        annotation_type: "region" as const,
        coordinates: { x: 12000, y: 8000, width: 3000, height: 2500 },
        color: "#00ff00",
        description: "Adjacent normal breast tissue",
      },
      {
        wsi_id: wsiId,
        name: "Tumor Region 2",
        annotation_type: "region" as const,
        coordinates: { x: 18000, y: 5000, width: 3500, height: 4000 },
        color: "#ff00ff",
        description: "Secondary tumor focus",
      },
    ];

    try {
      const { error } = await supabase
        .from("annotations")
        .insert(sampleAnnotations);

      if (error) throw error;
      toast.success("Sample annotations added");
    } catch (error: any) {
      toast.error("Failed to add annotations: " + error.message);
    }
  };

  const loadSampleSession = async (wsiId: string) => {
    try {
      const { error } = await supabase
        .from("analysis_sessions")
        .insert({
          session_name: "Sample Breast Cancer Analysis",
          wsi_id: wsiId,
          selected_genes: ["CD3D", "CD4", "CD8A", "CD19", "EPCAM"],
          parameters: {
            stOverlayEnabled: true,
            annotationCount: 3,
            analysisType: "immune_profiling",
          },
          status: "completed",
        });

      if (error) throw error;
      toast.success("Sample session created");
    } catch (error: any) {
      toast.error("Failed to create session: " + error.message);
    }
  };

  const loadCompleteExample = async () => {
    try {
      toast.info("Loading complete example...");
      const wsi = await loadSampleWSI();
      if (wsi) {
        await loadSampleAnnotations(wsi.id);
        await loadSampleSession(wsi.id);
        toast.success("Complete example loaded successfully!");
        return wsi;
      }
    } catch (error: any) {
      toast.error("Failed to load example: " + error.message);
    }
  };

  return {
    loadSampleWSI,
    loadSampleAnnotations,
    loadSampleSession,
    loadCompleteExample,
  };
};
