import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Clock, ChevronRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getWorkoutPrograms } from '@/db';

const WorkoutProgramSelector = ({ onSelectProgram, categoryFilter = null, socialFilter = null }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const records = await getWorkoutPrograms({
          category: categoryFilter,
          social: socialFilter,
        });
        setPrograms(records || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [categoryFilter, socialFilter]);

  const handleSelect = (id) => {
    if (onSelectProgram) onSelectProgram(id);
    else router.push(`/align`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="bg-muted/30 rounded-2xl p-12 text-center border border-border border-dashed">
        <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground">No programs available</p>
        <p className="text-muted-foreground mt-2">New training tracks are being developed for this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {programs.map((program, index) => (
        <motion.div
          key={program.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Card 
            className="h-full flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60 bg-card rounded-2xl overflow-hidden cursor-pointer relative" 
            onClick={() => handleSelect(program.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-semibold">
                  {program.difficulty || 'All Levels'}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5 font-medium border-border/80">
                  <Clock className="w-3 h-3" />
                  {program.session_duration} min
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-balance group-hover:text-primary transition-colors">{program.name}</CardTitle>
              <CardDescription className="text-base line-clamp-2 mt-2 leading-relaxed">{program.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="capitalize font-medium text-foreground/80">{program.goal}</span>
                </div>
                {program.workout_type && (
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="capitalize font-medium text-foreground/80">{program.workout_type}</span>
                  </div>
                )}
              </div>
              <Button variant="default" className="w-full sm:w-auto self-start group-hover:bg-primary/90 transition-colors shadow-sm">
                View Track <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default WorkoutProgramSelector;
