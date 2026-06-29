'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Clock, RefreshCw, Loader2, CheckCircle, Circle,
  Trophy, ArrowRight, ChevronDown, ChevronUp, Dumbbell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getWorkoutPrograms, getExercisesByProgram, getWorkoutDays,
  createWorkout, upsertUserWorkoutProgress,
} from '@/db';

const DAY_NAMES = ['Full Body Strength', 'Cardio & Conditioning', 'Mobility & Recovery', 'Power & Explosiveness', 'Core & Stability', 'Active Recovery', 'Full Body Endurance']

const MovePage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedExercises, setCheckedExercises] = useState({});
  const [completing, setCompleting] = useState(false);
  const [completedDays, setCompletedDays] = useState({});
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

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
        await loadWorkoutData(first.id);
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
      loadWorkoutData(filtered[0].id);
    }
    if (filtered.length === 0) {
      setDays([]);
      setExercises([]);
    }
  }, [difficulty, programs]);

  useEffect(() => {
    if (days.length > 0) {
      const weekNums = [...new Set(days.map(d => d.week_number))];
      if (weekNums.length > 0) setExpandedWeek(weekNums[0]);
      setExpandedDay(null);
    }
  }, [days]);

  async function loadWorkoutData(programId) {
    setLoading(true);
    setCheckedExercises({});
    setCompletedDays({});
    setExpandedWeek(null);
    setExpandedDay(null);
    try {
      const [dayRecords, exRecords] = await Promise.all([
        getWorkoutDays(programId),
        getExercisesByProgram(programId),
      ]);
      setDays(dayRecords || []);
      const mapped = (exRecords || []).map(e => ({
        id: e.id, name: e.exercise_name, sets: e.sets,
        reps: e.reps, focus: e.muscle_groups, tips: e.form_tips, day_id: e.day_id,
      }));
      setExercises(mapped);
    } catch (e) {
      console.warn('Failed to fetch workout data:', e);
      setDays([]);
      setExercises([]);
    }
    setLoading(false);
  }

  async function handleSelectProgram(programId) {
    setSelectedProgram(programId);
    await loadWorkoutData(programId);
  }

  function toggleWeek(weekNum) {
    setExpandedWeek(prev => prev === weekNum ? null : weekNum);
    setExpandedDay(null);
  }

  function toggleDay(dayId) {
    setExpandedDay(prev => prev === dayId ? null : dayId);
  }

  function toggleExercise(exId) {
    setCheckedExercises(prev => {
      const next = { ...prev };
      if (next[exId]) delete next[exId];
      else next[exId] = true;
      return next;
    });
  }

  const dayExercises = useCallback((dayId) => exercises.filter(ex => ex.day_id === dayId), [exercises])

  const handleComplete = useCallback(async (dayId) => {
    if (!currentUser) {
      toast.error('Please log in to track your workout');
      return;
    }
    const dayExs = dayExercises(dayId)
    if (!dayExs || dayExs.length === 0) {
      toast.error('No exercises found for this day');
      return;
    }

    const allChecked = dayExs.every(ex => checkedExercises[ex.id]);
    if (!allChecked) {
      toast.error('Complete all movements or uncheck skipped ones');
      return;
    }

    setCompleting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      for (const ex of dayExs) {
        await createWorkout({
          user_id: currentUser.id, exercise_name: ex.name, date: today,
          sets: ex.sets || 1, reps: ex.reps || '1',
        });
      }

      if (selectedProgram) {
        await upsertUserWorkoutProgress(currentUser.id, {
          program_id: selectedProgram, current_day: 1,
          completed_exercises: dayExs.map(e => e.name),
        });
      }

      setCompletedDays(prev => ({ ...prev, [dayId]: true }));
      setCheckedExercises(prev => {
        const next = { ...prev };
        dayExs.forEach(ex => delete next[ex.id]);
        return next;
      });
      toast.success('Day Complete! Great work.');
    } catch (e) {
      console.error('Failed to save workout:', e);
      toast.error('Failed to save workout.');
    }
    setCompleting(false);
  }, [currentUser, checkedExercises, selectedProgram, dayExercises]);

  const totalExercises = exercises.length;
  const checkedCount = Object.keys(checkedExercises).length;
  const currentProgram = programs.find(p => p.id === selectedProgram);

  const weekNumbers = [...new Set(days.map(d => d.week_number))].sort((a, b) => a - b);

  const exercisesByDay = {};
  exercises.forEach(ex => {
    const key = ex.day_id || 'ungrouped';
    if (!exercisesByDay[key]) exercisesByDay[key] = [];
    exercisesByDay[key].push(ex);
  });

  function getDaysForWeek(weekNum) {
    return days.filter(d => d.week_number === weekNum).sort((a, b) => a.day_of_week - b.day_of_week);
  }

  function getDayName(day, weekNum) {
    if (day.day_name && !day.day_name.includes('Week')) return day.day_name
    const idx = (day.day_of_week || 1) - 1
    return DAY_NAMES[idx] || `Day ${day.day_of_week}`
  }

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
                        ? 'bg-white text-black shadow-md'
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
          ) : totalExercises > 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-muted/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                        {weekNumbers.length} Weeks &bull; {days.length} Days &bull; {totalExercises} Movements
                      </span>
                      {currentProgram?.session_duration && (
                        <span className="flex items-center gap-1.5 text-sm font-medium bg-background px-3 py-1.5 rounded-lg border border-border">
                          <Clock className="w-4 h-4 text-muted-foreground" /> {currentProgram.session_duration} min
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-sm font-medium bg-background px-3 py-1.5 rounded-lg border border-border">
                        <Activity className="w-4 h-4 text-muted-foreground" /> {checkedCount}/{totalExercises}
                      </span>
                    </div>
                    {currentProgram?.description && (
                      <p className="text-sm text-muted-foreground">{currentProgram.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 md:p-6 space-y-6">
                  {weekNumbers.map(weekNum => {
                    const weekDays = getDaysForWeek(weekNum);
                    const weekExIds = weekDays.flatMap(d => (exercisesByDay[d.id] || []).map(ex => ex.id));
                    const weekChecked = weekExIds.filter(id => checkedExercises[id]).length;
                    const weekDoneDays = weekDays.filter(d => completedDays[d.id]).length;
                    const isWeekExpanded = expandedWeek === weekNum;

                    return (
                      <div key={weekNum} className="border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleWeek(weekNum)}
                          className="w-full flex items-center justify-between p-5 bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[hsl(var(--brand-move))]/10 flex items-center justify-center">
                              <span className="text-sm font-black text-[hsl(var(--brand-move))]">W{weekNum}</span>
                            </div>
                            <div className="text-left">
                              <h3 className="font-bold text-lg text-foreground">Week {weekNum}</h3>
                              <p className="text-xs text-muted-foreground">
                                {weekDays.length} days &bull; {weekExIds.length} movements &bull;
                                {weekDoneDays > 0 ? ` ${weekDoneDays}/${weekDays.length} days done` : ` ${weekChecked}/${weekExIds.length} checked`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {weekDoneDays === weekDays.length && weekDays.length > 0 && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {isWeekExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isWeekExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <div className="p-4 md:p-5 space-y-3">
                                {weekDays.map(day => {
                                  const dayExs = exercisesByDay[day.id] || [];
                                  if (dayExs.length === 0) return null;
                                  const dayChecked = dayExs.filter(ex => checkedExercises[ex.id]).length;
                                  const isDayExpanded = expandedDay === day.id;
                                  const dayDone = completedDays[day.id];

                                  return (
                                    <div key={day.id} className="border border-border rounded-xl overflow-hidden">
                                      <button
                                        type="button"
                                        onClick={() => toggleDay(day.id)}
                                        className="w-full flex items-center justify-between p-3.5 hover:bg-muted/20 transition-colors"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <Dumbbell className="w-4 h-4 text-[hsl(var(--brand-move))]" />
                                          <div className="text-left">
                                            <h4 className="font-semibold text-sm text-foreground">
                                              {dayDone && <CheckCircle className="w-3.5 h-3.5 text-green-500 inline mr-1.5" />}
                                              {getDayName(day, weekNum)}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                              {dayDone ? 'Completed' : `${dayExs.length} movements \u2022 ${dayChecked}/${dayExs.length} checked`}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {dayDone && <CheckCircle className="w-4 h-4 text-green-500" />}
                                          {isDayExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </div>
                                      </button>

                                      <AnimatePresence>
                                        {isDayExpanded && !dayDone && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-border"
                                          >
                                            <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                              {dayExs.map(ex => {
                                                const isChecked = !!checkedExercises[ex.id];
                                                return (
                                                  <div
                                                    key={ex.id}
                                                    className={`border rounded-xl p-3.5 flex flex-col cursor-pointer transition-colors ${
                                                      isChecked ? 'border-green-400 bg-green-50/5' : 'border-border hover:border-primary/50'
                                                    }`}
                                                    onClick={() => toggleExercise(ex.id)}
                                                  >
                                                    <div className="flex justify-between items-start mb-2">
                                                      <div className="flex items-center gap-2">
                                                        {isChecked ? (
                                                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                        ) : (
                                                          <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        )}
                                                        <h4 className="font-bold text-sm">{ex.name}</h4>
                                                      </div>
                                                      <Badge variant="secondary" className="bg-muted text-muted-foreground shrink-0 text-xs">{ex.focus}</Badge>
                                                    </div>
                                                    <div className="flex gap-2 mb-2 text-xs">
                                                      <div className="bg-muted/50 rounded p-1.5 flex-1 text-center">
                                                        <span className="block text-xs text-muted-foreground uppercase font-bold">Sets</span>
                                                        <span className="font-semibold">{ex.sets}</span>
                                                      </div>
                                                      <div className="bg-muted/50 rounded p-1.5 flex-1 text-center">
                                                        <span className="block text-xs text-muted-foreground uppercase font-bold">Reps</span>
                                                        <span className="font-semibold">{ex.reps}</span>
                                                      </div>
                                                    </div>
                                                    {ex.tips && (
                                                      <p className="text-xs text-muted-foreground mt-auto bg-[hsl(var(--brand-move))/5] p-1.5 rounded border border-[hsl(var(--brand-move))/10]">
                                                        <span className="font-semibold text-foreground">Focus:</span> {ex.tips}
                                                      </p>
                                                    )}
                                                  </div>
                                                );
                                              })}

                                              <div className="flex justify-end col-span-full pt-1">
                                                <Button
                                                  size="sm"
                                                  disabled={!dayExs.every(ex => checkedExercises[ex.id]) || completing}
                                                  onClick={() => handleComplete(day.id)}
                                                  className="bg-[hsl(var(--brand-move))] hover:bg-[hsl(var(--brand-move))/90] text-white font-bold gap-2"
                                                >
                                                  {completing ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                                  ) : (
                                                    <><Trophy className="w-4 h-4" /> Complete Workout</>
                                                  )}
                                                </Button>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>

                                      {dayDone && (
                                        <div className="border-t border-border px-4 py-3 text-center">
                                          <span className="text-sm text-green-600 font-medium flex items-center justify-center gap-1.5">
                                            <CheckCircle className="w-4 h-4" /> Day Completed
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {exercisesByDay['ungrouped'] && exercisesByDay['ungrouped'].length > 0 && (
                    <div className="border border-dashed border-border rounded-xl p-4 bg-muted/10">
                      <h4 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Other Movements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {exercisesByDay['ungrouped'].map(ex => {
                          const isChecked = !!checkedExercises[ex.id];
                          return (
                            <div
                              key={ex.id}
                              className={`border rounded-xl p-3.5 flex flex-col cursor-pointer transition-colors ${
                                isChecked ? 'border-green-400 bg-green-50/5' : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => toggleExercise(ex.id)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  {isChecked ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                                  <h4 className="font-bold text-sm">{ex.name}</h4>
                                </div>
                                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">{ex.focus}</Badge>
                              </div>
                              <div className="flex gap-2 mb-2 text-xs">
                                <div className="bg-muted/50 rounded p-1.5 flex-1 text-center">
                                  <span className="block text-xs text-muted-foreground uppercase font-bold">Sets</span>
                                  <span className="font-semibold">{ex.sets}</span>
                                </div>
                                <div className="bg-muted/50 rounded p-1.5 flex-1 text-center">
                                  <span className="block text-xs text-muted-foreground uppercase font-bold">Reps</span>
                                  <span className="font-semibold">{ex.reps}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
