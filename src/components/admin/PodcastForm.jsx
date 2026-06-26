import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminCreate } from '@/lib/adminDb';

const PodcastForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: 'Spotify',
    podcastLink: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminCreate('podcasts', formData);
      toast.success('Podcast added successfully');
      setFormData({ name: '', description: '', platform: 'Spotify', podcastLink: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add podcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Podcast Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Podcast Name</Label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={formData.platform} onValueChange={v => setFormData({...formData, platform: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Spotify">Spotify</SelectItem>
                <SelectItem value="Apple Podcasts">Apple Podcasts</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input type="url" required value={formData.podcastLink} onChange={e => setFormData({...formData, podcastLink: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Add Podcast
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PodcastForm;
