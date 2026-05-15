import { Helmet } from "react-helmet-async";

interface PageSEOProps {
  title: string;
  description: string;
  url: string;
  canonical?: string;
  image?: string;
  type?: string;
  structuredData?: any;
}

export const PageSEO = ({
  title,
  description,
  url,
  canonical,
  image,
  type = "website",
  structuredData,
}: PageSEOProps) => {
  const fullTitle = `${title}`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
