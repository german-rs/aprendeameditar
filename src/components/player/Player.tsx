import { useEffect, useRef, useState } from "react";
import { cap, fmtTime, norm } from "../../lib/format";
import SearchModal from "./SearchModal";
import type { Track } from "./types";

const DAY_MS = 86_400_000;

/** Meditación del día: determinista por fecha, calculada en el cliente con Date.UTC. */
function dayIndex(length: number) {
  const now = new Date();
  const days = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS);
  return days % length;
}

const ghostBtn =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-glass-border bg-ghost text-ink transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent";

export default function Player({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeOnLoad = useRef(false);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchCat, setSearchCat] = useState("todas");

  const track = tracks[index];

  // Al montar: ?meditacion=<id> (desde /meditaciones) o, si no, la meditación del día
  useEffect(() => {
    if (!tracks.length) return;
    const wanted = new URLSearchParams(window.location.search).get("meditacion");
    const found = wanted ? tracks.findIndex((t) => t.id === wanted) : -1;
    setIndex(found >= 0 ? found : dayIndex(tracks.length));
  }, [tracks.length]);

  // Los chips del home (Astro) abren el buscador con un evento
  useEffect(() => {
    const onOpen = (e: Event) => {
      const cat = (e as CustomEvent<{ cat?: string }>).detail?.cat;
      setSearchCat(cat ? norm(cat) : "todas");
      setSearchOpen(true);
    };
    window.addEventListener("open-search", onOpen);
    return () => window.removeEventListener("open-search", onOpen);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Al cambiar de pista: reinicia estado y, si venía sonando (o se eligió a mano), reproduce
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setTime(0);
    setDuration(track?.duration ?? 0);
    a.load();
    if (resumeOnLoad.current) a.play().catch(() => setPlaying(false));
  }, [track?.id]);

  if (!track) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      resumeOnLoad.current = true;
      a.play().catch(() => setPlaying(false));
    } else {
      resumeOnLoad.current = false;
      a.pause();
    }
  };

  const step = (delta: number) => {
    resumeOnLoad.current = playing;
    setIndex((i) => (i + delta + tracks.length) % tracks.length);
  };

  const choose = (i: number) => {
    resumeOnLoad.current = true;
    setIndex(i);
    setSearchOpen(false);
  };

  const seek = (value: number) => {
    if (audioRef.current) audioRef.current.currentTime = value;
    setTime(value);
  };

  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;
  const meta = duration ? `${cap(track.category)} · ${Math.max(1, Math.round(duration / 60))} min` : cap(track.category);

  return (
    <section aria-label="Meditación del día" className="flex justify-center pt-5 pb-10">
      <audio
        ref={audioRef}
        src={track.audio}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          resumeOnLoad.current = false;
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      <div className="flex w-full max-w-100 flex-col items-center gap-[18px] rounded-[32px] border border-glass-border bg-glass px-5.5 py-7 shadow-glass backdrop-blur-[24px] backdrop-saturate-[1.6] sm:px-10 sm:py-9">
        <div className="flex w-full items-center justify-between">
          <span className="text-xs tracking-[0.03em] text-muted uppercase">Meditación del día</span>
          <button
            type="button"
            onClick={() => {
              setSearchCat("todas");
              setSearchOpen(true);
            }}
            aria-label="Buscar otra meditación"
            title="Buscar otra meditación"
            className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-glass-border bg-ghost text-muted transition-colors hover:bg-accent-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>

        {/* Orbe: pulsa solo mientras suena y respeta prefers-reduced-motion */}
        <div
          aria-hidden="true"
          className={`relative my-3 size-42 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--accent-soft),var(--accent)_75%)] ${
            playing ? "motion-safe:animate-pulse-orb" : ""
          }`}
        >
          <span className="absolute -inset-2.5 rounded-full border border-accent-soft" />
          <span className="absolute -inset-5 rounded-full border border-accent-soft opacity-60" />
        </div>

        <h2 className="text-center font-display text-[19px] font-medium italic">{track.title}</h2>
        <p className="text-[13px] text-muted">{meta}</p>

        <div className="w-full">
          <div className="relative flex h-4 items-center">
            <div className="relative h-1 w-full rounded bg-track">
              <div className="absolute inset-y-0 left-0 rounded bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
              <div
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-[left] duration-300"
                style={{ left: `${pct}%` }}
              />
            </div>
            {/* Input real encima (invisible): da teclado y lectores de pantalla gratis */}
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Progreso de la meditación"
              aria-valuetext={`${fmtTime(time)} de ${fmtTime(duration)}`}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-muted tabular-nums">
            <span>{fmtTime(time)}</span>
            <span>{fmtTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-[18px]">
          <button type="button" onClick={() => step(-1)} aria-label="Meditación anterior" className={ghostBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 6h2v12H6zM20 18 10 12l10-6z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="flex size-[62px] cursor-pointer items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Meditación siguiente" className={ghostBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 6h2v12h-2zM4 6l10 6-10 6z" />
            </svg>
          </button>
        </div>

        <div className="flex w-full items-center gap-2 text-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 9v6h4l5 5V4L8 9H4z" />
          </svg>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            aria-label="Volumen"
            className="flex-1 accent-accent"
          />
        </div>
      </div>

      <SearchModal
        tracks={tracks}
        currentIndex={index}
        open={searchOpen}
        initialCat={searchCat}
        onSelect={choose}
        onClose={() => setSearchOpen(false)}
      />
    </section>
  );
}
