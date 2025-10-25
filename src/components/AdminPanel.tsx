import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Database, 
  FileImage, 
  Activity, 
  TrendingUp,
  RefreshCw,
  Trash2,
  Dna,
  Bookmark,
} from "lucide-react";

export const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalWSI: 0,
    totalGenes: 0,
    totalAnnotations: 0,
    totalSessions: 0,
  });
  const [loading, setLoading] = useState(false);
  const [wsiList, setWsiList] = useState<any[]>([]);
  const [geneList, setGeneList] = useState<any[]>([]);
  const [sessionList, setSessionList] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "wsi" | "genes" | "sessions">("stats");

  const loadStats = async () => {
    setLoading(true);
    try {
      const [wsiRes, genesRes, annotationsRes, sessionsRes] = await Promise.all([
        supabase.from("wsi_images").select("*"),
        supabase.from("genes").select("*"),
        supabase.from("annotations").select("id", { count: "exact", head: true }),
        supabase.from("analysis_sessions").select("*"),
      ]);

      setStats({
        totalWSI: wsiRes.data?.length || 0,
        totalGenes: genesRes.data?.length || 0,
        totalAnnotations: annotationsRes.count || 0,
        totalSessions: sessionsRes.data?.length || 0,
      });

      setWsiList(wsiRes.data || []);
      setGeneList(genesRes.data || []);
      setSessionList(sessionsRes.data || []);
    } catch (error: any) {
      toast.error("Failed to load stats: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const { error } = await supabase
        .from(deleteTarget.type === "wsi" ? "wsi_images" : 
              deleteTarget.type === "gene" ? "genes" : "analysis_sessions")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      toast.success(`${deleteTarget.type.toUpperCase()} deleted successfully`);
      loadStats();
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    } finally {
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      return;
    }

    try {
      await Promise.all([
        supabase.from("annotations").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("wsi_images").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("analysis_sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      ]);
      
      toast.success("All data cleared successfully");
      loadStats();
    } catch (error: any) {
      toast.error("Failed to clear data: " + error.message);
    }
  };

  const statCards = [
    {
      icon: FileImage,
      label: "WSI Images",
      value: stats.totalWSI,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Dna,
      label: "Gene Markers",
      value: stats.totalGenes,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Activity,
      label: "Annotations",
      value: stats.totalAnnotations,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: Bookmark,
      label: "Sessions",
      value: stats.totalSessions,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <div className="h-full glass-panel border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadStats}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-2 border-b border-border">
        {[
          { id: "stats", label: "Stats" },
          { id: "wsi", label: "WSI" },
          { id: "genes", label: "Genes" },
          { id: "sessions", label: "Sessions" },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {activeTab === "stats" && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 gap-3">
                {statCards.map((stat) => (
                  <Card key={stat.label} className="glass-panel p-4 space-y-2">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* System Status */}
              <Card className="glass-panel p-4 space-y-3">
                <div className="text-sm font-semibold">System Status</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Database</span>
                    <Badge variant="outline" className="border-accent text-accent">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Storage</span>
                    <Badge variant="outline" className="border-accent text-accent">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Analysis Engine</span>
                    <Badge variant="outline" className="border-accent text-accent">
                      Ready
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-panel p-4 space-y-3">
                <div className="text-sm font-semibold">Quick Actions</div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={loadStats}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Statistics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={handleClearAllData}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </Button>
                </div>
              </Card>
            </>
          )}

          {activeTab === "wsi" && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm">WSI Images</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Size (MB)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wsiList.map((wsi) => (
                      <TableRow key={wsi.id}>
                        <TableCell className="font-medium text-sm">{wsi.filename}</TableCell>
                        <TableCell>{wsi.file_size_mb?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{wsi.tissue_type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget({ type: "wsi", id: wsi.id });
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "genes" && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm">Gene Database</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {geneList.map((gene) => (
                        <TableRow key={gene.id}>
                          <TableCell className="font-medium font-mono text-sm">{gene.gene_symbol}</TableCell>
                          <TableCell className="text-sm">{gene.gene_name || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{gene.category || "General"}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeleteTarget({ type: "gene", id: gene.id });
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {activeTab === "sessions" && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm">Analysis Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionList.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium text-sm">{session.session_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{session.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(session.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget({ type: "session", id: session.id });
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
