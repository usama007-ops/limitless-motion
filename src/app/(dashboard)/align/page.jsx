'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, HeartPulse } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PodcastUploadForm from '@/components/admin/PodcastUploadForm.jsx';
import PodcastGallery from '@/components/podcasts/PodcastGallery.jsx';
import RecoveryFlowLibrary from '@/components/workouts/RecoveryFlowLibrary.jsx';
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
          className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-16 shadow-lg"
        >
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-6 uppercase tracking-widest font-bold backdrop-blur-sm px-3 py-1.5">
              <Target className="w-4 h-4 mr-2 inline" /> Mental & Physical Harmony
            </Badge>
            <h1 className="heading-display mb-6">Find Your Balance.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90">
              Align your body and mind through restorative flows and thought-provoking audio guidance.
            </p>
          </div>
        </motion.div>


        <div className="mb-12 mt-24">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Recovery & Mobility</h2>
          <RecoveryFlowLibrary />
        </div>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-primary" />
            Audio Guides & Podcasts
          </h2>
          <PodcastGallery refreshTrigger={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default AlignPage;
