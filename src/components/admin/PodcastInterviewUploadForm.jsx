import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/upload';

const PodcastInterviewUploadForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    guestName: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (videoFile.size > 500 * 1024 * 1024) {
      toast.error('File size exceeds 500MB limit');
      return;
    }

    setLoading(true);
    try {
      await uploadFile(videoFile, 'videos', {
        title: formData.title,
        guestName: formData.guestName,
        description: formData.description,
        viewCount: 0,
        fileField: 'video_file_url',
      });
      toast.success('Podcast/Interview uploaded successfully');
      setFormData({ title: '', guestName: '', description: '' });
      setVideoFile(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="border-b border-border/50 pb-4 mb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Mic className="text-primary" size={20} />
          Upload Podcast or Interview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="title">Episode Title <span className="text-destructive">*</span></Label>
              <Input 
                id="title"
                required 
                placeholder="e.g. The Future of Fitness"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestName">Guest / Professional Name <span className="text-destructive">*</span></Label>
              <Input 
                id="guestName"
                required 
                placeholder="e.g. Dr. Sarah Johnson"
                value={formData.guestName} 
                onChange={e => setFormData({...formData, guestName: e.target.value})} 
                className="bg-background"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description & Show Notes</Label>
            <Textarea 
              id="description"
              placeholder="Brief overview of the topics discussed..."
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="min-h-[100px] bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoFile">Video File (Max 500MB) <span className="text-destructive">*</span></Label>
            <Input 
              id="videoFile"
              type="file" 
              accept="video/*" 
              required 
              onChange={e => setVideoFile(e.target.files[0])} 
              className="bg-background cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full md:w-auto px-8">
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              Upload Episode
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PodcastInterviewUploadForm;
