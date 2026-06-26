import React from 'react';
import { PlayCircle, Clock, Activity, Flame, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const WorkoutCard = ({ 
  title, 
  duration, 
  difficulty, 
  category, 
  metrics = {}, 
  instructor, 
  isCompleted, 
  onClick 
}) => {
  return (
    <Card 
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-border/50 ${isCompleted ? 'bg-muted/30' : 'bg-card'}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="capitalize font-semibold bg-secondary/50 text-secondary-foreground">
              {difficulty}
            </Badge>
            {category && (
              <Badge variant="outline" className="capitalize font-medium border-border/80">
                {category}
              </Badge>
            )}
          </div>
          {isCompleted && (
            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none">
              Completed
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {instructor && (
          <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Coach: {instructor}
          </p>
        )}

        <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background rounded-lg p-2 border border-border/50">
            <Clock className="w-4 h-4 text-primary" />
            {duration} min
          </div>
          {metrics.calories && (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background rounded-lg p-2 border border-border/50">
              <Flame className="w-4 h-4 text-orange-500" />
              {metrics.calories} kcal
            </div>
          )}
          {metrics.intensity && (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background rounded-lg p-2 border border-border/50">
              <Activity className="w-4 h-4 text-blue-500" />
              {metrics.intensity}
            </div>
          )}
        </div>

        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button size="icon" className="rounded-full shadow-md h-12 w-12">
            <PlayCircle className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;