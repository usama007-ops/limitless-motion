import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, PlayCircle, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getWorkoutProgram, getWorkoutDays } from '@/db';

const WorkoutWeeklyOverview = ({ programId: propProgramId, onBack, onSelectDay }) => {
  const params = useParams();
  const router = useRouter();
  const routeProgramId = params?.programId;
  const id = propProgramId || routeProgramId;

  const [program, setProgram] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const p = await getWorkoutProgram(id);
        setProgram(p);

        const d = await getWorkoutDays(id);
        setDays(d);
      } catch (error) {
        console.error('Error fetching weekly overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    if (onBack) onBack();
    else router.push('/align');
  };

  const handleDaySelect = (dayId) => {
    if (onSelectDay) onSelectDay(dayId);
    else router.push(`/align`);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!program) return null;

  return (
    <div className="space-y-10">
      <Button variant="ghost" onClick={handleBack} className="mb-2 pl-0 hover:bg-transparent hover:text-primary text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
      </Button>

      <div className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <Badge variant="secondary" className="mb-5 font-semibold tracking-wide uppercase">{program.difficulty}</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">{program.name}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-8">
            {program.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 text-foreground/90 bg-muted/60 px-4 py-2 rounded-lg border border-border/50 shadow-sm">
              <Target className="w-4 h-4 text-primary" /> {program.goal}
            </span>
            <span className="flex items-center gap-2 text-foreground/90 bg-muted/60 px-4 py-2 rounded-lg border border-border/50 shadow-sm">
              <Clock className="w-4 h-4 text-primary" /> {program.session_duration} min/session
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" /> Weekly Schedule
        </h3>

        {days.length === 0 ? (
          <div className="p-10 text-center bg-muted/20 rounded-2xl border border-dashed border-border text-muted-foreground">
            No schedule days found for this program.
          </div>
        ) : (
          <div className="space-y-4">
            {days.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-300 rounded-2xl overflow-hidden bg-card/80"
                  onClick={() => handleDaySelect(day.id)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center p-4 md:p-6 gap-6">
                      <div className="flex-shrink-0 w-20 h-20 bg-secondary/30 rounded-2xl flex flex-col items-center justify-center text-center border border-secondary/50 group-hover:bg-secondary/50 transition-colors">
                        <span className="text-xs font-bold text-secondary-foreground/70 uppercase tracking-widest mb-0.5">Day</span>
                        <span className="text-2xl font-black text-secondary-foreground">{day.day_of_week}</span>
                      </div>

                      <div className="flex-grow">
                        <h4 className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">{day.day_name}</h4>
                        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2.5">
                          <span className="bg-background px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
                            Focus: <span className="text-foreground/90 font-semibold">{day.focus_area || 'Active Recovery'}</span>
                          </span>
                          {day.estimated_duration && (
                            <span className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {day.estimated_duration}m
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex-shrink-0 sm:ml-auto">
                        <Button variant="ghost" size="icon" className="group-hover:bg-primary group-hover:text-primary-foreground text-foreground rounded-full h-12 w-12 transition-all shadow-sm">
                          <PlayCircle className="w-6 h-6" />
                        </Button>
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

export default WorkoutWeeklyOverview;
