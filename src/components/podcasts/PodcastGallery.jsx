import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Headphones, Mic2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPodcasts } from '@/db';

const PodcastGallery = ({ refreshTrigger }) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const records = await getPodcasts();
        setPodcasts(records);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        toast.error("Failed to load podcasts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl bg-card" />
        ))}
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <Headphones className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">No podcasts available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {podcasts.map((podcast, idx) => (
        <motion.div 
          key={podcast.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-card rounded-2xl p-6 border border-border flex flex-col group shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Mic2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground line-clamp-1">{podcast.name}</h3>
              <p className="text-sm font-semibold text-primary">{podcast.speaker_name}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
            {podcast.description || "No description provided."}
          </p>

          <div className="mt-auto w-full">
            {podcast.audio_file_url ? (
              <audio 
                controls 
                className="w-full h-10 rounded-md [&::-webkit-media-controls-panel]:bg-background [&::-webkit-media-controls-panel]:border [&::-webkit-media-controls-panel]:border-border"
              >
                <source src={podcast.audio_file_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="w-full bg-background border border-border rounded-md px-4 py-2 flex items-center justify-center">
                <a href={podcast.podcast_link} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
                  Listen Externally
                </a>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PodcastGallery;
