'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WorkoutUploadForm from '@/components/admin/WorkoutUploadForm.jsx';
import WorkoutGallery from '@/components/workouts/WorkoutGallery.jsx';
import { Badge } from '@/components/ui/badge';

const BurnPage = () => {
  const { isAdmin } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.title = 'BURN | Limitless Motion';
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
              <Flame className="w-4 h-4 mr-2 inline" /> High Intensity
            </Badge>
            <h1 className="heading-display text-background mb-6">Push Your Limits.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 text-background/80">
              Ignite your metabolism with high-intensity interval training, metabolic conditioning, and cardio circuits designed to build unstoppable endurance.
            </p>
          </div>
        </motion.div>

        {isAdmin && (
          <WorkoutUploadForm onUploadSuccess={handleUploadSuccess} />
        )}

        <div className="mb-12">
          <h2 className="heading-section mb-8">Video Library</h2>
          <WorkoutGallery refreshTrigger={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default BurnPage;
