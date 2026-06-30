import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Flame, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getWorkoutVideos } from '@/db';

const WorkoutGallery = ({ refreshTrigger }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const records = await getWorkoutVideos();
        setWorkouts(records);
      } catch (err) {
        console.error("Error fetching workouts:", err);
        toast.error("Failed to load workout library.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [refreshTrigger]);

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getFilteredWorkouts = (diff) => {
    if (diff === 'all') return workouts;
    return workouts.filter(w => w.difficulty === diff);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl bg-card" />
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <Flame className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">No workouts available in the library yet.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="bg-card border border-border">
          {difficulties.map(diff => (
            <TabsTrigger key={diff} value={diff} className="Capitalize">
              {diff}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {difficulties.map(diff => (
        <TabsContent key={diff} value={diff}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredWorkouts(diff).map((workout, idx) => (
              <motion.div 
                key={workout.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col group shadow-sm"
              >
                <div className="aspect-video bg-black relative cursor-pointer group/thumb">
                  {playingVideo === workout.id && workout.platform === 'youtube' && workout.video_id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${workout.video_id}?autoplay=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : playingVideo === workout.id && workout.platform === 'vimeo' && workout.video_id ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${workout.video_id}?autoplay=1`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : workout.platform === 'youtube' && workout.video_id ? (
                    <div
                      className="relative w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(https://img.youtube.com/vi/${workout.video_id}/hqdefault.jpg)` }}
                      onClick={() => setPlayingVideo(workout.id)}
                    >
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover/thumb:bg-black/10">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform group-hover/thumb:scale-110">
                          <PlayCircle className="w-8 h-8 text-black ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : workout.platform === 'vimeo' && workout.video_id ? (
                    <div
                      className="relative w-full h-full bg-muted flex items-center justify-center"
                      onClick={() => setPlayingVideo(workout.id)}
                    >
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover/thumb:bg-black/10">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform group-hover/thumb:scale-110">
                          <PlayCircle className="w-8 h-8 text-black ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : workout.video_file_url ? (
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster=""
                    >
                      <source src={workout.video_file_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <PlayCircle className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">{workout.title}</h3>
                    <Badge variant="outline" className="bg-background capitalize whitespace-nowrap text-xs ml-2">
                      {workout.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {workout.description || "No description provided."}
                  </p>
                </div>
              </motion.div>
            ))}
            {getFilteredWorkouts(diff).length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground italic">
                No workouts found for this level.
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default WorkoutGallery;
