'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TodaysWorkout from '@/components/workouts/TodaysWorkout.jsx'
import WorkoutProgramSelector from '@/components/workouts/WorkoutProgramSelector.jsx'
import RecoveryFlowLibrary from '@/components/workouts/RecoveryFlowLibrary.jsx'

export default function LetsMovePage() {
  useEffect(() => {
    document.title = "Workouts - Limitless Motion"
  }, [])

  return (
    <main className="flex-grow pt-32 pb-24">
      <div className="container-luxury max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Activity size={16} />
            Movement & Performance
          </div>
          <h1 className="heading-display mb-4">LET'S MOVE</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl">
            Access your personalized workout programs, track your activity, and optimize your recovery.
          </p>
        </motion.div>

        <Tabs defaultValue="today" className="space-y-8">
          <TabsList className="bg-card border border-border p-1 rounded-xl">
            <TabsTrigger value="today" className="text-sm font-semibold tracking-wider uppercase px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Today</TabsTrigger>
            <TabsTrigger value="programs" className="text-sm font-semibold tracking-wider uppercase px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Programs</TabsTrigger>
            <TabsTrigger value="recovery" className="text-sm font-semibold tracking-wider uppercase px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0">
            <TodaysWorkout />
          </TabsContent>

          <TabsContent value="programs" className="mt-0">
            <WorkoutProgramSelector />
          </TabsContent>

          <TabsContent value="recovery" className="mt-0">
            <RecoveryFlowLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
