'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Activity, TrendingUp, Target, Flame, Award, Loader2,
  Plus, Pencil, Trash2, Dumbbell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getWeeklyActivity, getWorkoutStreak, getUserWorkouts, getWorkoutStats } from '@/db';
import Link from 'next/link';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function computePRs(workouts) {
  if (!workouts || workouts.length === 0) return [];
  const bestByExercise = {};
  for (const w of workouts) {
    const key = w.exercise_name;
    if (!bestByExercise[key]) {
      bestByExercise[key] = { name: key, maxWeight: 0, maxReps: 0, date: w.date };
    }
    const wgt = Number(w.weight) || 0;
    const rps = Number(w.reps) || 0;
    if (wgt > bestByExercise[key].maxWeight) {
      bestByExercise[key].maxWeight = wgt;
      bestByExercise[key].date = w.date;
    }
    if (rps > bestByExercise[key].maxReps) {
      bestByExercise[key].maxReps = rps;
      bestByExercise[key].date = w.date;
    }
  }
  return Object.values(bestByExercise)
    .filter(p => p.maxWeight > 0 || p.maxReps > 0)
    .sort((a, b) => (b.maxWeight || b.maxReps) - (a.maxWeight || a.maxReps))
    .slice(0, 10);
}

function calcTDEE(profile) {
  if (!profile?.weight_kg || !profile?.height_cm || !profile?.age) return null;
  const bmr = profile.gender === 'female'
    ? 447.593 + 9.247 * profile.weight_kg + 3.098 * profile.height_cm - 4.330 * profile.age
    : 88.362 + 13.397 * profile.weight_kg + 4.799 * profile.height_cm - 5.677 * profile.age;
  const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extreme: 1.9 };
  const mult = activityMultipliers[profile.activity_level] || 1.55;
  return Math.round(bmr * mult);
}

const TrackPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [stats, setStats] = useState({ totalWorkouts: 0, recentWorkouts: [] });
  const [personalRecords, setPersonalRecords] = useState([]);
  const [manualPRs, setManualPRs] = useState([]);
  const [tdee, setTdee] = useState(null);
  const [showAddPR, setShowAddPR] = useState(false);
  const [editingPR, setEditingPR] = useState(null);
  const [prForm, setPrForm] = useState({ name: '', value: '', unit: 'lbs', date: '' });

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [weekly, streakData, statsData, workoutRecords] = await Promise.all([
        getWeeklyActivity(currentUser.id),
        getWorkoutStreak(currentUser.id),
        getWorkoutStats(currentUser.id),
        getUserWorkouts(currentUser.id),
      ]);
      setActivityData(weekly);
      setStreak(streakData);
      setStats(statsData);
      setPersonalRecords(computePRs(workoutRecords));

      if (currentUser.user_metadata) {
        const t = calcTDEE(currentUser.user_metadata);
        if (t) setTdee(t);
      }
    } catch (e) {
      console.error('Failed to load tracking data:', e);
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    document.title = 'TRACK | Limitless Motion';
    fetchData();
  }, [fetchData]);

  const thisWeekCount = activityData.reduce((sum, d) => sum + d.workouts, 0);
  const consistency = stats.totalWorkouts > 0
    ? Math.min(100, Math.round((thisWeekCount / Math.max(stats.totalWorkouts, 7)) * 100))
    : 0;

  function handleAddPR() {
    if (!prForm.name.trim()) return;
    const newPR = { ...prForm, id: Date.now().toString(), date: prForm.date || new Date().toISOString().split('T')[0] };
    setManualPRs(prev => [...prev, newPR]);
    setPrForm({ name: '', value: '', unit: 'lbs', date: '' });
    setShowAddPR(false);
  }

  function handleEditPR(pr) {
    setEditingPR(pr.id);
    setPrForm({ name: pr.name, value: pr.value, unit: pr.unit, date: pr.date });
    setShowAddPR(true);
  }

  function handleSaveEdit() {
    setManualPRs(prev => prev.map(p => p.id === editingPR ? { ...p, ...prForm } : p));
    setEditingPR(null);
    setPrForm({ name: '', value: '', unit: 'lbs', date: '' });
    setShowAddPR(false);
  }

  function handleDeletePR(id) {
    setManualPRs(prev => prev.filter(p => p.id !== id));
  }

  const allPRs = [...personalRecords, ...manualPRs];

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="heading-display mb-4">Your Progress.</h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl leading-relaxed">
            Data-driven insights to keep you aligned with your goals. Track your consistency, intensity, and achievements.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Workouts</span>
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">{stats.totalWorkouts}</div>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> {thisWeekCount} this week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Streak</span>
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">
                    {streak.currentStreak} <span className="text-xl text-muted-foreground font-medium">days</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">Best: {streak.longestStreak} days</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Daily Calorie Target</span>
                    <Target className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">
                    {tdee ? `${tdee}` : '—'}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    {tdee ? 'Based on your profile' : <Link href="/calculator" className="text-primary underline">Set on Calculator</Link>}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Consistency</span>
                    <Award className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">{consistency}%</div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">This week vs total</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Workout days completed over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Records</CardTitle>
                    <CardDescription>Your all-time bests</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setShowAddPR(true); setEditingPR(null); setPrForm({ name: '', value: '', unit: 'lbs', date: '' }); }}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showAddPR && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border">
                      <Input
                        placeholder="Exercise name (e.g. Deadlift)"
                        value={prForm.name}
                        onChange={e => setPrForm(p => ({ ...p, name: e.target.value }))}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Value"
                          value={prForm.value}
                          onChange={e => setPrForm(p => ({ ...p, value: e.target.value }))}
                          className="text-sm flex-1"
                        />
                        <select
                          value={prForm.unit}
                          onChange={e => setPrForm(p => ({ ...p, unit: e.target.value }))}
                          className="bg-background border border-border rounded-md px-2 text-sm"
                        >
                          <option value="lbs">lbs</option>
                          <option value="kg">kg</option>
                          <option value="reps">reps</option>
                          <option value="min">min</option>
                          <option value="sec">sec</option>
                        </select>
                      </div>
                      <Input
                        type="date"
                        value={prForm.date}
                        onChange={e => setPrForm(p => ({ ...p, date: e.target.value }))}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={editingPR ? handleSaveEdit : handleAddPR}>
                          {editingPR ? 'Save' : 'Add'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setShowAddPR(false); setEditingPR(null); }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {allPRs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No records yet. Complete workouts to auto-generate PRs, or add one manually.
                    </p>
                  ) : (
                    allPRs.map((pr, i) => (
                      <div key={pr.id || i}>
                        <div className="group flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-bold">{pr.name}</p>
                            <p className="text-lg font-black text-primary">
                              {pr.value} {pr.unit}
                            </p>
                            {pr.date && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(pr.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditPR(pr)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDeletePR(pr.id)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                        {i < allPRs.length - 1 && <div className="w-full h-px bg-border mt-4" />}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {stats.recentWorkouts.length > 0 && (
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                  <CardDescription>Your latest logged sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stats.recentWorkouts.slice(0, 9).map(w => (
                      <div key={w.id} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3 border border-border/50">
                        <Dumbbell className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{w.exerciseName}</p>
                          <p className="text-xs text-muted-foreground">
                            {w.sets}×{w.reps}{w.weight ? ` @ ${w.weight}${w.weightUnit || 'lbs'}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
