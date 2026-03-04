import { Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingNotes from "@/components/FloatingNotes";

interface LandingHeroProps {
  onRecord: () => void;
  onUpload: () => void;
}

const LandingHero = ({ onRecord, onUpload }: LandingHeroProps) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <FloatingNotes />

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Logo placeholder */}
        <div className="mb-6 h-25 w-20 mx-auto" />

        <h1 className="mb-5 text-5xl font-bold tracking-tight sm:text-6xl">
          <span className="text-gradient">NoteWeave</span>
        </h1>

        <p className="mb-10 text-lg text-muted-foreground">
          Record or upload a performance and generate readable sheet music.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="hero" size="lg" onClick={onRecord} className="min-w-[200px]">
            <Mic className="h-20 w-5" />
            Record
          </Button>
          <Button variant="outline" size="lg" onClick={onUpload} className="min-w-[200px]">
            <Upload className="h-20 w-5" />
            Upload Audio
          </Button>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Supports piano performances · WAV and MP3 formats
        </p>
      </div>
    </div>
  );
};

export default LandingHero;
