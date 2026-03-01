import { useState } from "react";
import { Download, X, FileText, FileCode, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

const ExportModal = ({ open, onClose }: ExportModalProps) => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const [fileName, setFileName] = useState(`transcription_${today}`);

  if (!open) return null;

  const handleDownload = (format: string) => {
    const a = document.createElement("a");
    a.download = `${fileName}.${format}`;
    a.href = "#";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-md sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">Export</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-5 space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            File Name
          </label>
          <Input value={fileName} onChange={(e) => setFileName(e.target.value)} className="border-border bg-secondary font-mono" />
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-3" onClick={() => handleDownload("pdf")}>
            <FileText className="h-4 w-4 text-primary" />
            Download PDF
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3" onClick={() => handleDownload("musicxml")}>
            <FileCode className="h-4 w-4 text-primary" />
            Download MusicXML
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3" onClick={() => handleDownload("mid")}>
            <Music2 className="h-4 w-4 text-primary" />
            Download MIDI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
