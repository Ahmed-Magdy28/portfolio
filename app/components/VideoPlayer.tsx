interface VideoPlayerProps {
  url: string;
  title?: string;
}

export const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
  const getYouTubeEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }

    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="relative pb-[56.25%]">
        <iframe
          src={embedUrl}
          title={title || 'Video Player'}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};
