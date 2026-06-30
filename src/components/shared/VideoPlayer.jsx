'use client'

import React from 'react';

const VideoPlayer = ({ videoUrl, title, description, platform, videoId }) => {
  const renderVideo = () => {
    if (platform === 'youtube' && videoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full absolute inset-0"
        />
      )
    }

    if (platform === 'vimeo' && videoId) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title={title || 'Vimeo video'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full absolute inset-0"
        />
      )
    }

    // self_hosted or other — use native video player
    if (videoUrl) {
      return (
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-cover"
          preload="metadata"
        />
      )
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
        No video source available
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col overflow-hidden rounded-2xl bg-black border border-border shadow-sm">
      <div className="aspect-video relative w-full">
        {renderVideo()}
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
