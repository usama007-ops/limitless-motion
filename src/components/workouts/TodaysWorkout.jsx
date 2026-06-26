'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Target, ArrowRight, Loader2, Dumbbell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

const TodaysWorkout = ({ currentProgram }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!currentProgram) {
    return (
      <Card className="bg-card border border-border hover:border-primary/50 transition-all group">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{todayName}</span>
          </div>
          <h3 className="text-2xl font-serif font-medium mb-2">No Active Program</h3>
          <p className="text-muted-foreground mb-6">Select a workout program to see today's training.</p>
          <Button onClick={() => router.push('/move')} variant="outline" className="group">
            Browse Programs <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border hover:border-primary/50 transition-all group">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today's Training</span>
            <h3 className="text-lg font-semibold">{todayName}</h3>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border/50">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{currentProgram.name}</p>
              <p className="text-xs text-muted-foreground">{currentProgram.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Follow your scheduled program</span>
          </div>
        </div>

        <Button 
          onClick={() => router.push('/track')} 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Start Workout <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TodaysWorkout;
