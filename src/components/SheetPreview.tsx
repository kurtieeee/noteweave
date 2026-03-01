import { ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SheetPreviewProps {
  hasResult: boolean;
  isLoading: boolean;
}

/* Treble clef SVG path */
const TrebleClef = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x}, ${y}) scale(0.038)`}>
    <path
      d="M250 840 C250 840 220 720 220 600 C220 480 280 380 310 300 C340 220 330 140 300 100 C270 60 230 60 210 100 C190 140 200 200 240 240 C280 280 340 300 340 380 C340 460 300 520 260 560 C220 600 200 660 210 720 C220 780 260 820 300 840 C340 860 360 820 340 780 C320 740 280 740 270 770 C260 800 280 840 250 840 Z"
      fill={color}
      opacity="0.7"
    />
  </g>
);

/* A realistic note with proper head, stem, and optional flag */
const Note = ({
  x, y, type, confidence, stemUp = true,
}: {
  x: number; y: number; type: "quarter" | "eighth" | "half";
  confidence: number; stemUp?: boolean;
}) => {
  const isLow = confidence < 0.7;
  const fill = isLow ? "hsl(var(--warning))" : "hsl(var(--foreground))";
  const stemDir = stemUp ? -1 : 1;
  const stemX = stemUp ? x + 5.5 : x - 5.5;
  const stemEndY = y + stemDir * 32;

  return (
    <g>
      {/* Glow for low confidence */}
      {isLow && (
        <ellipse cx={x} cy={y} rx="10" ry="7" fill="hsl(var(--warning))" opacity="0.2" />
      )}

      {/* Note head */}
      <ellipse
        cx={x} cy={y}
        rx={type === "half" ? 6.5 : 6}
        ry={type === "half" ? 4.5 : 4}
        fill={type === "half" ? "none" : fill}
        stroke={fill}
        strokeWidth={type === "half" ? 1.5 : 0}
        transform={`rotate(-15, ${x}, ${y})`}
        opacity={0.9}
      />

      {/* Stem */}
      <line
        x1={stemX} y1={y}
        x2={stemX} y2={stemEndY}
        stroke={fill} strokeWidth="1.3" opacity="0.9"
      />

      {/* Flag for eighth notes */}
      {type === "eighth" && stemUp && (
        <path
          d={`M${stemX},${stemEndY} C${stemX + 8},${stemEndY + 8} ${stemX + 12},${stemEndY + 16} ${stemX + 4},${stemEndY + 24}`}
          fill="none" stroke={fill} strokeWidth="1.3" opacity="0.9"
        />
      )}
      {type === "eighth" && !stemUp && (
        <path
          d={`M${stemX},${stemEndY} C${stemX - 8},${stemEndY - 8} ${stemX - 12},${stemEndY - 16} ${stemX - 4},${stemEndY - 24}`}
          fill="none" stroke={fill} strokeWidth="1.3" opacity="0.9"
        />
      )}
    </g>
  );
};

/* Bar line */
const BarLine = ({ x, yStart, yEnd }: { x: number; yStart: number; yEnd: number }) => (
  <line x1={x} x2={x} y1={yStart} y2={yEnd}
    stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.35" />
);

interface NoteData {
  x: number;
  line: number;
  confidence: number;
  type: "quarter" | "eighth" | "half";
}

interface StaffData {
  y: number;
  notes: NoteData[];
  barLines: number[];
}

const MockStaffLine = ({ y, notes, barLines }: StaffData) => {
  const staffTop = y;
  const staffBottom = y + 40;
  const lineColor = "hsl(var(--muted-foreground))";

  return (
    <g>
      {/* Five staff lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="45" x2="760"
          y1={y + i * 10} y2={y + i * 10}
          stroke={lineColor} strokeWidth="0.7" opacity="0.35"
        />
      ))}

      {/* Treble Clef */}
      <TrebleClef x={48} y={y - 10} color="hsl(var(--primary))" />

      {/* Notes */}
      {notes.map((note, i) => {
        const noteY = y + note.line * 5;
        const stemUp = note.line >= 4;
        // Ledger lines if needed
        const ledgerLines: JSX.Element[] = [];
        if (note.line <= -1) {
          for (let l = -1; l >= note.line; l--) {
            if (l % 2 === 0 || l === note.line) {
              ledgerLines.push(
                <line key={l} x1={note.x - 10} x2={note.x + 10}
                  y1={y + l * 5} y2={y + l * 5}
                  stroke={lineColor} strokeWidth="0.7" opacity="0.35" />
              );
            }
          }
        }
        if (note.line >= 10) {
          for (let l = 10; l <= note.line; l++) {
            if (l % 2 === 0 || l === note.line) {
              ledgerLines.push(
                <line key={l} x1={note.x - 10} x2={note.x + 10}
                  y1={y + l * 5} y2={y + l * 5}
                  stroke={lineColor} strokeWidth="0.7" opacity="0.35" />
              );
            }
          }
        }
        return (
          <g key={i}>
            {ledgerLines}
            <Note x={note.x} y={noteY} type={note.type}
              confidence={note.confidence} stemUp={stemUp} />
          </g>
        );
      })}

      {/* Bar lines */}
      {barLines.map((bx, i) => (
        <BarLine key={i} x={bx} yStart={staffTop} yEnd={staffBottom} />
      ))}
    </g>
  );
};

const staffsData: StaffData[] = [
  {
    y: 70,
    barLines: [225, 405, 585],
    notes: [
      { x: 115, line: 6, confidence: 0.95, type: "quarter" },
      { x: 155, line: 4, confidence: 0.91, type: "eighth" },
      { x: 185, line: 5, confidence: 0.88, type: "quarter" },
      { x: 265, line: 3, confidence: 0.93, type: "half" },
      { x: 315, line: 7, confidence: 0.62, type: "quarter" },
      { x: 355, line: 5, confidence: 0.90, type: "eighth" },
      { x: 385, line: 4, confidence: 0.87, type: "quarter" },
      { x: 445, line: 6, confidence: 0.94, type: "quarter" },
      { x: 485, line: 2, confidence: 0.96, type: "eighth" },
      { x: 525, line: 5, confidence: 0.89, type: "quarter" },
      { x: 555, line: 3, confidence: 0.92, type: "eighth" },
      { x: 625, line: 7, confidence: 0.55, type: "quarter" },
      { x: 675, line: 4, confidence: 0.97, type: "half" },
      { x: 725, line: 6, confidence: 0.90, type: "quarter" },
    ],
  },
  {
    y: 180,
    barLines: [225, 405, 585],
    notes: [
      { x: 115, line: 5, confidence: 0.97, type: "quarter" },
      { x: 155, line: 3, confidence: 0.85, type: "eighth" },
      { x: 195, line: 7, confidence: 0.91, type: "quarter" },
      { x: 265, line: 4, confidence: 0.64, type: "quarter" },
      { x: 315, line: 6, confidence: 0.89, type: "half" },
      { x: 385, line: 2, confidence: 0.91, type: "eighth" },
      { x: 445, line: 5, confidence: 0.96, type: "quarter" },
      { x: 485, line: 7, confidence: 0.88, type: "quarter" },
      { x: 525, line: 3, confidence: 0.73, type: "eighth" },
      { x: 565, line: 6, confidence: 0.94, type: "quarter" },
      { x: 625, line: 4, confidence: 0.90, type: "quarter" },
      { x: 675, line: 5, confidence: 0.87, type: "half" },
      { x: 725, line: 2, confidence: 0.95, type: "eighth" },
    ],
  },
  {
    y: 290,
    barLines: [225, 405, 585],
    notes: [
      { x: 115, line: 4, confidence: 0.92, type: "half" },
      { x: 165, line: 6, confidence: 0.88, type: "eighth" },
      { x: 195, line: 3, confidence: 0.95, type: "quarter" },
      { x: 265, line: 5, confidence: 0.67, type: "quarter" },
      { x: 315, line: 7, confidence: 0.91, type: "eighth" },
      { x: 355, line: 4, confidence: 0.84, type: "quarter" },
      { x: 445, line: 6, confidence: 0.60, type: "quarter" },
      { x: 485, line: 2, confidence: 0.97, type: "quarter" },
      { x: 525, line: 5, confidence: 0.89, type: "eighth" },
      { x: 565, line: 3, confidence: 0.93, type: "quarter" },
      { x: 625, line: 7, confidence: 0.86, type: "half" },
      { x: 675, line: 4, confidence: 0.91, type: "eighth" },
      { x: 725, line: 6, confidence: 0.88, type: "quarter" },
    ],
  },
];

const SheetPreview = ({ hasResult, isLoading }: SheetPreviewProps) => {
  const [zoom, setZoom] = useState(100);
  const [measure, setMeasure] = useState(1);
  const totalMeasures = 12;

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8">
        <div className="h-64 w-full shimmer rounded-lg" />
        <p className="text-sm text-muted-foreground">Transcribing your audio...</p>
      </div>
    );
  }

  if (!hasResult) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/50 p-8">
        <div className="animate-float rounded-2xl border border-border bg-secondary p-5">
          <Music className="h-12 w-12 text-muted-foreground/40" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">No sheet music yet</p>
          <p className="text-sm text-muted-foreground">
            Record or upload audio, then hit Transcribe
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(50, zoom - 10))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3rem] text-center font-mono text-xs text-muted-foreground tabular-nums">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 10))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(100)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMeasure(Math.max(1, measure - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            Measure {measure} / {totalMeasures}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMeasure(Math.min(totalMeasures, measure + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sheet */}
      <div className="flex-1 overflow-auto rounded-xl border border-border bg-card p-6">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}>
          <svg viewBox="0 0 800 400" className="w-full" aria-label="Sheet music preview">
            {/* Title */}
            <text x="400" y="28" textAnchor="middle" fontSize="18" fontWeight="700"
              fill="hsl(var(--foreground))" fontFamily="'Space Grotesk', sans-serif">
              Transcription
            </text>
            <text x="400" y="48" textAnchor="middle" fontSize="11"
              fontFamily="'JetBrains Mono', monospace" fill="hsl(var(--muted-foreground))" opacity="0.7">
              &#9833;= 120 · 4/4 · C Major
            </text>

            {/* Staves */}
            {staffsData.map((staff, i) => (
              <MockStaffLine key={i} {...staff} />
            ))}

            {/* Final double bar */}
            <line x1="755" x2="755" y1={290} y2={330}
              stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
            <line x1="760" x2="760" y1={290} y2={330}
              stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" opacity="0.4" />
          </svg>
        </div>

        {/* Confidence legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground opacity-80" />
            High confidence
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-warning" />
            Low confidence
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetPreview;
