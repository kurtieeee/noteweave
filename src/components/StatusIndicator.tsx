import { cn } from "@/lib/utils";
import { Loader2, Mic, CheckCircle2, AlertCircle, Upload, Radio } from "lucide-react";

export type TranscriptionStatus =
  | "idle"
  | "recording"
  | "uploading"
  | "transcribing"
  | "done"
  | "error";

interface StatusIndicatorProps {
  status: TranscriptionStatus;
  className?: string;
}

const statusConfig: Record<TranscriptionStatus, { label: string; icon: React.ReactNode; colorClass: string }> = {
  idle: {
    label: "Ready",
    icon: <Radio className="h-4 w-4" />,
    colorClass: "text-muted-foreground bg-secondary border-border",
  },
  recording: {
    label: "Listening…",
    icon: <Mic className="h-4 w-4 animate-pulse-recording" />,
    colorClass: "text-recording bg-recording/10 border-recording/30",
  },
  uploading: {
    label: "Uploading…",
    icon: <Upload className="h-4 w-4 animate-spin" />,
    colorClass: "text-primary bg-primary/10 border-primary/30",
  },
  transcribing: {
    label: "Transcribing…",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    colorClass: "text-primary bg-primary/10 border-primary/30",
  },
  done: {
    label: "Ready.",
    icon: <CheckCircle2 className="h-4 w-4" />,
    colorClass: "text-accent bg-accent/10 border-accent/30",
  },
  error: {
    label: "Something went wrong.",
    icon: <AlertCircle className="h-4 w-4" />,
    colorClass: "text-destructive bg-destructive/10 border-destructive/30",
  },
};

const StatusIndicator = ({ status, className }: StatusIndicatorProps) => {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        config.colorClass,
        className
      )}
    >
      {config.icon}
      {config.label}
    </div>
  );
};

export default StatusIndicator;
