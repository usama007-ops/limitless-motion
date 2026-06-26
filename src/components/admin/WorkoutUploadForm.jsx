import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/upload';

const WorkoutUploadForm = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'intermediate',
    category: 'other',
    description: '',
    videoFile: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoFile) {
      toast.error('Title and Video File are required');
      return;
    }

    setLoading(true);
    try {
      await uploadFile(formData.videoFile, 'workout_videos', {
        title: formData.title,
        difficulty: formData.difficulty,
        category: formData.category,
        description: formData.description,
        fileField: 'video_file_url',
      });
      
      toast.success('Workout video uploaded successfully!');
      setFormData({ title: '', difficulty: 'intermediate', category: 'other', description: '', videoFile: null });
      if (onUploadSuccess) onUploadSuccess();
      
    } catch (error) {
      console.error('Error uploading workout:', error);
      toast.error('Failed to upload workout video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm mb-12">
      <h3 className="text-xl font-serif font-medium mb-6 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-primary" /> Admin: Upload Workout
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Workout Name</Label>
          <Input 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            placeholder="e.g., HIIT Full Body Burn"
            required
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Difficulty Level</Label>
          <Select 
            value={formData.difficulty} 
            onValueChange={val => setFormData({...formData, difficulty: val})}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Description</Label>
          <Textarea 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            placeholder="Describe the workout..."
            className="bg-background min-h-[100px]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Video File</Label>
          <Input 
            type="file" 
            accept="video/*"
            onChange={e => setFormData({...formData, videoFile: e.target.files[0]})} 
            className="bg-background pt-2"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="btn-premium w-full md:w-auto">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Upload Workout'}
      </Button>
    </form>
  );
};

export default WorkoutUploadForm;
