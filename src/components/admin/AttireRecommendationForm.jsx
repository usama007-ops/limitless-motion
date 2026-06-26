import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/upload';
import { adminCreate } from '@/lib/adminDb';

const AttireRecommendationForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    productLink: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      if (imageFile) {
        await uploadFile(imageFile, 'attire_recommendations', {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          productLink: formData.productLink,
          fileField: 'image_url',
        });
      } else {
        await adminCreate('attire_recommendations', {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          productLink: formData.productLink,
        });
      }

      toast.success('Recommendation added successfully');
      setFormData({ name: '', description: '', category: '', productLink: '' });
      setImageFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to add recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
      <h3 className="text-xl font-bold">Add Attire Recommendation</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Performance Running Shoes" required className="text-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Product details..." className="text-foreground" />
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workout gear">Workout Gear</SelectItem>
              <SelectItem value="casual wear">Casual Wear</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productLink">Product Link (URL)</Label>
          <Input id="productLink" name="productLink" type="url" value={formData.productLink} onChange={handleChange} placeholder="https://..." className="text-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="text-foreground" />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Add Recommendation'}
      </Button>
    </form>
  );
};

export default AttireRecommendationForm;
