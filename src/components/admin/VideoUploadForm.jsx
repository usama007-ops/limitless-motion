import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/upload';

const VideoUploadForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: '',
    category: '',
  });
  const [videoFile, setVideoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.duration || !formData.difficulty || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    try {
      setLoading(true);
      await uploadFile(videoFile, 'workout_videos', {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        difficulty: formData.difficulty,
        category: formData.category,
        fileField: 'video_file_url',
      });
      toast.success('Video uploaded successfully');
      setFormData({ title: '', description: '', duration: '', difficulty: '', category: '' });
      setVideoFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
      <h3 className="text-xl font-bold">Upload Workout Video</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., 30-Min Full Body Workout" required className="text-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Workout details..." className="text-foreground" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input id="duration" name="duration" type="number" min="1" value={formData.duration} onChange={handleChange} required className="text-foreground" />
          </div>

          <div className="space-y-2">
            <Label>Difficulty *</Label>
            <Select value={formData.difficulty} onValueChange={(val) => handleSelectChange('difficulty', val)}>
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
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

        <div className="space-y-2">
          <Label htmlFor="videoFile">Video File</Label>
          <Input id="videoFile" type="file" accept="video/*" onChange={handleFileChange} className="text-foreground" />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : 'Upload Video'}
      </Button>
    </form>
  );
};

export default VideoUploadForm;
