import { useState, useRef, useCallback } from "react";
import LandingHero from "@/components/LandingHero";
import TranscriptionWorkspace from "@/components/TranscriptionWorkspace";

type View = "landing" | "workspace";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [initialAudio, setInitialAudio] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecord = useCallback(() => {
    setInitialAudio(null);
    setView("workspace");
  }, []);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setInitialAudio(url);
      setView("workspace");
    }
    e.target.value = "";
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/wav,audio/mp3,audio/mpeg,.wav,.mp3"
        className="hidden"
        onChange={handleFileSelected}
      />
      {view === "landing" ? (
        <LandingHero onRecord={handleRecord} onUpload={handleUpload} />
      ) : (
        <TranscriptionWorkspace
          initialAudio={initialAudio}
          onBack={() => setView("landing")}
        />
      )}
    </>
  );
};

export default Index;
