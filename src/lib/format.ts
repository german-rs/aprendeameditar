/** Minúsculas y sin tildes: "Sueño" y "sueno" coinciden al buscar o filtrar. */
export const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** 125 -> "2:05" */
export const fmtTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};
