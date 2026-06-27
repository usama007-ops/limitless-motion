'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Dumbbell, TrendingUp, Calendar, ArrowRight, Activity, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWorkoutStats, getWorkoutStreak } from '@/db';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ totalWorkouts: 0, recentWorkouts: [] });
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Dashboard - ${currentUser?.name || 'Client'} - Limitless Motion`;
  }, [currentUser]);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [statsData, streakData] = await Promise.all([
        getWorkoutStats(currentUser.id),
        getWorkoutStreak(currentUser.id),
      ]);
      setStats(statsData);
      setStreak(streakData);
    } catch (e) {
      console.error('Failed to load dashboard stats:', e);
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const lastWorkout = stats.recentWorkouts?.[0];

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <div className="mb-16 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-foreground tracking-tight">
            Welcome back, <span className="text-primary italic">{currentUser?.name?.split(' ')[0] || 'Member'}</span>
          </h1>
          <p className="text-muted-foreground text-lg">Track your progress and continue your Limitless Motion journey.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-8 shadow-sm">
                <Skeleton className="h-4 w-24 mb-4 bg-muted" />
                <Skeleton className="h-10 w-16 bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm relative overflow-hidden group hover:border-primary transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-4">
                <Dumbbell className="text-primary" size={18} />
                Total Workouts
              </div>
              <p className="text-5xl font-medium font-serif text-foreground">
                {stats.totalWorkouts}
              </p>
              {streak.currentStreak > 0 && (
                <p className="text-sm text-muted-foreground mt-2">{streak.currentStreak}-day streak</p>
              )}
            </div>

            <div className="bg-card border border-border rounded-lg p-8 shadow-sm relative overflow-hidden group hover:border-accent transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
              <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-4">
                <TrendingUp className="text-accent" size={18} />
                This Week
              </div>
              <p className="text-5xl font-medium font-serif text-foreground">
                {stats.totalWorkouts > 0 ? 'Active' : '0'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">Keep moving forward</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 shadow-sm relative overflow-hidden group hover:border-secondary-foreground transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary-foreground/40"></div>
              <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-4">
                <Calendar className="text-secondary-foreground/60" size={18} />
                Last Workout
              </div>
              <p className="text-2xl font-medium font-serif text-foreground mt-2">
                {lastWorkout
                  ? new Date(lastWorkout.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'No workouts yet'}
              </p>
              {lastWorkout && (
                <p className="text-sm text-muted-foreground mt-1">{lastWorkout.exerciseName}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif font-medium text-foreground tracking-wide mb-2">
              Recent Activity
            </h2>
            <p className="text-muted-foreground mb-8 text-sm">Your latest workout sessions</p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-muted rounded-md" />
                ))}
              </div>
            ) : stats.recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentWorkouts.slice(0, 5).map((workout) => (
                  <div
                    key={workout.id}
                    className="flex justify-between items-center p-5 bg-background border border-border rounded-md hover:border-primary hover:shadow-sm transition-all"
                  >
                    <div>
                      <p className="font-semibold text-foreground text-lg">{workout.exerciseName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {workout.sets} sets × {workout.reps} reps
                        {workout.weight && ` @ ${workout.weight}${workout.weightUnit || 'lbs'}`}
                      </p>
                    </div>
                    <p className="text-xs text-primary font-semibold tracking-[0.1em] uppercase">
                      {new Date(workout.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-md bg-background">
                <p className="text-muted-foreground mb-6 text-sm">
                  No workouts logged yet. Start tracking your progress.
                </p>
                <Button asChild className="btn-premium-outline">
                  <Link href="/move">Start Your First Workout</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-primary border border-primary rounded-lg p-8 flex flex-col h-full shadow-sm">
              <Activity className="text-primary-foreground mb-6" size={28} strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-medium mb-2 text-primary-foreground tracking-wide">Workout Tracker</h3>
              <p className="text-primary-foreground/80 mb-8 text-sm">Log your exercises and track your progress over time.</p>
              <Link href="/move" className="mt-auto">
                <Button className="w-full bg-background text-foreground hover:bg-background/90 font-semibold uppercase tracking-[0.1em] py-6 rounded-md transition-all">
                  Go to Workouts <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>

            <div className="bg-secondary border border-secondary rounded-lg p-8 flex flex-col h-full shadow-sm">
              <Utensils className="text-secondary-foreground mb-6" size={28} strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-medium mb-2 text-secondary-foreground tracking-wide">Nutrition & Macros</h3>
              <p className="text-secondary-foreground/80 mb-8 text-sm">Calculate your burn and explore tailored meal plans.</p>
              <Link href="/calculator" className="mt-auto">
                <Button variant="outline" className="w-full border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary font-semibold uppercase tracking-[0.1em] py-6 rounded-md transition-all bg-transparent">
                  Explore Nutrition <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
