import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnalysisSession {
  id: string;
  session_name: string;
  wsi_id?: string;
  selected_genes: string[];
  parameters: any;
  status: string;
  started_at?: string;
  completed_at?: string;
}

export const useSession = () => {
  const [currentSession, setCurrentSession] = useState<AnalysisSession | null>(null);
  const [saving, setSaving] = useState(false);

  const saveSession = async (
    sessionName: string,
    wsiId: string | undefined,
    selectedGenes: string[],
    parameters: any = {}
  ) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("analysis_sessions")
        .insert({
          session_name: sessionName,
          wsi_id: wsiId,
          selected_genes: selectedGenes,
          parameters,
          status: "completed",
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data as AnalysisSession);
      toast.success(`Session "${sessionName}" saved`);
      return data;
    } catch (error: any) {
      toast.error("Failed to save session: " + error.message);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from("analysis_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;

      setCurrentSession(data as AnalysisSession);
      toast.success("Session loaded");
      return data;
    } catch (error: any) {
      toast.error("Failed to load session: " + error.message);
    }
  };

  const exportReport = async (sessionData: any) => {
    try {
      const now = new Date();
      const report = {
        session_name: sessionData.sessionName || "Laporan Analisis",
        timestamp: now.toISOString(),
        tanggal: now.toLocaleDateString('id-ID', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        wsi_info: sessionData.wsi,
        selected_genes: sessionData.genes,
        results: sessionData.results,
        annotations: sessionData.annotations,
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const today = now.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
      a.download = `laporan_pathostgnn_${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report exported successfully");
    } catch (error: any) {
      toast.error("Failed to export report: " + error.message);
    }
  };

  return {
    currentSession,
    saving,
    saveSession,
    loadSession,
    exportReport,
  };
};
