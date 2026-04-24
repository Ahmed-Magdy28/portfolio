interface IconValueProps {
  value: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

const isImageLike = (value: string) =>
  /^https?:\/\//.test(value) || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value);

export const IconValue = ({
  value,
  alt,
  className = "",
  imageClassName = "",
}: IconValueProps) => {
  if (isImageLike(value)) {
    return (
      <img
        src={value}
        alt={alt}
        className={
          imageClassName || className || "h-16 w-16 rounded-2xl object-cover"
        }
      />
    );
  }

  return <span className={className}>{value}</span>;
};
