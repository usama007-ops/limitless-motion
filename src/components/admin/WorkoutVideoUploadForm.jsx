import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/upload';

const WorkoutVideoUploadForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: 'beginner',
    category: 'strength'
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
      await uploadFile(videoFile, 'workout_videos', {
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration, 10),
        difficulty: formData.difficulty,
        category: formData.category,
        fileField: 'video_file_url',
      });
      toast.success('Workout video uploaded successfully');
      setFormData({ title: '', description: '', duration: '', difficulty: 'beginner', category: 'strength' });
      setVideoFile(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload workout video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="border-b border-border/50 pb-4 mb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Play className="text-primary" size={20} />
          Upload Workout Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Title <span className="text-destructive">*</span></Label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label>Duration (mins) <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={v => setFormData({...formData, difficulty: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="pilates">Pilates</SelectItem>
                  <SelectItem value="dance">Dance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Video File (Max 500MB) <span className="text-destructive">*</span></Label>
            <Input type="file" accept="video/*" required onChange={e => setVideoFile(e.target.files[0])} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Upload Workout
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkoutVideoUploadForm;
