import React, { useState } from "react";

type ImageWithFallbackProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  onClick?: (e: any) => void;
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  className,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
      onClick={onClick}
    />
  );
};

export default ImageWithFallback;
