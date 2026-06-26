'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const sampleMoveWeek = [
  {
    day: 1,
    name: "Functional Foundations",
    duration: "45 min",
    exercises: [
      { name: "Turkish Get-Ups", sets: 3, reps: "5/side", focus: "Full Body", tips: "Keep eyes on the bell, move deliberately." },
      { name: "Kettlebell Deadlifts", sets: 4, reps: "10", focus: "Posterior Chain", tips: "Hinge at hips, maintain neutral spine." },
      { name: "Farmer Carries", sets: 4, reps: "40m", focus: "Core/Grip", tips: "Tall posture, braced core." },
      { name: "Bear Crawls", sets: 3, reps: "20m", focus: "Shoulders/Core", tips: "Keep hips low and level." },
      { name: "90/90 Hip Switches", sets: 2, reps: "10/side", focus: "Mobility", tips: "Move slowly, explore end ranges." }
    ]
  },
  {
    day: 2,
    name: "Mobility Flow",
    duration: "35 min",
    exercises: [
      { name: "World's Greatest Stretch", sets: 2, reps: "5/side", focus: "Hips/T-Spine", tips: "Breathe into the rotation." },
      { name: "Cossack Squats", sets: 3, reps: "8/side", focus: "Hips/Legs", tips: "Keep heel down on straight leg." },
      { name: "Downward Dog to Cobra", sets: 3, reps: "10", focus: "Full Body", tips: "Flow smoothly with breath." },
      { name: "Thread the Needle", sets: 2, reps: "8/side", focus: "T-Spine", tips: "Reach far, open chest." }
    ]
  },
  {
    day: 3,
    name: "Strength & Stability",
    duration: "50 min",
    exercises: [
      { name: "Single Leg RDLs", sets: 4, reps: "8/side", focus: "Hamstrings/Balance", tips: "Hinge slowly, keep hips square." },
      { name: "Overhead Press", sets: 4, reps: "10", focus: "Shoulders", tips: "Ribs down, squeeze glutes." },
      { name: "Pallof Presses", sets: 3, reps: "12/side", focus: "Core Anti-rotation", tips: "Resist the pull, exhale on press." },
      { name: "Sled Pushes", sets: 4, reps: "30m", focus: "Legs/Conditioning", tips: "Consistent drive, low angle." }
    ]
  },
  {
    day: 4,
    name: "Active Recovery",
    duration: "30 min",
    exercises: [
      { name: "Cat-Cow", sets: 2, reps: "15", focus: "Spine", tips: "Segmental movement." },
      { name: "Pigeon Pose", sets: 2, reps: "60 sec/side", focus: "Hips", tips: "Relax into the stretch." },
      { name: "Box Breathing", sets: 1, reps: "5 min", focus: "Nervous System", tips: "4s inhale, 4s hold, 4s exhale, 4s hold." }
    ]
  }
];

const MovePage = () => {
  const [difficulty, setDifficulty] = useState('Intermediate');

  useEffect(() => {
    document.title = 'MOVE | Limitless Motion';
  }, []);

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
                  variant={difficulty === level ? "secondary" : "outline"}
                  className={difficulty === level ? "bg-white text-[hsl(var(--brand-move))] hover:bg-white/90 font-bold" : "border-white/50 text-white hover:bg-white/10 font-bold"}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-12">
          <h2 className="heading-section mb-8">This Week's Protocol</h2>
          <div className="space-y-6">
            {sampleMoveWeek.map((day, idx) => (
              <motion.div key={day.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-muted/30">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Day {day.day}</span>
                        <Badge variant="outline" className="border-[hsl(var(--brand-move))/30] text-[hsl(var(--brand-move))] bg-[hsl(var(--brand-move))/5]">
                          {day.exercises.length} Movements
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold">{day.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border">
                        <Clock className="w-4 h-4 text-muted-foreground" /> {day.duration}
                      </span>
                      <Button className="bg-[hsl(var(--brand-move))] hover:bg-[hsl(var(--brand-move))/90] text-white font-bold">
                        Start Flow
                      </Button>
                    </div>
                  </div>

                  <div className="p-2">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="exercises" className="border-none">
                        <AccordionTrigger className="px-4 md:px-6 hover:no-underline hover:bg-muted/50 rounded-xl transition-colors">
                          <span className="font-semibold">View Movements</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 md:px-6 pb-6 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {day.exercises.map((ex, i) => (
                              <div key={i} className="bg-background border border-border rounded-xl p-4 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-bold text-lg">{ex.name}</h4>
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
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovePage;
