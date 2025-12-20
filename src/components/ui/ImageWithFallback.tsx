import React, { useState, useEffect, useRef } from "react";
import { shimmer, toBase64 } from "@/utils/imageOptimization";
import clsx from "clsx";

// 1. Gunakan eager={true} untuk gambar above-the-fold (2-3 gambar pertama yang langsung terlihat)
// 2. Biarkan eager={false} (default) untuk gambar lainnya untuk lazy loading
// 3. Gunakan containerClassName untuk dimensi container, bukan pada img className

type ImageWithFallbackProps = {
  src: string;
  fallbackSrc: string;
  alt?: string;
  className?: string;
  onClick?: (e: any) => void;
  containerClassName?: string;
  showLoadingSkeleton?: boolean;
  loadingClassName?: string;
  eager?: boolean; // Disable lazy loading for above-the-fold images
  onLoad?: () => void;
  onError?: () => void;
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt = "Image",
  className = "",
  onClick,
  containerClassName = "",
  showLoadingSkeleton = true,
  loadingClassName = "",
  eager = false,
  onLoad,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(eager ? src : null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eager || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before the image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [eager]);

  // Load image when in view
  useEffect(() => {
    if (isInView && !imgSrc) {
      setImgSrc(src);
    }
  }, [isInView, src, imgSrc]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }
  };

  // Blur placeholder data URL
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(
    shimmer(700, 700)
  )}`;

  return (
    <div
      ref={containerRef}
      className={clsx("relative overflow-hidden", containerClassName)}
    >
      {/* Loading Skeleton with Shimmer */}
      {showLoadingSkeleton && isLoading && !hasError && (
        <div
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 ${loadingClassName}`}
          style={{
            backgroundImage: `url("${blurDataURL}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center rounded-lg">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Failed to load image
            </p>
          </div>
        </div>
      )}

      {/* Main Image */}
      {imgSrc && (
        <img
          ref={imgRef}
          src={imgSrc}
          alt={alt}
          className={clsx(
            "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={onClick}
          loading={eager ? "eager" : "lazy"} // Native lazy loading as fallback
        />
      )}
    </div>
  );
};

export default ImageWithFallback;
