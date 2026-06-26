'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Plus, Loader2, AlertCircle, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext.jsx';
import CommunityPostForm from '@/components/community/CommunityPostForm.jsx';
import SuccessStoriesGallery from '@/components/community/SuccessStoriesGallery.jsx';
import { toast } from 'sonner';
import { getCommunityPosts, getLatestAffirmation } from '@/db';

const initialPosts = [
  {
    id: '1',
    authorName: 'Sarah M.',
    content: 'Just completed my first week of the Limitless Motion program! Feeling stronger already. This community is incredibly supportive!',
    type: 'success story',
    likes: 24,
    comments: [],
    created: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    authorName: 'James R.',
    content: 'New personal record on deadlifts today! 315lbs for 5 reps. Consistency is key!',
    type: 'workout win',
    likes: 18,
    comments: [],
    created: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    authorName: 'Emily T.',
    content: 'Day 30 of my transformation journey. Down 8lbs and feeling amazing. Trust the process!',
    type: 'progress update',
    likes: 31,
    comments: [],
    created: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: '4',
    authorName: 'Marcus W.',
    content: 'Remember: progress is progress no matter how small. Show up for yourself every single day.',
    type: 'motivation',
    likes: 42,
    comments: [],
    created: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const fallbackAffirmation = {
  id: '1',
  text: 'Your only limit is the one you set in your mind. Every rep, every set, every day brings you closer to the best version of yourself.',
};

const CommunityPage = () => {
  const { currentUser } = useAuth();
  const [affirmation, setAffirmation] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    document.title = 'Community Hub - Limitless Motion';
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fetchedPosts, fetchedAffirmation] = await Promise.all([
          getCommunityPosts(),
          getLatestAffirmation(),
        ]);
        if (cancelled) return;
        if (fetchedPosts && fetchedPosts.length > 0) {
          setPosts(fetchedPosts.map(p => ({
            ...p,
            authorName: p.author_name,
            created: p.date,
          })));
        } else {
          setPosts(initialPosts);
        }
        if (fetchedAffirmation) {
          setAffirmation(fetchedAffirmation);
        } else {
          setAffirmation(fallbackAffirmation);
        }
      } catch {
        if (!cancelled) {
          setPosts(initialPosts);
          setAffirmation(fallbackAffirmation);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLike = async (postId, currentLikes) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
  };

  const handlePostCreated = () => {
    setShowPostForm(false);
  };

  const renderPostCard = (post) => (
    <Card key={post.id} className="mb-6 border-border shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar>
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {post.authorName ? post.authorName.substring(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{post.authorName || 'Anonymous Member'}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(post.created).toLocaleDateString()}</span>
              <span>•</span>
              <span className="uppercase tracking-wider font-bold text-primary/80">{post.type}</span>
            </div>
          </div>
        </div>

        <p className="text-foreground/90 whitespace-pre-wrap mb-4">{post.content}</p>

        <div className="flex items-center gap-6 pt-4 border-t border-border/50">
          <button
            onClick={() => handleLike(post.id, post.likes)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart size={18} />
            <span className="text-sm font-medium">{post.likes || 0}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle size={18} />
            <span className="text-sm font-medium">{post.comments?.length || 0}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury max-w-6xl">

        {/* Daily Affirmation */}
        {affirmation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 text-center relative overflow-hidden max-w-4xl mx-auto"
          >
            <Sparkles className="absolute top-4 left-4 text-primary/40" size={32} />
            <Sparkles className="absolute bottom-4 right-4 text-primary/40" size={32} />
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Daily Affirmation</p>
            <h2 className="text-2xl md:text-4xl font-serif italic text-foreground leading-relaxed max-w-2xl mx-auto">
              &ldquo;{affirmation.text}&rdquo;
            </h2>
          </motion.div>
        )}

        {/* Success Stories Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
              <Trophy className="w-4 h-4 mr-2" /> Real Results
            </Badge>
            <h2 className="heading-section text-foreground mb-4">Member Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover how the Limitless Motion community is transforming lives through dedicated coaching, tailored nutrition, and consistent effort.
            </p>
          </div>

          <SuccessStoriesGallery />
        </section>

        {/* Community Feed Section */}
        <section className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Community Feed</h2>
              <p className="text-muted-foreground mt-1">Share your journey and support others.</p>
            </div>
            <Button onClick={() => setShowPostForm(!showPostForm)} className="gap-2 rounded-full shrink-0">
              {showPostForm ? 'Cancel' : <><Plus size={18} /> New Post</>}
            </Button>
          </div>

          {showPostForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
              <CommunityPostForm onSuccess={handlePostCreated} />
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-transparent border-b border-border rounded-none h-auto p-0 overflow-x-auto flex-nowrap">
                <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">All Posts</TabsTrigger>
                <TabsTrigger value="success story" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Success Stories</TabsTrigger>
                <TabsTrigger value="progress update" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Progress</TabsTrigger>
                <TabsTrigger value="motivation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Motivation</TabsTrigger>
                <TabsTrigger value="workout win" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Workout Wins</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {posts.length > 0 ? posts.map(renderPostCard) : <p className="text-center text-muted-foreground py-12">No posts yet. Be the first to share with the Limitless Motion community!</p>}
              </TabsContent>

              {['success story', 'progress update', 'motivation', 'workout win'].map(type => (
                <TabsContent key={type} value={type} className="mt-0">
                  {posts.filter(p => p.type === type).length > 0
                    ? posts.filter(p => p.type === type).map(renderPostCard)
                    : <p className="text-center text-muted-foreground py-12">No {type}s yet.</p>}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </section>

      </div>
    </div>
  );
};

export default CommunityPage;
