export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop stopColor="#f8f9fa" offset="0%" />
      <stop stopColor="#e5e7eb" offset="25%" />
      <stop stopColor="#4db6e3" offset="50%" />
      <stop stopColor="#e5e7eb" offset="75%" />
      <stop stopColor="#f8f9fa" offset="100%" />
    </linearGradient>
    <linearGradient id="dark-g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop stopColor="#1e293b" offset="0%" />
      <stop stopColor="#334155" offset="25%" />
      <stop stopColor="#4db6e3" offset="50%" />
      <stop stopColor="#334155" offset="75%" />
      <stop stopColor="#1e293b" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f8f9fa" class="light-mode" />
  <rect width="${w}" height="${h}" fill="#1e293b" class="dark-mode" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" class="light-mode" />
  <rect id="r-dark" width="${w}" height="${h}" fill="url(#dark-g)" class="dark-mode" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="2s" repeatCount="indefinite" class="light-mode" />
  <animate xlink:href="#r-dark" attributeName="x" from="-${w}" to="${w}" dur="2s" repeatCount="indefinite" class="dark-mode" />
  <style>
    .dark-mode { display: none; }
    @media (prefers-color-scheme: dark) {
      .light-mode { display: none; }
      .dark-mode { display: block; }
    }
  </style>
</svg>`;

export const getFileBase64 = (file: any): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();

    reader.onload = () => {
      const base64String = reader?.result?.split(",")[1];
      resolve(base64String);
    };

    reader.onerror = (error: any) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const base64ToFile = (base64String: string, fileName: string) => {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" }); // Adjust the 'image/png' type based on your image format

  return new File([blob], fileName, { type: blob.type });
};

export const fileURLToBase64 = (fileUrl: string) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    } catch (err) {
      reject(err);
    }
  });
};
