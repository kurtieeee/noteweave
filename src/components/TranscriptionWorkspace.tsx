import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import ControlPanel from "@/components/ControlPanel";
import SheetPreview from "@/components/SheetPreview";
import ExportModal from "@/components/ExportModal";
import { type TranscriptionStatus } from "@/components/StatusIndicator";

interface TranscriptionWorkspaceProps {
  initialAudio?: string | null;
  onBack: () => void;
}

const TranscriptionWorkspace = ({ initialAudio, onBack }: TranscriptionWorkspaceProps) => {
  const [status, setStatus] = useState<TranscriptionStatus>(initialAudio ? "idle" : "idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudio || null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mode, setMode] = useState("fast");
  const [hasResult, setHasResult] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setStatus("recording");
      setRecordingTime(0);
      setHasResult(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setStatus("error");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
  }, []);

  const handleUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setHasResult(false);
    setStatus("idle");
  }, []);

  const handleTranscribe = useCallback(() => {
    setStatus("transcribing");
    const duration = mode === "fast" ? 2500 : 5000;
    setTimeout(() => {
      setHasResult(true);
      setStatus("done");
    }, duration);
  }, [mode]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-gradient">NoteWeave</h1>
          </div>
        </div>
        {hasResult && (
          <Button variant="hero" size="sm" onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left: Controls */}
        <aside className="w-full border-b border-border p-4 sm:p-6 lg:w-80 lg:border-b-0 lg:border-r">
          <ControlPanel
            status={status}
            audioUrl={audioUrl}
            recordingTime={recordingTime}
            mode={mode}
            onModeChange={setMode}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onUpload={handleUpload}
            onTranscribe={handleTranscribe}
          />
        </aside>

        {/* Right: Preview */}
        <main className="flex-1 p-4 sm:p-6">
          <SheetPreview hasResult={hasResult} isLoading={status === "transcribing"} />
        </main>
      </div>

      <ExportModal open={showExport} onClose={() => setShowExport(false)} />
    </div>
  );
};

export default TranscriptionWorkspace;
