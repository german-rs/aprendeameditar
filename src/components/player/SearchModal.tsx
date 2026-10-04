import { useEffect, useMemo, useRef, useState } from "react";
import { cap, fmtTime, norm } from "../../lib/format";
import type { Track } from "./types";

interface Props {
  tracks: Track[];
  currentIndex: number;
  open: boolean;
  /** Categoría normalizada con la que se abre ("todas" si ninguna) */
  initialCat: string;
  onSelect: (index: number) => void;
  onClose: () => void;
}

const chip =
  "cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-accent";

export default function SearchModal({ tracks, currentIndex, open, initialCat, onSelect, onClose }: Props) {
  const [cat, setCat] = useState(initialCat);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // norm(categoría) -> etiqueta visible
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    tracks.forEach((t) => map.set(norm(t.category), cap(t.category)));
    return [...map.entries()];
  }, [tracks]);

  useEffect(() => {
    if (!open) return;
    setCat(initialCat);
    setQuery("");
    inputRef.current?.focus();
  }, [open, initialCat]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const q = norm(query);
  const items = tracks
    .map((track, index) => ({ track, index }))
    .filter(({ track }) => (cat === "todas" || norm(track.category) === cat) && norm(track.title).includes(q));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,10,40,0.45)] p-5 backdrop-blur-[4px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        className="flex max-h-[82vh] w-full max-w-110 flex-col gap-3.5 rounded-[28px] border border-glass-border bg-glass p-[26px] shadow-glass backdrop-blur-[24px] backdrop-saturate-[1.6]"
      >
        <div className="flex items-center justify-between">
          <h2 id="search-title" className="font-display text-lg font-medium italic">
            Elegir una meditación
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="size-[30px] shrink-0 cursor-pointer rounded-full border border-glass-border bg-ghost text-ink hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
          >
            ✕
          </button>
        </div>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre..."
          aria-label="Buscar meditación"
          className="w-full rounded-xl border border-glass-border bg-ghost px-3.5 py-[11px] text-sm text-ink outline-none placeholder:text-muted focus-visible:border-accent"
        />

        <div className="flex flex-wrap gap-2">
          {[["todas", "Todas"], ...categories].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={cat === key}
              onClick={() => setCat(key)}
              className={`${chip} ${
                cat === key
                  ? "border-accent bg-accent text-white"
                  : "border-glass-border bg-ghost text-ink hover:bg-accent-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="flex flex-col gap-2 overflow-y-auto">
          {items.length === 0 && <li className="py-5 text-center text-[13px] text-muted">Sin resultados</li>}
          {items.map(({ track, index }) => {
            const current = index === currentIndex;
            return (
              <li key={track.id}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-[14px] border px-3 py-2.5 text-left transition-colors hover:bg-ghost focus-visible:outline-2 focus-visible:outline-accent ${
                    current ? "border-accent bg-accent-soft" : "border-transparent"
                  }`}
                >
                  <span className="size-[38px] shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--accent-soft),var(--accent)_75%)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-medium italic text-ink">{track.title}</span>
                    <span className="block text-xs text-muted">
                      {cap(track.category)}
                      {track.duration ? ` · ${fmtTime(track.duration)}` : ""}
                      {current && <span className="font-bold text-accent"> · Sonando ahora</span>}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
