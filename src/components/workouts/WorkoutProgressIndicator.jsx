import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Flame, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getUserWorkoutProgress } from '@/db';

const WorkoutProgressIndicator = ({ categoryFilter = null }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) return;
      try {
        const records = await getUserWorkoutProgress(currentUser.id, { categoryFilter });

        if (records && records.length > 0) {
          setProgress(records[0]);
        }
      } catch (error) {
        console.error('Error fetching progress indicator:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser, categoryFilter]);

  if (loading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  if (!progress) {
    return null;
  }

  const program = progress.workout_programs;
  const totalDays = 20;
  const percentComplete = Math.min(Math.round((progress.current_day / totalDays) * 100), 100);
  const streak = 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-card border-border/60 shadow-sm rounded-2xl overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            <div className="flex-grow w-full md:w-auto">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg tracking-tight">Current Track: {program?.name}</h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Day {progress.current_day}
                </span>
                <span className="flex items-center gap-1.5 text-orange-500 font-medium">
                  <Flame className="w-4 h-4" /> {streak} Day Streak
                </span>
              </div>

              <div className="space-y-2 max-w-md">
                <div className="flex justify-between text-xs font-medium">
                  <span>Progress</span>
                  <span>{percentComplete}%</span>
                </div>
                <Progress value={percentComplete} className="h-2 bg-muted" indicatorClassName="bg-primary" />
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Button 
                onClick={() => router.push(`/align`)}
                className="w-full md:w-auto shadow-sm"
              >
                Continue Program <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WorkoutProgressIndicator;
