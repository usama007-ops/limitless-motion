'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Clock, RefreshCw, Loader2, CheckCircle, Circle,
  Trophy, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getWorkoutPrograms, getWorkoutDays, getExercisesByDay,
  createWorkout, upsertUserWorkoutProgress,
} from '@/db';

const fallbackMoveWeek = [
  {
    day: 1, name: "Functional Foundations", duration: "45 min",
    exercises: [
      { name: "Turkish Get-Ups", sets: 3, reps: "5/side", focus: "Full Body", tips: "Keep eyes on the bell, move deliberately." },
      { name: "Kettlebell Deadlifts", sets: 4, reps: "10", focus: "Posterior Chain", tips: "Hinge at hips, maintain neutral spine." },
      { name: "Farmer Carries", sets: 4, reps: "40m", focus: "Core/Grip", tips: "Tall posture, braced core." },
      { name: "Bear Crawls", sets: 3, reps: "20m", focus: "Shoulders/Core", tips: "Keep hips low and level." },
      { name: "90/90 Hip Switches", sets: 2, reps: "10/side", focus: "Mobility", tips: "Move slowly, explore end ranges." },
    ],
  },
  {
    day: 2, name: "Mobility Flow", duration: "35 min",
    exercises: [
      { name: "World's Greatest Stretch", sets: 2, reps: "5/side", focus: "Hips/T-Spine", tips: "Breathe into the rotation." },
      { name: "Cossack Squats", sets: 3, reps: "8/side", focus: "Hips/Legs", tips: "Keep heel down on straight leg." },
      { name: "Downward Dog to Cobra", sets: 3, reps: "10", focus: "Full Body", tips: "Flow smoothly with breath." },
      { name: "Thread the Needle", sets: 2, reps: "8/side", focus: "T-Spine", tips: "Reach far, open chest." },
    ],
  },
  {
    day: 3, name: "Strength & Stability", duration: "50 min",
    exercises: [
      { name: "Single Leg RDLs", sets: 4, reps: "8/side", focus: "Hamstrings/Balance", tips: "Hinge slowly, keep hips square." },
      { name: "Overhead Press", sets: 4, reps: "10", focus: "Shoulders", tips: "Ribs down, squeeze glutes." },
      { name: "Pallof Presses", sets: 3, reps: "12/side", focus: "Core Anti-rotation", tips: "Resist the pull, exhale on press." },
      { name: "Sled Pushes", sets: 4, reps: "30m", focus: "Legs/Conditioning", tips: "Consistent drive, low angle." },
    ],
  },
  {
    day: 4, name: "Active Recovery", duration: "30 min",
    exercises: [
      { name: "Cat-Cow", sets: 2, reps: "15", focus: "Spine", tips: "Segmental movement." },
      { name: "Pigeon Pose", sets: 2, reps: "60 sec/side", focus: "Hips", tips: "Relax into the stretch." },
      { name: "Box Breathing", sets: 1, reps: "5 min", focus: "Nervous System", tips: "4s inhale, 4s hold, 4s exhale, 4s hold." },
    ],
  },
];

function processDays(days) {
  return days.map((d) => ({
    id: d.id,
    day: d.day_of_week,
    name: d.day_name,
    duration: `${d.estimated_duration || 30} min`,
    focus: d.focus_area,
    exercises: (d.exercises || []).map(e => ({
      id: e.id,
      name: e.exercise_name,
      sets: e.sets,
      reps: e.reps || e.duration,
      focus: e.muscle_groups || e.focus_area,
      tips: e.form_tips,
    })),
  }));
}

const MovePage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [days, setDays] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedExercises, setCheckedExercises] = useState({});
  const [completingDay, setCompletingDay] = useState(null);
  const [completedDays, setCompletedDays] = useState(new Set());

  useEffect(() => {
    document.title = 'MOVE | Limitless Motion';
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      const records = await getWorkoutPrograms();
      if (records && records.length > 0) {
        setPrograms(records);
        setSelectedProgram(records[0].id);
        await loadProgramDays(records[0].id);
        return;
      }
    } catch (e) {
      console.warn('Failed to fetch programs, using fallback:', e);
    }
    setDays(fallbackMoveWeek);
    setLoading(false);
  }

  async function loadProgramDays(programId) {
    setLoading(true);
    setCheckedExercises({});
    try {
      const dayRecords = await getWorkoutDays(programId);
      if (dayRecords && dayRecords.length > 0) {
        const daysWithExercises = await Promise.all(
          dayRecords.map(async (day) => {
            try {
              const exercises = await getExercisesByDay(day.id);
              return { ...day, exercises: exercises || [] };
            } catch {
              return { ...day, exercises: [] };
            }
          })
        );
        setDays(processDays(daysWithExercises));
      } else {
        setDays(fallbackMoveWeek);
      }
    } catch (e) {
      console.warn('Failed to fetch days, using fallback:', e);
      setDays(fallbackMoveWeek);
    }
    setLoading(false);
  }

  async function handleSelectProgram(programId) {
    setSelectedProgram(programId);
    await loadProgramDays(programId);
  }

  function toggleExercise(dayIdx, exIdx) {
    setCheckedExercises(prev => {
      const key = `${dayIdx}-${exIdx}`;
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  }

  const handleCompleteWorkout = useCallback(async (day, dayIdx) => {
    if (!currentUser) {
      toast.error('Please log in to track your workout');
      return;
    }

    const allChecked = day.exercises.every((_, i) => checkedExercises[`${dayIdx}-${i}`]);
    if (!allChecked) {
      toast.error('Complete all exercises or uncheck the ones you skipped');
      return;
    }

    setCompletingDay(dayIdx);
    try {
      const today = new Date().toISOString().split('T')[0];

      for (const ex of day.exercises) {
        await createWorkout({
          user_id: currentUser.id,
          exercise_name: ex.name,
          date: today,
          sets: ex.sets || 1,
          reps: ex.reps || 1,
        });
      }

      const completedExerciseNames = day.exercises.map(e => e.name);
      if (selectedProgram) {
        await upsertUserWorkoutProgress(currentUser.id, {
          program_id: selectedProgram,
          current_day: day.day,
          completed_exercises: completedExerciseNames,
        });
      }

      setCompletedDays(prev => new Set(prev).add(dayIdx));
      setCheckedExercises(prev => {
        const next = { ...prev };
        day.exercises.forEach((_, i) => delete next[`${dayIdx}-${i}`]);
        return next;
      });

      toast.success(
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-bold">{day.name} Complete!</p>
            <p className="text-sm text-muted-foreground">Great work. Keep the streak alive.</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    } catch (e) {
      console.error('Failed to save workout:', e);
      toast.error('Failed to save workout. Please try again.');
    }
    setCompletingDay(null);
  }, [currentUser, checkedExercises, selectedProgram]);

  const allExercisesChecked = (day, dayIdx) =>
    day.exercises.length > 0 && day.exercises.every((_, i) => checkedExercises[`${dayIdx}-${i}`]);

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-[hsl(var(--brand-move))] text-white p-8 md:p-16 mb-16"
        >
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-6 uppercase tracking-widest font-bold">
              <RefreshCw className="w-4 h-4 mr-2 inline" /> Functional Movement
            </Badge>
            <h1 className="heading-display mb-6">Move With Purpose.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 mb-8">
              Master your body. Focus on movement quality, functional strength, and mobility flows to build a resilient, pain-free foundation for life.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                <Button
                  key={level}
                  variant={difficulty === level ? "secondary" : "ghost"}
                  className={difficulty === level
                    ? "bg-white text-[hsl(var(--brand-move))] hover:bg-white/90 font-bold"
                    : "border border-white/50 bg-transparent text-white hover:bg-white/10 font-bold"}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {programs.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {programs.map(p => (
              <Button
                key={p.id}
                variant={selectedProgram === p.id ? "default" : "outline"}
                onClick={() => handleSelectProgram(p.id)}
                className="font-bold"
              >
                {p.name}
              </Button>
            ))}
          </div>
        )}

        <div className="mb-12">
          <h2 className="heading-section mb-8">
            {selectedProgram
              ? programs.find(p => p.id === selectedProgram)?.name || "This Week's Protocol"
              : "This Week's Protocol"}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              {days?.map((day, dayIdx) => {
                const isCompleted = completedDays.has(dayIdx);
                const allChecked = allExercisesChecked(day, dayIdx);
                return (
                  <motion.div key={day.day || dayIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dayIdx * 0.1 }}>
                    <div className={`bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isCompleted ? 'border-green-500/50' : 'border-border'}`}>
                      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-muted/30">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Day {day.day}</span>
                            <Badge variant="outline" className="border-[hsl(var(--brand-move))/30] text-[hsl(var(--brand-move))] bg-[hsl(var(--brand-move))/5]">
                              {day.exercises?.length || 0} Movements
                            </Badge>
                            {isCompleted && (
                              <Badge className="bg-green-500/15 text-green-600 border-green-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" /> Complete
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold">{day.name}</h3>
                          {day.focus && (
                            <p className="text-sm text-muted-foreground mt-1">{day.focus}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border">
                            <Clock className="w-4 h-4 text-muted-foreground" /> {day.duration}
                          </span>
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="exercises" className="border-none">
                          <AccordionTrigger className="px-4 md:px-6 hover:no-underline hover:bg-muted/50 rounded-xl transition-colors">
                            <span className="font-semibold">View Movements</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 md:px-6 pb-6 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {day.exercises?.map((ex, i) => {
                                const isChecked = !!checkedExercises[`${dayIdx}-${i}`];
                                return (
                                  <div
                                    key={i}
                                    className={`bg-background border rounded-xl p-4 flex flex-col cursor-pointer transition-colors ${isChecked ? 'border-green-400 bg-green-50/5' : 'border-border hover:border-primary/50'}`}
                                    onClick={() => !isCompleted && toggleExercise(dayIdx, i)}
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-2">
                                        {isCompleted ? (
                                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        ) : isChecked ? (
                                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        ) : (
                                          <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                                        )}
                                        <h4 className="font-bold text-lg">{ex.name}</h4>
                                      </div>
                                      <Badge variant="secondary" className="bg-muted text-muted-foreground">{ex.focus}</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                      <div className="bg-muted/50 rounded p-2">
                                        <span className="block text-xs text-muted-foreground uppercase font-bold">Sets</span>
                                        <span className="font-semibold">{ex.sets}</span>
                                      </div>
                                      <div className="bg-muted/50 rounded p-2">
                                        <span className="block text-xs text-muted-foreground uppercase font-bold">Reps/Time</span>
                                        <span className="font-semibold">{ex.reps}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-auto bg-[hsl(var(--brand-move))/5] p-2 rounded border border-[hsl(var(--brand-move))/10]">
                                      <span className="font-semibold text-foreground">Focus:</span> {ex.tips}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>

                            {!isCompleted && (
                              <div className="mt-6 flex justify-end">
                                <Button
                                  size="lg"
                                  disabled={!allChecked || completingDay === dayIdx}
                                  onClick={() => handleCompleteWorkout(day, dayIdx)}
                                  className="bg-[hsl(var(--brand-move))] hover:bg-[hsl(var(--brand-move))/90] text-white font-bold gap-2"
                                >
                                  {completingDay === dayIdx ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                  ) : (
                                    <><Trophy className="w-4 h-4" /> Complete Workout</>
                                  )}
                                </Button>
                              </div>
                            )}

                            {isCompleted && (
                              <div className="mt-6 flex justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => router.push('/track')}
                                  className="gap-2 font-semibold"
                                >
                                  View Progress <ArrowRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovePage;
