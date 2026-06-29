import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Calendar } from 'lucide-react';

const SuccessStory = ({ story, onClick }) => {
  return (
    <Card 
      className="group overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
      onClick={() => onClick(story)}
    >
      {/* Image Split */}
      <div className="relative h-56 w-full overflow-hidden bg-muted shrink-0">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full relative overflow-hidden">
            <img 
              src={story.beforePhoto} 
              alt={`${story.name} Before`} 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              Before
            </div>
          </div>
          <div className="w-1/2 h-full relative overflow-hidden border-l-2 border-background">
            <img 
              src={story.afterPhoto} 
              alt={`${story.name} After`} 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
              After
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">{story.name}, {story.age}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Target className="w-3.5 h-3.5" /> {story.goal}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
            {story.storyType}
          </Badge>
          <Badge variant="outline" className="text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {story.timelineWeeks} Weeks
          </Badge>
        </div>

        <div className="mb-6 flex-grow">
          <p className="text-sm text-foreground/80 italic line-clamp-3 border-l-2 border-primary/30 pl-3">
            "{story.testimonial}"
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground font-medium uppercase tracking-wider">Consistency</span>
              <span className="font-bold text-foreground">{story.workoutConsistency}%</span>
            </div>
            <Progress value={story.workoutConsistency} className="h-1.5 bg-muted" indicatorClassName="bg-primary" />
          </div>

          <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5 group-hover:text-primary text-foreground transition-colors">
            View Full Story
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessStory;