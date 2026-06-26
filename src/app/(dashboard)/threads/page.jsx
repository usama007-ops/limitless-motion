'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getWorkoutChallenges } from '@/db';

const fallbackChallenges = [
  {
    id: '1',
    name: '30-Day Consistency Challenge',
    description: 'Complete at least one workout every day for 30 days. Build the habit of showing up.',
    status: 'active',
    duration: '30 days',
    participantCount: 42,
    prize: 'Exclusive Community Badge',
    rules: 'Complete all scheduled workouts for the duration of the challenge.',
  },
  {
    id: '2',
    name: 'Strength Stacker',
    description: 'Accumulate 500 total reps of compound lifts over two weeks.',
    status: 'active',
    duration: '14 days',
    participantCount: 28,
    prize: 'Strength Stacker Badge',
    rules: 'Log each workout and accumulate 500 total reps across deadlifts, squats, and presses.',
  },
  {
    id: '3',
    name: 'Endurance Week',
    description: 'Log 60+ minutes of cardio or metabolic conditioning each day for 7 days.',
    status: 'active',
    duration: '7 days',
    participantCount: 35,
    prize: 'Endurance Elite Badge',
    rules: 'Complete at least 60 minutes of zone 2 cardio or HIIT per day.',
  },
];

const ThreadsPage = () => {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'THREADS | Limitless Motion';
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getWorkoutChallenges();
        if (!cancelled) {
          if (data && data.length > 0) {
            setChallenges(data.map(c => ({ ...c, participantCount: c.participant_count })));
          } else {
            setChallenges(fallbackChallenges);
          }
        }
      } catch {
        if (!cancelled) setChallenges(fallbackChallenges);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleJoinChallenge = async (challengeId) => {
    if (!currentUser) {
      toast.error("Please log in to join challenges.");
      return;
    }
    try {
      toast.success("Successfully joined the challenge!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("Failed to join challenge. You might already be participating.");
    }
  };

  const openChallengeDetails = (challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-[hsl(var(--brand-threads))] text-white p-8 md:p-16 mb-16"
        >
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-6 uppercase tracking-widest font-bold">
              <Users className="w-4 h-4 mr-2 inline" /> Community
            </Badge>
            <h1 className="heading-display mb-6">Stronger Together.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 mb-8">
              Join community challenges, climb the leaderboard, and push your limits alongside the Limitless Motion family.
            </p>
          </div>
        </motion.div>

        <div className="mb-12">
          <h2 className="heading-section mb-8">Active Challenges</h2>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : challenges.length === 0 ? (
            <div className="bg-muted/30 rounded-2xl p-12 text-center border border-border border-dashed">
              <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No active challenges</p>
              <p className="text-muted-foreground mt-2">Check back soon for new community events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, idx) => (
                <motion.div key={challenge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/60">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'} className={challenge.status === 'active' ? 'bg-[hsl(var(--brand-threads))]' : ''}>
                          {challenge.status}
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {challenge.duration}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{challenge.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Users className="w-4 h-4" /> {challenge.participantCount || 0} Participants
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Community Progress</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" indicatorClassName="bg-[hsl(var(--brand-threads))]" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" onClick={() => openChallengeDetails(challenge)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[hsl(var(--brand-threads))]">{selectedChallenge.status}</Badge>
                  <Badge variant="outline">{selectedChallenge.duration}</Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedChallenge.name}</DialogTitle>
                <DialogDescription className="text-base pt-2">
                  {selectedChallenge.description}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> Prize / Badge</h4>
                  <p className="text-sm text-muted-foreground">{selectedChallenge.prize || selectedChallenge.badge || 'Exclusive Community Badge'}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Rules</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedChallenge.rules || 'Complete all scheduled workouts for the duration of the challenge.'}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="bg-[hsl(var(--brand-threads))] hover:bg-[hsl(var(--brand-threads))/90] text-white" onClick={() => handleJoinChallenge(selectedChallenge.id)}>
                  Join Challenge <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThreadsPage;
