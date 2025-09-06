import React from 'react';
import { Play, Video } from 'lucide-react';

interface YoutubeVideoPreviewProps {
  videoUrl: string;
  title: string;
  className?: string;
  autoplay?: boolean;
}

const YoutubeVideoPreview = ({ videoUrl, title, className = "", autoplay = false }: YoutubeVideoPreviewProps) => {
  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('watch?v=') ? url.split('watch?v=')[1] : url.split('youtu.be/')[1];
      const cleanVideoId = videoId?.split('&')[0];
      const autoplayParam = autoplay ? '&autoplay=1&mute=1' : '';
      return `https://www.youtube.com/embed/${cleanVideoId}?controls=1&rel=0&loop=1&playlist=${cleanVideoId}${autoplayParam}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      const autoplayParam = autoplay ? '&autoplay=1&muted=1' : '';
      return `https://player.vimeo.com/video/${videoId}?loop=1${autoplayParam}`;
    }
    return url;
  };

  const getYoutubeThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('watch?v=') ? url.split('watch?v=')[1] : url.split('youtu.be/')[1];
      const cleanVideoId = videoId?.split('&')[0];
      return `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`;
    }
    return null;
  };

  const [showVideo, setShowVideo] = React.useState(autoplay);
  const thumbnailUrl = getYoutubeThumbnail(videoUrl);

  if (showVideo || autoplay) {
    return (
      <div className={`aspect-video bg-black rounded-lg overflow-hidden shadow-lg ${className}`}>
        <iframe
          src={getVideoEmbedUrl(videoUrl)}
          className="w-full h-full"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div 
      className={`aspect-video bg-black rounded-lg overflow-hidden shadow-lg cursor-pointer group relative ${className}`}
      onClick={() => setShowVideo(true)}
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback en cas d'erreur de chargement du thumbnail
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <Video className="w-16 h-16 text-gray-400" />
        </div>
      )}
      
      {/* Overlay avec bouton play */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Play className="w-8 h-8 text-fadem-blue ml-1" fill="currentColor" />
        </div>
      </div>
      
      {/* Badge vidéo */}
      <div className="absolute top-3 left-3">
        <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
          <Video className="w-3 h-3" />
          VIDÉO
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideoPreview;