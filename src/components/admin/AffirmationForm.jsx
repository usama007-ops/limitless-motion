import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminCreate } from '@/lib/adminDb';

const AffirmationForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminCreate('affirmations', {
        text: formData.text,
        date: new Date(formData.date).toISOString(),
      });
      toast.success('Affirmation added successfully');
      setFormData({ text: '', date: new Date().toISOString().split('T')[0] });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add affirmation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Daily Affirmation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Affirmation Text</Label>
            <Textarea required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="I am capable of achieving my goals..." />
          </div>
          <div className="space-y-2">
            <Label>Date to Display</Label>
            <Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Add Affirmation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AffirmationForm;
