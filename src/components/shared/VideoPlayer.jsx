import React from 'react';

const VideoPlayer = ({ videoUrl, title, description }) => {
  return (
    <div className="w-full flex flex-col overflow-hidden rounded-2xl bg-black border border-border shadow-sm">
      <div className="aspect-video relative w-full">
        <video 
          src={videoUrl} 
          controls 
          className="w-full h-full object-cover"
          preload="metadata"
        />
      </div>
      {(title || description) && (
        <div className="p-4 bg-card text-card-foreground">
          {title && <h4 className="font-bold text-lg mb-1">{title}</h4>}
          {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;