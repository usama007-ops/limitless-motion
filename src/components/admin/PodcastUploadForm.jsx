import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/upload';

const PodcastUploadForm = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioFile: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.audioFile) {
      toast.error('Title and Audio File are required');
      return;
    }

    setLoading(true);
    try {
      await uploadFile(formData.audioFile, 'podcasts', {
        title: formData.title,
        description: formData.description,
        fileField: 'audio_file_url',
      });
      toast.success('Podcast uploaded successfully!');
      setFormData({ title: '', description: '', audioFile: null });
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('Error uploading podcast:', error);
      toast.error('Failed to upload podcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm mb-12">
      <h3 className="text-xl font-serif font-medium mb-6 flex items-center gap-2">
        <Mic className="w-5 h-5 text-primary" /> Admin: Upload Podcast / Audio
      </h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Podcast Title</Label>
          <Input
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., Episode 5: Mindset Matters"
            required
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Description</Label>
          <Textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Optional description..."
            className="bg-background min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Audio File</Label>
          <Input
            type="file"
            accept="audio/*"
            onChange={e => setFormData({...formData, audioFile: e.target.files[0]})}
            className="bg-background pt-2"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="mt-6 btn-premium w-full md:w-auto">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Upload Audio'}
      </Button>
    </form>
  );
};

export default PodcastUploadForm;
