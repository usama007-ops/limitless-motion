'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Clock, RefreshCw, Loader2, CheckCircle, Circle,
  Trophy, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getWorkoutPrograms, getExercisesByProgram,
  createWorkout, upsertUserWorkoutProgress,
} from '@/db';

const MovePage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedExercises, setCheckedExercises] = useState({});
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    document.title = 'MOVE | Limitless Motion';
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      const records = await getWorkoutPrograms();
      if (records && records.length > 0) {
        setPrograms(records);
        const first = records[0];
        setSelectedProgram(first.id);
        setDifficulty(first.difficulty || null);
        await loadExercises(first.id);
        return;
      }
    } catch (e) {
      console.warn('Failed to fetch programs:', e);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (programs.length === 0) return;
    const filtered = difficulty
      ? programs.filter(p => p.difficulty === difficulty.toLowerCase())
      : [...programs];
    setFilteredPrograms(filtered);
    if (filtered.length > 0 && (!selectedProgram || !filtered.find(p => p.id === selectedProgram))) {
      setSelectedProgram(filtered[0].id);
      loadExercises(filtered[0].id);
    }
    if (filtered.length === 0) {
      setExercises(null);
    }
  }, [difficulty, programs]);

  async function loadExercises(programId) {
    setLoading(true);
    setCheckedExercises({});
    setCompleted(false);
    try {
      const exRecords = await getExercisesByProgram(programId);
      if (exRecords && exRecords.length > 0) {
        setExercises(exRecords.map(e => ({
          id: e.id,
          name: e.exercise_name,
          sets: e.sets,
          reps: e.reps,
          focus: e.muscle_groups,
          tips: e.form_tips,
        })));
      } else {
        setExercises(null);
      }
    } catch (e) {
      console.warn('Failed to fetch exercises:', e);
      setExercises(null);
    }
    setLoading(false);
  }

  async function handleSelectProgram(programId) {
    setSelectedProgram(programId);
    await loadExercises(programId);
  }

  function toggleExercise(exIdx) {
    setCheckedExercises(prev => {
      const next = { ...prev };
      if (next[exIdx]) delete next[exIdx];
      else next[exIdx] = true;
      return next;
    });
  }

  const handleComplete = useCallback(async () => {
    if (!currentUser) {
      toast.error('Please log in to track your workout');
      return;
    }
    if (!exercises || exercises.length === 0) return;

    const allChecked = exercises.every((_, i) => checkedExercises[i]);
    if (!allChecked) {
      toast.error('Complete all movements or uncheck skipped ones');
      return;
    }

    setCompleting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      for (const ex of exercises) {
        await createWorkout({
          user_id: currentUser.id,
          exercise_name: ex.name,
          date: today,
          sets: ex.sets || 1,
          reps: ex.reps || 1,
        });
      }

      if (selectedProgram) {
        await upsertUserWorkoutProgress(currentUser.id, {
          program_id: selectedProgram,
          current_day: 1,
          completed_exercises: exercises.map(e => e.name),
        });
      }

      setCompleted(true);
      setCheckedExercises({});
      toast.success('Workout Complete! Great work.');
    } catch (e) {
      console.error('Failed to save workout:', e);
      toast.error('Failed to save workout.');
    }
    setCompleting(false);
  }, [currentUser, checkedExercises, exercises, selectedProgram]);

  const allChecked = exercises && exercises.length > 0 && exercises.every((_, i) => checkedExercises[i]);
  const currentProgram = programs.find(p => p.id === selectedProgram);

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
              {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                const active = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    className={`px-5 py-2.5 rounded-md text-sm font-bold transition-all duration-200 ${
                      active
                        ? 'bg-white text-[hsl(var(--brand-move))] shadow-md'
                        : 'border border-white/50 bg-transparent text-white hover:bg-white/15'
                    }`}
                    onClick={() => setDifficulty(active ? null : level)}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {filteredPrograms.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {filteredPrograms.map(p => (
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
            {filteredPrograms.length === 0
              ? 'No programs found for this level'
              : currentProgram?.name || 'Movements'}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : exercises && exercises.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-muted/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                        {exercises.length} Movements
                      </span>
                      {currentProgram?.session_duration && (
                        <span className="flex items-center gap-1.5 text-sm font-medium bg-background px-3 py-1.5 rounded-lg border border-border">
                          <Clock className="w-4 h-4 text-muted-foreground" /> {currentProgram.session_duration} min
                        </span>
                      )}
                      {completed && (
                        <Badge className="bg-green-500/15 text-green-600 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" /> Complete
                        </Badge>
                      )}
                    </div>
                    {currentProgram?.description && (
                      <p className="text-sm text-muted-foreground">{currentProgram.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exercises.map((ex, i) => {
                      const isChecked = !!checkedExercises[i];
                      return (
                        <div
                          key={ex.id || i}
                          className={`bg-background border rounded-xl p-4 flex flex-col cursor-pointer transition-colors ${
                            isChecked ? 'border-green-400 bg-green-50/5' : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => !completed && toggleExercise(i)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              {isChecked ? (
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
                          {ex.tips && (
                            <p className="text-sm text-muted-foreground mt-auto bg-[hsl(var(--brand-move))/5] p-2 rounded border border-[hsl(var(--brand-move))/10]">
                              <span className="font-semibold text-foreground">Focus:</span> {ex.tips}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!completed && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        size="lg"
                        disabled={!allChecked || completing}
                        onClick={handleComplete}
                        className="bg-[hsl(var(--brand-move))] hover:bg-[hsl(var(--brand-move))/90] text-white font-bold gap-2"
                      >
                        {completing ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : (
                          <><Trophy className="w-4 h-4" /> Complete Workout</>
                        )}
                      </Button>
                    </div>
                  )}

                  {completed && (
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
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-10 text-center bg-muted/20 rounded-2xl border border-dashed border-border text-muted-foreground">
              No movements found for this program. Add some in admin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovePage;
