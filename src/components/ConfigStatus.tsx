import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useState } from "react";

export const ConfigStatus = () => {
  const [isVisible, setIsVisible] = useState(!isSupabaseConfigured);

  if (!isVisible) return null;

  if (isSupabaseConfigured) {
    return (
      <Alert className="mb-4 bg-green-500/10 border-green-500/50">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">Configuration Complete</AlertTitle>
        <AlertDescription className="text-green-400">
          Supabase is properly configured and ready to use.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/50">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Configuration Required</AlertTitle>
      <AlertDescription className="text-yellow-400 space-y-2">
        <p>
          Supabase environment variables are not configured. The app will run in demo mode with
          limited functionality.
        </p>
        <div className="space-y-1 text-sm">
          <p className="font-medium">To enable full functionality:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Get your Supabase credentials from the dashboard</li>
            <li>Add them to Netlify environment variables:</li>
          </ol>
          <ul className="list-disc list-inside space-y-1 ml-6 font-mono text-xs">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_PUBLISHABLE_KEY</li>
          </ul>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            className="text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10"
            asChild
          >
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Supabase <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10"
            onClick={() => setIsVisible(false)}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
