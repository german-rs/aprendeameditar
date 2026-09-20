import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  title: string;
  category?: string;
  minutes?: number;
  audioSrc: string;
  eyebrow?: string; // ej: "Meditación del día" — solo en el home
  onPrevious?: () => void;
  onNext?: () => void;
}

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({
  title,
  category,
  minutes,
  audioSrc,
  eyebrow,
  onPrevious,
  onNext,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-white/40 bg-surface/90 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-night-700/40 dark:bg-night-900/80">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {eyebrow && (
        <p className="text-left text-xs font-medium uppercase tracking-wide text-night-400 dark:text-brand-200/70">
          {eyebrow}
        </p>
      )}

      <div className="relative mx-auto mt-8 flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-brand-200/60 dark:border-brand-400/20" aria-hidden="true" />
        <div className="absolute inset-3 rounded-full border border-brand-200/40 dark:border-brand-400/10" aria-hidden="true" />
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-brand-300 via-brand-500 to-night-600 shadow-lg shadow-brand-500/30" />
      </div>

      <h3 className="mt-6 font-display text-xl italic text-night-900 dark:text-brand-50">{title}</h3>

      {(category || minutes) && (
        <p className="mt-1 text-sm text-night-400 dark:text-brand-200/70">
          {category}
          {category && minutes ? ' · ' : ''}
          {minutes ? `${minutes} min` : ''}
        </p>
      )}

      <div className="mt-6">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="range-slider h-3 w-full"
          style={{
            background: `linear-gradient(to right, var(--color-brand-600) ${progressPercent}%, var(--color-brand-200) ${progressPercent}%)`,
          }}
          aria-label="Progreso de la meditación"
        />
        <div className="mt-1 flex justify-between text-xs tabular-nums text-night-400 dark:text-brand-200/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!onPrevious}
          aria-label="Meditación anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full text-night-500 transition hover:bg-brand-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-brand-200 dark:hover:bg-night-800"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-500/40 transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 pl-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          aria-label="Siguiente meditación"
          className="flex h-10 w-10 items-center justify-center rounded-full text-night-500 transition hover:bg-brand-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-brand-200 dark:hover:bg-night-800"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-night-400 dark:text-brand-200/70">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="range-slider h-3 flex-1"
          style={{
            background: `linear-gradient(to right, var(--color-night-300) ${volumePercent}%, var(--color-night-100) ${volumePercent}%)`,
          }}
          aria-label="Volumen"
        />
      </div>
    </div>
  );
}