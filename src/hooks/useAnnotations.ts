import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Annotation {
  id: string;
  wsi_id: string;
  name: string;
  annotation_type: string;
  coordinates: any;
  color: string;
  description?: string;
}

export const useAnnotations = (wsiId?: string) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  const loadAnnotations = useCallback(async (wsiId: string) => {
    try {
      const { data, error } = await supabase
        .from("annotations")
        .select("*")
        .eq("wsi_id", wsiId);

      if (error) throw error;
      setAnnotations(data || []);
    } catch (error: any) {
      toast.error("Failed to load annotations: " + error.message);
    }
  }, []);

  useEffect(() => {
    if (wsiId) {
      loadAnnotations(wsiId);
    }
  }, [wsiId, loadAnnotations]);

  const addAnnotation = async (wsiId: string, annotation: Partial<Annotation>) => {
    try {
      const annotationType = (annotation.annotation_type || "region") as "region" | "marker" | "measurement";
      const { data, error } = await supabase
        .from("annotations")
        .insert([{
          wsi_id: wsiId,
          name: annotation.name || "Region",
          annotation_type: annotationType,
          coordinates: annotation.coordinates || {},
          color: annotation.color || "#00ffff",
          description: annotation.description,
        }])
        .select()
        .single();

      if (error) throw error;

      setAnnotations([...annotations, data]);
      toast.success("Annotation added");
      return data;
    } catch (error: any) {
      toast.error("Failed to add annotation: " + error.message);
    }
  };

  const deleteAnnotation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("annotations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAnnotations(annotations.filter(a => a.id !== id));
      toast.success("Annotation deleted");
    } catch (error: any) {
      toast.error("Failed to delete annotation: " + error.message);
    }
  };

  return {
    annotations,
    selectedAnnotation,
    setSelectedAnnotation,
    addAnnotation,
    deleteAnnotation,
    loadAnnotations,
  };
};
