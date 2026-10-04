export interface Track {
  id: string;
  title: string;
  /** Categoría tal como se muestra: "Sueño", "Principiantes"... */
  category: string;
  /** Ruta pública del MP3, p. ej. /audio/meditaciones/respirar-en-3-minutos.mp3 */
  audio: string;
  /** Duración en segundos, si el schema la tiene. Si no, se lee del audio al cargar. */
  duration?: number;
}
