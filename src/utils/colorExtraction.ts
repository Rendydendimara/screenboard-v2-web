interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  percentage: number;
}

interface ImageColors {
  imageId: string;
  imageName: string;
  colors: ColorInfo[];
  dominantColor: string;
}

/**
 * Extract dominant colors from an image using canvas and color quantization
 */
export const extractColors = async (
  imageFile: File | string
): Promise<ColorInfo[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Resize image for faster processing
        const maxSize = 200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Extract colors and count occurrences
        const colorMap = new Map<string, number>();

        for (let i = 0; i < pixels.length; i += 16) {
          // Sample every 4th pixel for performance
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Quantize colors to reduce noise (group similar colors)
          const quantizedR = Math.round(r / 32) * 32;
          const quantizedG = Math.round(g / 32) * 32;
          const quantizedB = Math.round(b / 32) * 32;

          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }

        // Sort by frequency and get top 5
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const totalPixels = sortedColors.reduce(
          (sum, [, count]) => sum + count,
          0
        );

        const colors: ColorInfo[] = sortedColors.map(([colorKey, count]) => {
          const [r, g, b] = colorKey.split(",").map(Number);
          return {
            hex: `#${r.toString(16).padStart(2, "0")}${g
              .toString(16)
              .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
            rgb: { r, g, b },
            percentage: Math.round((count / totalPixels) * 100),
          };
        });

        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    if (typeof imageFile === "string") {
      img.src = imageFile;
    } else {
      img.src = URL.createObjectURL(imageFile);
    }
  });
};

/**
 * Process multiple images and extract colors from all of them
 */
export const processMultipleImages = async (
  images: { file?: File; url?: string; id: string; name: string }[],
  onProgress?: (processed: number, total: number) => void
): Promise<ImageColors[]> => {
  const results: ImageColors[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      // const colors = await extractColors(image.file || image.url!);
      results.push({
        imageId: image.id,
        imageName: image.name,
        // colors,
        colors: [
          {
            hex: "#000000",
            rgb: { r: 0, g: 0, b: 0 },
            percentage: 0,
          },
        ],
        dominantColor: "#000000", //colors[0]?.hex || '#000000'
      });

      if (onProgress) {
        onProgress(i + 1, images.length);
      }
    } catch (error) {
      console.error(`Failed to process image ${image.name}:`, error);
      // Add fallback colors for failed images
      results.push({
        imageId: image.id,
        imageName: image.name,
        colors: [],
        dominantColor: "#000000",
      });
    }
  }

  return results;
};

/**
 * Get color palette insights from processed images
 */
export const getColorInsights = (imageColors: ImageColors[]) => {
  const allColors = imageColors.flatMap((img) => img.colors);
  const colorFrequency = new Map<string, number>();

  allColors.forEach((color) => {
    colorFrequency.set(
      color.hex,
      (colorFrequency.get(color.hex) || 0) + color.percentage
    );
  });

  const topColors = Array.from(colorFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([hex, frequency]) => ({ hex, frequency }));

  return {
    totalImages: imageColors.length,
    totalColorsExtracted: allColors.length,
    topColors,
    dominantColors: imageColors.map((img) => ({
      imageId: img.imageId,
      imageName: img.imageName,
      dominantColor: img.dominantColor,
    })),
  };
};
