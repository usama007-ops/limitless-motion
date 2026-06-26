'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Plus, Mic, Headphones, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import PodcastInterviewUploadForm from '@/components/admin/PodcastInterviewUploadForm.jsx';
import PodcastForm from '@/components/admin/PodcastForm.jsx';
import AffirmationForm from '@/components/admin/AffirmationForm.jsx';
import { getVideos, getPodcasts, getAffirmations } from '@/db';
import { adminDelete } from '@/lib/adminDb';

const AdminResourcesPanel = () => {
  const [videos, setVideos] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [affirmations, setAffirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showPodcastForm, setShowPodcastForm] = useState(false);
  const [showAffirmationForm, setShowAffirmationForm] = useState(false);

  useEffect(() => {
    document.title = 'Admin Resources - Limitless Motion';
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [v, p, a] = await Promise.all([
        getVideos(),
        getPodcasts(),
        getAffirmations({ limit: 100 }),
      ]);
      setVideos(v ? v.map(item => ({
        ...item,
        guestName: item.guest_name,
        uploadDate: item.upload_date,
      })) : []);
      setPodcasts(p || []);
      setAffirmations(a || []);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (collection, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await adminDelete(collection, id);
      toast.success('Item deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <main className="flex-grow pt-32 pb-24">
      <div className="container-luxury">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Resource Management</h1>
          <p className="text-muted-foreground">Manage podcasts, interviews, external links, and daily affirmations.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={48} /></div>
        ) : (
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="mb-8 bg-muted/50 p-1 rounded-xl inline-flex">
              <TabsTrigger value="videos" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2">
                <Mic size={16} /> Podcasts & Interviews
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2">
                <Headphones size={16} /> External Podcasts
              </TabsTrigger>
              <TabsTrigger value="affirmations" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2">
                <Sparkles size={16} /> Affirmations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-6">
              <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold">Video Library</h2>
                  <p className="text-sm text-muted-foreground">Upload and manage internal podcast and interview videos.</p>
                </div>
                <Button onClick={() => setShowVideoForm(!showVideoForm)} variant={showVideoForm ? "outline" : "default"}>
                  {showVideoForm ? 'Cancel' : <><Plus size={16} className="mr-2"/> Add Episode</>}
                </Button>
              </div>

              {showVideoForm && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <PodcastInterviewUploadForm onSuccess={() => { setShowVideoForm(false); fetchData(); }} />
                </div>
              )}

              {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(v => (
                    <Card key={v.id} className="overflow-hidden flex flex-col">
                      <div className="aspect-video bg-muted relative flex items-center justify-center border-b border-border">
                        <Mic className="text-muted-foreground/30" size={48} />
                        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md">
                          {new Date(v.uploadDate || v.created).toLocaleDateString()}
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-grow">
                        <div className="mb-3">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-2">
                            Guest: {v.guestName}
                          </span>
                          <h3 className="font-bold text-lg leading-tight line-clamp-2">{v.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-grow">
                          {v.description || "No description provided."}
                        </p>
                        <Button variant="destructive" size="sm" className="w-full mt-auto" onClick={() => handleDelete('videos', v.id)}>
                          <Trash2 size={16} className="mr-2" /> Delete Episode
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <Mic className="mx-auto text-muted-foreground/50 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-foreground mb-1">No episodes uploaded</h3>
                  <p className="text-muted-foreground">Click "Add Episode" to upload your first podcast or interview.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="podcasts" className="space-y-6">
              <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold">External Podcasts</h2>
                  <p className="text-sm text-muted-foreground">Manage links to Spotify, Apple Podcasts, etc.</p>
                </div>
                <Button onClick={() => setShowPodcastForm(!showPodcastForm)} variant={showPodcastForm ? "outline" : "default"}>
                  {showPodcastForm ? 'Cancel' : <><Plus size={16} className="mr-2"/> Add Link</>}
                </Button>
              </div>

              {showPodcastForm && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <PodcastForm onSuccess={() => { setShowPodcastForm(false); fetchData(); }} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {podcasts.map(p => (
                  <Card key={p.id}>
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-foreground bg-secondary px-2 py-1 rounded">
                          {p.platform}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 flex-grow">{p.description}</p>
                      <Button variant="destructive" size="sm" className="w-full mt-auto" onClick={() => handleDelete('podcasts', p.id)}>
                        <Trash2 size={16} className="mr-2" /> Delete Link
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="affirmations" className="space-y-6">
              <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold">Daily Affirmations</h2>
                  <p className="text-sm text-muted-foreground">Manage motivational quotes for the community.</p>
                </div>
                <Button onClick={() => setShowAffirmationForm(!showAffirmationForm)} variant={showAffirmationForm ? "outline" : "default"}>
                  {showAffirmationForm ? 'Cancel' : <><Plus size={16} className="mr-2"/> Add Affirmation</>}
                </Button>
              </div>

              {showAffirmationForm && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <AffirmationForm onSuccess={() => { setShowAffirmationForm(false); fetchData(); }} />
                </div>
              )}

              <div className="space-y-4">
                {affirmations.map(a => (
                  <Card key={a.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-5 flex justify-between items-center gap-4">
                      <div>
                        <p className="font-serif text-lg italic mb-2 text-foreground">"{a.text}"</p>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Scheduled: {new Date(a.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0" onClick={() => handleDelete('affirmations', a.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
};

export default AdminResourcesPanel;
