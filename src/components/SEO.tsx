import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_NAME = "UXBoard";
const DEFAULT_DESCRIPTION =
  "Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps.";
const DEFAULT_OG_IMAGE = "/og-image.png"; // place a 1200x630 image here in /public

function toAbsoluteUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : import.meta.env.VITE_APP_URL ?? "";
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

interface SEOProps {
  title: string;
  description?: string;
  image?: string; // absolute or relative URL for og:image
  type?: "website" | "article" | "profile";
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  canonical,
}) => {
  const location = useLocation();
  const pageUrl =
    canonical ??
    (typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : "");

  const ogImage = toAbsoluteUrl(image);

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {pageUrl && <link rel="canonical" href={pageUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO;
