'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, Filter, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getVideos, getPodcasts } from '@/db';

const CATEGORIES = ['All', 'Workout Tutorials', 'Meal Prep', 'Coaching Tips', 'Motivational'];

const fallbackVideos = [
  {
    id: '1',
    title: 'Full Body Workout for Beginners',
    description: 'A complete full body routine designed for beginners to build strength and confidence in the gym.',
    category: 'Workout Tutorials',
    uploadDate: '2025-11-15',
    viewCount: 1240,
  },
  {
    id: '2',
    title: 'Meal Prep Sunday: High Protein Meals',
    description: 'Learn how to prep a full week of high-protein, low-calorie meals in under 2 hours.',
    category: 'Meal Prep',
    uploadDate: '2025-11-10',
    viewCount: 892,
  },
  {
    id: '3',
    title: 'Coaching Tip: Perfect Your Squat Form',
    description: 'Coach breaks down the key components of a perfect squat to maximize results and prevent injury.',
    category: 'Coaching Tips',
    uploadDate: '2025-11-05',
    viewCount: 2156,
  },
  {
    id: '4',
    title: 'Why Consistency Beats Intensity',
    description: 'A motivational deep dive into why showing up daily matters more than going all-out once a week.',
    category: 'Motivational',
    uploadDate: '2025-11-01',
    viewCount: 3421,
  },
];

const fallbackPodcasts = [
  {
    id: '1',
    name: 'The Mindset Advantage',
    description: 'Explore how elite athletes train their minds for peak performance and resilience.',
    platform: 'Spotify',
    podcastLink: 'https://open.spotify.com/show/example1',
  },
  {
    id: '2',
    name: 'Nutrition Unlocked',
    description: 'Deep dive into macro counting, meal timing, and evidence-based nutrition strategies.',
    platform: 'Apple Podcasts',
    podcastLink: 'https://podcasts.apple.com/podcast/example2',
  },
  {
    id: '3',
    name: 'The Recovery Hour',
    description: 'Learn about the science of recovery, sleep optimization, and mobility work.',
    platform: 'Spotify',
    podcastLink: 'https://open.spotify.com/show/example3',
  },
];

const ResourcesPage = () => {
  const [videos, setVideos] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    document.title = 'Resources Hub - Limitless Motion';
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fetchedVideos, fetchedPodcasts] = await Promise.all([
          getVideos(),
          getPodcasts(),
        ]);
        if (cancelled) return;
        if (fetchedVideos && fetchedVideos.length > 0) {
          setVideos(fetchedVideos.map(v => ({
            ...v,
            uploadDate: v.upload_date,
            viewCount: v.view_count,
          })));
        } else {
          setVideos(fallbackVideos);
        }
        if (fetchedPodcasts && fetchedPodcasts.length > 0) {
          setPodcasts(fetchedPodcasts.map(p => ({
            ...p,
            podcastLink: p.podcast_link,
          })));
        } else {
          setPodcasts(fallbackPodcasts);
        }
      } catch {
        if (!cancelled) {
          setVideos(fallbackVideos);
          setPodcasts(fallbackPodcasts);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Play size={16} />
            Limitless Motion Resources
          </div>
          <h1 className="heading-display mb-6">Knowledge Hub</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Exclusive video tutorials, coaching insights, and podcasts to accelerate your progress with Limitless Motion.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : error ? (
          <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive max-w-2xl mx-auto">
            <AlertCircle size={24} className="shrink-0 mt-0.5" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-24">

            {/* Video Section */}
            <section>
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Play className="text-primary" /> Video Library
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.map(cat => (
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveCategory(cat)}
                      className="rounded-full"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden border-border hover:border-primary/50 transition-all duration-300">
                        <div className="aspect-video bg-muted relative group">
                          <div className="absolute inset-0 flex items-center justify-center bg-secondary/10">
                            <Play size={48} className="text-muted-foreground/50" />
                          </div>
                        </div>
                        <CardContent className="p-6 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                              {video.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(video.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">{video.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                            {video.description}
                          </p>
                          <div className="text-xs text-muted-foreground mt-auto">
                            {video.viewCount || 0} views
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground">No videos found in this category.</p>
                </div>
              )}
            </section>

            {/* Podcast Section */}
            <section>
              <h2 className="text-3xl font-bold flex items-center gap-3 mb-8">
                <Headphones className="text-primary" /> Recommended Podcasts
              </h2>

              {podcasts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {podcasts.map((podcast, index) => (
                    <motion.div
                      key={podcast.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 flex flex-col">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">{podcast.name}</h3>
                            <span className="text-xs font-bold uppercase tracking-wider text-secondary-foreground bg-secondary px-2 py-1 rounded">
                              {podcast.platform}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-6 flex-grow">
                            {podcast.description}
                          </p>
                          <Button asChild variant="outline" className="w-full mt-auto">
                            <a href={podcast.podcastLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                              <Headphones size={16} /> Listen Now
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground">No podcasts available at the moment.</p>
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
