const notes = ["♩", "♪", "♫", "♬", "𝄞", "𝄢"];

interface FloatingNote {
  id: number;
  note: string;
  left: string;
  top: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
  glow: boolean;
}

const generateNotes = (): FloatingNote[] =>
  Array.from({ length: 40 }, (_, i) => ({
    id: i,
    note: notes[i % notes.length],
    left: `${5 + Math.random() * 90}%`,
    top: `${5 + Math.random() * 90}%`,
    size: `${14 + Math.random() * 22}px`,
    duration: `${6 + Math.random() * 10}s`,
    delay: `${-Math.random() * 10}s`,
    opacity: 0.08 + Math.random() * 0.15,
    glow: i % 3 === 0,
  }));

const floatingNotes = generateNotes();

const FloatingNotes = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {floatingNotes.map((n) => (
      <span
        key={n.id}
        className={`absolute select-none animate-float-note ${n.glow ? "text-primary glow-note" : "text-accent"}`}
        style={{
          left: n.left,
          top: n.top,
          fontSize: n.size,
          animationDuration: n.duration,
          animationDelay: n.delay,
          opacity: n.opacity,
        }}
      >
        {n.note}
      </span>
    ))}

    {/* Glowing orbs */}
    <div className="absolute left-[15%] top-[20%] h-40 w-40 rounded-full bg-primary/10 blur-[80px] animate-glow-drift" />
    <div className="absolute right-[20%] top-[60%] h-56 w-56 rounded-full bg-accent/8 blur-[100px] animate-glow-drift-reverse" />
    <div className="absolute left-[60%] top-[10%] h-32 w-32 rounded-full bg-primary/6 blur-[60px] animate-glow-drift" style={{ animationDelay: "-4s" }} />
  </div>
);

export default FloatingNotes;
