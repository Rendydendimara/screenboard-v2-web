export function getImageUrl(link: string) {
  if (!link) return "/assets/image/user-placeholder.png";
  return `http://66.42.52.110:8081${link}`;
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
