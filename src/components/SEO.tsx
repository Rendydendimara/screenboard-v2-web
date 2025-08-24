import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description = "Humba Berdonor - Gerakan digital kemanusiaan donor darah Sumba Timur.", canonical }) => {
  const location = useLocation();
  const href = canonical ?? (typeof window !== "undefined" ? `${window.location.origin}${location.pathname}` : undefined);

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content="index, follow" />
      {href && <link rel="canonical" href={href} />}
    </Helmet>
  );
};

export default SEO;
