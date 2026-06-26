import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Quote, Calendar, Target, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

const SuccessStoryModal = ({ story, isOpen, onClose }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  if (!story) return null;

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border rounded-2xl max-h-[90vh] flex flex-col">
        <div className="overflow-y-auto flex-grow">
          
          {/* Header / Hero Section */}
          <div className="relative bg-muted/30 p-6 md:p-10 border-b border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    {story.storyType}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {story.timelineWeeks} Weeks
                  </Badge>
                </div>
                <DialogTitle className="text-3xl md:text-4xl font-bold text-foreground">
                  {story.name}'s Journey
                </DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground mt-2">
                  {story.goal}
                </DialogDescription>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Consistency</p>
                <div className="flex items-center gap-3">
                  <Progress value={story.workoutConsistency} className="w-24 h-2 bg-muted" indicatorClassName="bg-primary" />
                  <span className="font-bold text-foreground">{story.workoutConsistency}%</span>
                </div>
              </div>
            </div>

            {/* Comparison Slider */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-muted shadow-inner select-none group">
              <img 
                src={story.afterPhoto} 
                alt={`${story.name} After`} 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div 
                className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.3)]"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={story.beforePhoto} 
                  alt={`${story.name} Before`} 
                  className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                  style={{ width: `${100 / (sliderPosition / 100)}%` }}
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase">
                  Before
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase shadow-md">
                After
              </div>
              
              {/* Slider Input */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition} 
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                aria-label="Image comparison slider"
              />
              
              {/* Slider Handle Visual */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none flex items-center justify-center z-0 transition-transform duration-75"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
              >
                <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-primary">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Testimonial & Metrics */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Testimonial */}
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/10 rotate-180" />
                <p className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed relative z-10 pl-4 border-l-4 border-primary/30">
                  "{story.testimonial}"
                </p>
              </div>

              {/* Metrics */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Key Transformations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {story.metrics.map((metric, idx) => {
                    const isImprovement = metric.after > metric.before;
                    const diff = Math.abs(metric.after - metric.before);
                    const percentChange = Math.round((diff / metric.before) * 100);
                    
                    return (
                      <div key={idx} className="bg-muted/30 p-4 rounded-xl border border-border">
                        <p className="text-sm text-muted-foreground font-medium mb-2">{metric.label}</p>
                        <div className="flex items-end gap-2 mb-1">
                          <span className="text-2xl font-bold text-foreground">{metric.after}</span>
                          <span className="text-sm text-muted-foreground mb-1">{metric.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="line-through text-muted-foreground/60">{metric.before} {metric.unit}</span>
                          <span className="text-primary font-medium">
                            {isImprovement ? '+' : '-'}{percentChange}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Timeline */}
            <div className="bg-muted/20 p-6 rounded-2xl border border-border h-fit">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Journey Milestones
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
                {story.milestones.map((milestone, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-border bg-background shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Week {milestone.week}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessStoryModal;