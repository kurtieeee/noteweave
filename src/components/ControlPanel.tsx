import { useRef, useCallback } from "react";
import { Mic, Square, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AudioPlayer from "@/components/AudioPlayer";
import StatusIndicator, { type TranscriptionStatus } from "@/components/StatusIndicator";

interface ControlPanelProps {
  status: TranscriptionStatus;
  audioUrl: string | null;
  recordingTime: number;
  mode: string;
  onModeChange: (mode: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onUpload: (file: File) => void;
  onTranscribe: () => void;
}

const formatTimer = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};

const ControlPanel = ({
  status,
  audioUrl,
  recordingTime,
  mode,
  onModeChange,
  onStartRecording,
  onStopRecording,
  onUpload,
  onTranscribe,
}: ControlPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
      e.target.value = "";
    },
    [onUpload]
  );

  const isRecording = status === "recording";
  const isBusy = status === "uploading" || status === "transcribing";
  const canTranscribe = audioUrl && !isBusy && status !== "recording";

  return (
    <div className="flex h-full flex-col gap-5">
      <StatusIndicator status={status} />

      {/* Record */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Record
        </label>
        <div className="flex items-center gap-3">
          {isRecording ? (
            <Button variant="recording" onClick={onStopRecording} className="flex-1">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button variant="outline" onClick={onStartRecording} disabled={isBusy} className="flex-1">
              <Mic className="h-4 w-4" />
              Record
            </Button>
          )}
          {isRecording && (
            <span className="font-mono text-sm text-recording tabular-nums">
              {formatTimer(recordingTime)}
            </span>
          )}
        </div>
      </div>

      {/* Upload */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Upload
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/wav,audio/mp3,audio/mpeg,.wav,.mp3"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy || isRecording}
          className="w-full"
        >
          <Upload className="h-4 w-4" />
          Upload Audio
        </Button>
      </div>

      {/* Playback */}
      {audioUrl && (
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Playback
          </label>
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      )}

      {/* Mode */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Mode
        </label>
        <Select value={mode} onValueChange={onModeChange}>
          <SelectTrigger className="border-border bg-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast">Fast</SelectItem>
            <SelectItem value="accurate">Accurate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transcribe */}
      <Button
        variant="hero"
        size="lg"
        onClick={onTranscribe}
        disabled={!canTranscribe}
        className="mt-auto w-full"
      >
        <Wand2 className="h-5 w-5" />
        Transcribe
      </Button>
    </div>
  );
};

export default ControlPanel;
