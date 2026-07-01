'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Plus, Loader2, AlertCircle, Trophy, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext.jsx';
import CommunityPostForm from '@/components/community/CommunityPostForm.jsx';
import CommentSection from '@/components/community/CommentSection.jsx';
import SuccessStoriesGallery from '@/components/community/SuccessStoriesGallery.jsx';
import ShareSuccessStory from '@/components/community/ShareSuccessStory.jsx';
import { toast } from 'sonner';
import { getCommunityPosts, getLatestAffirmation, getSuccessStories } from '@/db';



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
  const [showSuccessStoryForm, setShowSuccessStoryForm] = useState(false);

  useEffect(() => {
    document.title = 'Community Hub - Limitless Motion';
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fetchedPosts, fetchedAffirmation, fetchedStories] = await Promise.all([
          getCommunityPosts(),
          getLatestAffirmation(),
          getSuccessStories(),
        ]);
        if (cancelled) return;

        const postsList = fetchedPosts && fetchedPosts.length > 0
          ? fetchedPosts.map(p => ({ ...p, authorName: p.author_name, created: p.date }))
          : [];

        if (fetchedStories && fetchedStories.length > 0) {
          const storyPosts = fetchedStories.map(s => ({
            id: s.id,
            authorName: s.name || 'Anonymous',
            content: s.testimonial || s.results_summary || '',
            type: 'success story',
            likes: 0,
            comments: [],
            created: s.created_at || s.date || new Date().toISOString(),
            _isStory: true,
          }));
          const existingIds = new Set(postsList.map(p => p.id));
          storyPosts.forEach(sp => { if (!existingIds.has(sp.id)) postsList.push(sp); });
        }

        setPosts(postsList);

        if (fetchedAffirmation) {
          setAffirmation(fetchedAffirmation);
        } else {
          setAffirmation(fallbackAffirmation);
        }
      } catch {
        if (!cancelled) {
          setPosts([]);
          setAffirmation(fallbackAffirmation);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [expandedComments, setExpandedComments] = useState({});

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleLike = async (postId) => {
    if (!currentUser) return toast.error('Please sign in to like');
    try {
      const { likePost } = await import('@/db');
      await likePost(postId, currentUser.id);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1, liked_by: [...(p.liked_by || []), currentUser.id] } : p));
    } catch (e) {
      if (e?.message === 'Already liked') {
        toast.error('You have already liked this post');
      } else {
        console.error('Failed to like post:', e);
      }
    }
  };

  const handlePostCreated = async () => {
    setShowPostForm(false);
    await handleRefreshPosts();
  };

  const handleRefreshPosts = async (postId) => {
    try {
      const [fetchedPosts, fetchedStories] = await Promise.all([
        getCommunityPosts(),
        getSuccessStories(),
      ]);
      const mapped = (fetchedPosts || []).map(p => ({
        ...p,
        authorName: p.author_name,
        created: p.date,
      }));
      if (fetchedStories && fetchedStories.length > 0) {
        const storyPosts = fetchedStories.map(s => ({
          id: s.id,
          authorName: s.name || 'Anonymous',
          content: s.testimonial || s.results_summary || '',
          type: 'success story',
          likes: 0,
          comments: [],
          created: s.created_at || s.date || new Date().toISOString(),
          _isStory: true,
        }));
        const existingIds = new Set(mapped.map(p => p.id));
        storyPosts.forEach(sp => { if (!existingIds.has(sp.id)) mapped.push(sp); });
      }
      setPosts(mapped);
      return mapped.find(p => p.id === postId);
    } catch { return null; }
  };

  const renderPostCard = (post) => (
    <Card key={post.id} className="border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
              {post.authorName ? post.authorName.substring(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{post.authorName || 'Anonymous Member'}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{new Date(post.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="uppercase tracking-wider font-bold text-primary/80">{post.type}</span>
            </div>
          </div>
        </div>

        <p className="text-foreground/90 whitespace-pre-wrap mb-5 leading-relaxed">{post.content}</p>

        <div className="flex items-center gap-6 pt-4 border-t border-border/40">
          {!post._isStory && (
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 transition-colors ${post.liked_by?.includes(currentUser?.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
            >
              <Heart size={18} className={`transition-colors ${post.liked_by?.includes(currentUser?.id) ? 'fill-red-500' : 'group-hover:fill-red-500/20'}`} />
              <span className="text-sm font-medium">{post.likes || 0}</span>
            </button>
          )}
          {!post._isStory && (
            <button
              onClick={() => toggleComments(post.id)}
              className={`flex items-center gap-2 transition-colors ${expandedComments[post.id] ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">{post.comments?.length || 0}</span>
            </button>
          )}
        </div>

        {!post._isStory && (
          <CommentSection
            postId={post.id}
            comments={post.comments || []}
            expanded={expandedComments[post.id]}
            onToggle={() => toggleComments(post.id)}
            onRefresh={() => handleRefreshPosts(post.id)}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-16 shadow-lg mb-16"
        >
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-6 uppercase tracking-widest font-bold backdrop-blur-sm px-3 py-1.5">
              <Users className="w-4 h-4 mr-2 inline" /> Community Hub
            </Badge>
            <h1 className="heading-display mb-6">Together, We Rise.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 leading-relaxed">
              Connect with fellow members, share your journey, and celebrate every victory. Your story inspires someone else&apos;s comeback.
            </p>
          </div>
        </motion.div>

        {/* Daily Affirmation */}
        {affirmation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/15 text-center relative overflow-hidden max-w-4xl mx-auto"
          >
            <Sparkles className="absolute top-4 left-4 text-primary/30" size={24} />
            <Sparkles className="absolute bottom-4 right-4 text-primary/30" size={24} />
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Daily Affirmation</p>
            <h2 className="text-xl md:text-3xl font-serif italic text-foreground leading-relaxed max-w-3xl mx-auto">
              &ldquo;{affirmation.text}&rdquo;
            </h2>
          </motion.div>
        )}

        {/* Success Stories Section */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 mr-2" /> Real Results
            </Badge>
            <h2 className="heading-section text-foreground mb-3">Member Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover how the Limitless Motion community is transforming lives through dedicated coaching, tailored nutrition, and consistent effort.
            </p>
            <Button
              onClick={() => setShowSuccessStoryForm(true)}
              variant="outline"
              className="mt-6 gap-2 rounded-full"
            >
              <Trophy size={16} /> Share Your Success Story
            </Button>
          </div>

          <SuccessStoriesGallery />

          <ShareSuccessStory
            open={showSuccessStoryForm}
            onClose={() => setShowSuccessStoryForm(false)}
          />
        </section>

        {/* Community Feed Section */}
        <section className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Community Feed</h2>
              <p className="text-muted-foreground mt-1">Share your journey and support others.</p>
            </div>
            <Button onClick={() => setShowPostForm(!showPostForm)} className="gap-2 shrink-0">
              {showPostForm ? 'Cancel' : <><Plus size={18} /> New Post</>}
            </Button>
          </div>

          {showPostForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
              <CommunityPostForm onSuccess={handlePostCreated} />
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-2 border border-destructive/20"><AlertCircle size={18} /> {error}</div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-transparent border-b border-border rounded-none h-auto p-0 overflow-x-auto flex-nowrap gap-1">
                <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium">All Posts</TabsTrigger>
                <TabsTrigger value="success story" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium">Success Stories</TabsTrigger>
                <TabsTrigger value="progress update" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium">Progress</TabsTrigger>
                <TabsTrigger value="motivation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium">Motivation</TabsTrigger>
                <TabsTrigger value="workout win" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium">Workout Wins</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0 space-y-5">
                {posts.length > 0 ? posts.map(renderPostCard) : (
                  <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
                    <p className="text-muted-foreground text-lg">No posts yet. Be the first to share!</p>
                  </div>
                )}
              </TabsContent>

              {['success story', 'progress update', 'motivation', 'workout win'].map(type => (
                <TabsContent key={type} value={type} className="mt-0 space-y-5">
                  {posts.filter(p => p.type === type).length > 0
                    ? posts.filter(p => p.type === type).map(renderPostCard)
                    : (
                      <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground text-lg">No {type}s yet.</p>
                      </div>
                    )}
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
