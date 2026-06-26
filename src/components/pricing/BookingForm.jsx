import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Calendar, User, Mail, MessageSquare } from 'lucide-react';
import { adminCreate } from '@/lib/adminDb';

const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sessionLength: '30-min',
    availability: '',
    goals: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminCreate('coaching_bookings', {
        ...formData,
        session_length: formData.sessionLength,
        status: 'pending'
      });

      toast.success('Booking request submitted successfully! We will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        sessionLength: '30-min',
        availability: '',
        goals: ''
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="booking-form" className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-soft max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground mb-4">Request a Session</h2>
        <p className="text-muted-foreground">
          Fill out the form below to request a coaching session or your complimentary strategy call. Our team will reach out to confirm the exact time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Maya Chen"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="maya@example.com"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-foreground/80">Session Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className={`cursor-pointer p-4 rounded-xl border transition-all text-center ${formData.sessionLength === '15-min' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-foreground hover:border-primary/50'}`}>
              <input type="radio" name="sessionLength" value="15-min" checked={formData.sessionLength === '15-min'} onChange={handleChange} className="sr-only" />
              <span className="font-semibold block">15-Min Call</span>
              <span className="text-xs opacity-80">Free Strategy</span>
            </label>
            <label className={`cursor-pointer p-4 rounded-xl border transition-all text-center ${formData.sessionLength === '30-min' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-foreground hover:border-primary/50'}`}>
              <input type="radio" name="sessionLength" value="30-min" checked={formData.sessionLength === '30-min'} onChange={handleChange} className="sr-only" />
              <span className="font-semibold block">30-Min Session</span>
              <span className="text-xs opacity-80">$80</span>
            </label>
            <label className={`cursor-pointer p-4 rounded-xl border transition-all text-center ${formData.sessionLength === '60-min' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-foreground hover:border-primary/50'}`}>
              <input type="radio" name="sessionLength" value="60-min" checked={formData.sessionLength === '60-min'} onChange={handleChange} className="sr-only" />
              <span className="font-semibold block">60-Min Session</span>
              <span className="text-xs opacity-80">$150</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-2">
            <Calendar size={16} /> General Availability
          </label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="e.g., Weekdays after 5 PM EST, or Saturday mornings"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-2">
            <MessageSquare size={16} /> Primary Goals / Focus
          </label>
          <textarea
            name="goals"
            rows="4"
            value={formData.goals}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            placeholder="Briefly describe what you'd like to achieve or discuss during our session..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary-modern flex justify-center items-center gap-2 py-4 text-lg"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
