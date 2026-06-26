'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PodcastUploadForm from '@/components/admin/PodcastUploadForm.jsx';
import PodcastGallery from '@/components/podcasts/PodcastGallery.jsx';
import { Badge } from '@/components/ui/badge';

const AlignPage = () => {
  const { isAdmin } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.title = 'ALIGN | Limitless Motion';
  }, []);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-foreground text-background p-8 md:p-16 mb-16"
        >
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-primary text-primary-foreground hover:bg-primary border-none mb-6 uppercase tracking-widest font-bold">
              <Target className="w-4 h-4 mr-2 inline" /> Mental & Physical Harmony
            </Badge>
            <h1 className="heading-display text-background mb-6">Find Your Balance.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 text-background/80">
              Align your body and mind through restorative flows and thought-provoking audio guidance.
            </p>
          </div>
        </motion.div>

        {isAdmin && (
          <PodcastUploadForm onUploadSuccess={handleUploadSuccess} />
        )}

        <div className="mb-12">
          <h2 className="heading-section mb-8">Audio Guides & Podcasts</h2>
          <PodcastGallery refreshTrigger={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default AlignPage;
