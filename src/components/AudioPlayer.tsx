import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl: string | null;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("timeupdate", () => {});
      audio.removeEventListener("ended", () => {});
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const handleSeek = useCallback((value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  }, []);

  if (!audioUrl) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3">
      <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8 shrink-0">
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Slider
        value={[currentTime]}
        max={duration || 1}
        step={0.1}
        onValueChange={handleSeek}
        className="flex-1"
      />
      <span className="min-w-[4rem] text-right font-mono text-xs text-muted-foreground tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default AudioPlayer;
