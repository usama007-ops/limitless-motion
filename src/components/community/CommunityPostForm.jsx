import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/upload';
import { createCommunityPost } from '@/db';

const CommunityPostForm = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'progress update',
    content: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error('Please enter some content for your post.');
      return;
    }

    setLoading(true);
    try {
      if (imageFile) {
        await uploadFile(imageFile, 'community_posts', {
          type: formData.type,
          content: formData.content,
          authorId: currentUser.id,
          authorName: currentUser.name || currentUser.email.split('@')[0],
          likes: 0,
          comments: JSON.stringify([]),
          fileField: 'image_url',
        });
      } else {
        await createCommunityPost({
          type: formData.type,
          content: formData.content,
          author_id: currentUser.id,
          author_name: currentUser.name || currentUser.email.split('@')[0],
          likes: 0,
          comments: [],
        });
      }
      toast.success('Post created successfully!');
      setFormData({ type: 'progress update', content: '' });
      setImageFile(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-sm bg-card">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Post Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(val) => setFormData({...formData, type: val})}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success story">Success Story</SelectItem>
                <SelectItem value="progress update">Progress Update</SelectItem>
                <SelectItem value="motivation">Motivation</SelectItem>
                <SelectItem value="workout win">Workout Win</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Share your journey..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="min-h-[120px] bg-background resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ImageIcon size={16} /> Attach Image (optional)
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="bg-background text-foreground file:text-foreground file:bg-muted file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md cursor-pointer"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Post to Community
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommunityPostForm;
