'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, Trophy } from 'lucide-react'
import { toast } from 'sonner'

const storyTypes = ['Weight Loss', 'Strength', 'Health', 'Confidence', 'Athletic Performance', 'Postpartum Recovery']
const timelineCategories = ['8-12 weeks', '12-16 weeks', '16+ weeks']

export default function ShareSuccessStory({ open, onClose }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    goal: '',
    results_summary: '',
    timeline_weeks: '',
    testimonial: '',
    workout_consistency: '',
    story_type: '',
    timeline_category: '',
    before_photo_url: '',
    after_photo_url: '',
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.goal || !form.testimonial || !form.timeline_weeks || !form.workout_consistency) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/success-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: Number(form.age) || 1,
          timeline_weeks: Number(form.timeline_weeks),
          workout_consistency: Number(form.workout_consistency),
          story_type: form.story_type || 'Weight Loss',
          timeline_category: form.timeline_category || '12-16 weeks',
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      toast.success('Your success story has been submitted for review!')
      setForm({
        name: '', age: '', gender: '', goal: '', results_summary: '',
        timeline_weeks: '', testimonial: '', workout_consistency: '',
        story_type: '', timeline_category: '', before_photo_url: '', after_photo_url: '',
      })
      onClose()
    } catch (err) {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="text-primary" /> Share Your Success Story
          </DialogTitle>
          <DialogDescription>
            Inspire the community by sharing your transformation journey.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" min="1" value={form.age} onChange={e => set('age', e.target.value)} placeholder="Your age" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={form.gender} onValueChange={v => set('gender', v)}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story_type">Story Type</Label>
              <Select value={form.story_type} onValueChange={v => set('story_type', v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {storyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal *</Label>
            <Input id="goal" value={form.goal} onChange={e => set('goal', e.target.value)} placeholder="What was your main goal?" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results_summary">Results Summary</Label>
            <Textarea id="results_summary" value={form.results_summary} onChange={e => set('results_summary', e.target.value)} placeholder="Brief summary of your results..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial">Testimonial *</Label>
            <Textarea id="testimonial" value={form.testimonial} onChange={e => set('testimonial', e.target.value)} placeholder="Share your journey in detail..." className="min-h-[100px]" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeline_weeks">Timeline (weeks) *</Label>
              <Input id="timeline_weeks" type="number" min="1" value={form.timeline_weeks} onChange={e => set('timeline_weeks', e.target.value)} placeholder="e.g., 12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline_category">Timeline Category</Label>
              <Select value={form.timeline_category} onValueChange={v => set('timeline_category', v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {timelineCategories.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout_consistency">Consistency (0-100%) *</Label>
              <Input id="workout_consistency" type="number" min="0" max="100" value={form.workout_consistency} onChange={e => set('workout_consistency', e.target.value)} placeholder="e.g., 85" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="before_photo_url">Before Photo URL</Label>
              <Input id="before_photo_url" value={form.before_photo_url} onChange={e => set('before_photo_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="after_photo_url">After Photo URL</Label>
              <Input id="after_photo_url" value={form.after_photo_url} onChange={e => set('after_photo_url', e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Submit Story
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
