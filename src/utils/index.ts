export function getImageUrl(link: string) {
  if (!link) return "/assets/image/user-placeholder.png";
  return `${import.meta.env.VITE_API_BASE_URL}${link}`;
}

export function isValidImageSrc(src: string): boolean {
  return /^(\/|https?:\/\/)/.test(src);
}
