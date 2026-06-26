'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Target, Flame, Award, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext.jsx';

const TrackPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    document.title = 'TRACK | Limitless Motion';
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setActivityData([
        { name: 'Mon', workouts: 1 },
        { name: 'Tue', workouts: 2 },
        { name: 'Wed', workouts: 0 },
        { name: 'Thu', workouts: 1 },
        { name: 'Fri', workouts: 1 },
        { name: 'Sat', workouts: 2 },
        { name: 'Sun', workouts: 1 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

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

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Workouts</span>
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">42</div>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3" /> +12% this month</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Streak</span>
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">8 <span className="text-xl text-muted-foreground font-medium">days</span></div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">Personal best: 14 days</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Calories Burned</span>
                    <Target className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">12.4k</div>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3" /> +5% this month</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Consistency</span>
                    <Award className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-4xl font-black tracking-tight">85%</div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">Based on scheduled days</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts & Records */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Workouts completed over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Personal Records</CardTitle>
                  <CardDescription>Your all-time bests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>Heaviest Deadlift</span>
                      <span className="text-primary">225 lbs</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Achieved on Oct 12, 2025</p>
                  </div>
                  <div className="w-full h-px bg-border"></div>
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>Longest Plank</span>
                      <span className="text-primary">3:15</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Achieved on Nov 05, 2025</p>
                  </div>
                  <div className="w-full h-px bg-border"></div>
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>Most Burpees (1 min)</span>
                      <span className="text-primary">28</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Achieved on Dec 01, 2025</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
