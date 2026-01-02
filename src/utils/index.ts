export function getImageUrl(link: string) {
  if (!link) return "/assets/image/user-placeholder.png";
  return `${import.meta.env.VITE_API_BASE_URL}${link}`;
}

export function isValidImageSrc(src: string): boolean {
  return /^(\/|https?:\/\/)/.test(src);
}

export function getImageUrlFromFile(file: File): string {
  return URL.createObjectURL(file);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}

// fungsi untuk membersihkan nama file
export function sanitize(filename: string): string {
  if (!filename) return "";

  let name = filename;

  // Hapus karakter berbahaya tapi biarkan spasi
  name = name.replace(/[^a-zA-Z0-9\s_-]/g, "");

  // Rapikan spasi berlebihan (lebih dari 1 jadi 1 spasi)
  name = name.replace(/\s+/g, " ");

  // Trim spasi di awal/akhir
  name = name.trim();

  return name;
}
