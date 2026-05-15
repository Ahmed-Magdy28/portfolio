import { useState } from "react";
import { Terminal } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface IconValueProps {
  value?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

const isImageLike = (value?: string) =>
  value ? /^https?:\/\//.test(value) || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value) : false;

export const IconValue = ({
  value,
  alt,
  className = "",
  imageClassName = "",
}: IconValueProps) => {
  const [hasError, setHasError] = useState(false);

  if (!value) {
    return <Terminal className={className || "w-8 h-8 opacity-50"} />;
  }

  if (isImageLike(value) && !hasError) {
    return (
      <img
        src={value}
        alt={alt}
        onError={() => setHasError(true)}
        className={
          imageClassName || className || "h-16 w-16 rounded-2xl object-cover"
        }
      />
    );
  }

  // Check if value is a Lucide icon name
  const IconComponent = (LucideIcons as any)[value] || (LucideIcons as any)[value.charAt(0).toUpperCase() + value.slice(1)];
  
  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  return <span className={className}>{value}</span>;
};
