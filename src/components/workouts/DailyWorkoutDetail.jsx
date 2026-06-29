import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Dumbbell, Timer, Flame, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getWorkoutDay, getExercisesByDay } from '@/db';

const DailyWorkoutDetail = ({ dayId: propDayId, onBack }) => {
  const params = useParams();
  const router = useRouter();
  const routeDayId = params?.dayId;
  const id = propDayId || routeDayId;

  const [day, setDay] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const d = await getWorkoutDay(id);
        setDay(d);

        const ex = await getExercisesByDay(id);
        setExercises(ex);
      } catch (error) {
        console.error('Error fetching daily details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    if (onBack) onBack();
    else if (day?.program_id) router.push(`/align`);
    else router.push('/align');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!day) return null;

  const programName = day.workout_programs?.name || 'Program';

  return (
    <div className="space-y-10 pb-12">
      <Button variant="ghost" onClick={handleBack} className="pl-0 hover:bg-transparent hover:text-primary text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to {programName}
      </Button>

      <div className="bg-secondary text-secondary-foreground rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.08] pointer-events-none">
          <Flame className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <Badge variant="outline" className="mb-5 bg-background/10 text-secondary-foreground border-secondary-foreground/20 uppercase tracking-widest">
            Day {day.day_of_week}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">{day.day_name}</h2>
          <p className="text-secondary-foreground/80 text-lg md:text-xl max-w-2xl font-light">
            Focus Area: <span className="font-semibold text-secondary-foreground">{day.focus_area || 'Full Body'}</span>
          </p>
          {day.estimated_duration && (
            <div className="mt-8 flex items-center gap-2.5 text-sm font-bold bg-background text-foreground w-fit px-5 py-2.5 rounded-xl shadow-sm">
              <Timer className="w-5 h-5 text-primary" /> Est. Time: {day.estimated_duration} minutes
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Dumbbell className="w-6 h-6 text-primary" /> Workout Routine
        </h3>

        {exercises.length === 0 ? (
          <div className="p-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border shadow-sm">
            <p className="text-muted-foreground text-lg">No exercises defined for this day. Enjoy your rest!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-2xl border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="bg-muted/30 p-6 md:p-8 lg:w-1/3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/60 relative">
                        <span className="absolute top-4 right-4 text-4xl font-black text-foreground/5 opacity-50 select-none">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <h4 className="text-xl font-bold mb-4 pr-8">{exercise.exercise_name}</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(exercise.muscle_groups || []).map((mg, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-background border border-border/50 shadow-sm">
                              {mg}
                            </Badge>
                          ))}
                        </div>
                        {exercise.difficulty && (
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Level: <span className="text-foreground/80">{exercise.difficulty}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="p-6 md:p-8 lg:w-2/3 flex flex-col justify-center">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          <div className="bg-background border border-border/60 rounded-xl p-4 text-center shadow-sm">
                            <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Sets</span>
                            <span className="font-black text-2xl tracking-tight text-foreground/90">{exercise.sets || '-'}</span>
                          </div>
                          <div className="bg-background border border-border/60 rounded-xl p-4 text-center shadow-sm">
                            <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Reps</span>
                            <span className="font-black text-2xl tracking-tight text-foreground/90">{exercise.reps || '-'}</span>
                          </div>
                          <div className="bg-background border border-border/60 rounded-xl p-4 text-center shadow-sm">
                            <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Duration</span>
                            <span className="font-black text-xl tracking-tight text-foreground/90 leading-[32px]">{exercise.duration || '-'}</span>
                          </div>
                          <div className="bg-background border border-border/60 rounded-xl p-4 text-center shadow-sm">
                            <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Rest</span>
                            <span className="font-black text-xl tracking-tight text-foreground/90 leading-[32px]">{exercise.rest_period || '-'}</span>
                          </div>
                        </div>
                        
                        {exercise.form_tips && (
                          <div className="flex gap-3.5 bg-primary/5 text-primary-foreground p-5 rounded-xl border border-primary/20 shadow-sm">
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground/90 leading-relaxed font-medium">{exercise.form_tips}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyWorkoutDetail;
