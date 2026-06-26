import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import SuccessStory from './SuccessStory.jsx';
import SuccessStoryModal from './SuccessStoryModal.jsx';
import { successStoriesData } from '@/data/successStoriesData.js';

const SuccessStoriesGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTimeline, setFilterTimeline] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);

  const storyTypes = ['Weight Loss', 'Strength', 'Health', 'Confidence', 'Athletic Performance', 'Postpartum Recovery'];
  const timelines = ['8-12 weeks', '12-16 weeks', '16+ weeks'];

  const filteredStories = useMemo(() => {
    return successStoriesData.filter(story => {
      const matchesSearch = story.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            story.goal.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || story.storyType === filterType;
      const matchesTimeline = filterTimeline === 'all' || story.timelineCategory === filterTimeline;
      
      return matchesSearch && matchesType && matchesTimeline;
    });
  }, [searchQuery, filterType, filterTimeline]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterTimeline('all');
  };

  const hasActiveFilters = searchQuery !== '' || filterType !== 'all' || filterTimeline !== 'all';

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search stories by name or goal..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4 mr-2" /> Clear Filters
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground w-24 shrink-0">
              <Filter className="w-4 h-4 text-primary" /> Goal:
            </div>
            <ToggleGroup 
              type="single" 
              value={filterType} 
              onValueChange={(v) => v && setFilterType(v)}
              className="justify-start bg-muted/50 p-1 rounded-xl border border-border flex-wrap"
            >
              <ToggleGroupItem value="all" className="rounded-lg px-3 text-xs">All Goals</ToggleGroupItem>
              {storyTypes.map(type => (
                <ToggleGroupItem key={type} value={type} className="rounded-lg px-3 text-xs">{type}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground w-24 shrink-0">
              <Filter className="w-4 h-4 text-primary" /> Timeline:
            </div>
            <ToggleGroup 
              type="single" 
              value={filterTimeline} 
              onValueChange={(v) => v && setFilterTimeline(v)}
              className="justify-start bg-muted/50 p-1 rounded-xl border border-border flex-wrap"
            >
              <ToggleGroupItem value="all" className="rounded-lg px-3 text-xs">Any Time</ToggleGroupItem>
              {timelines.map(time => (
                <ToggleGroupItem key={time} value={time} className="rounded-lg px-3 text-xs">{time}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground text-lg">No success stories found matching your filters.</p>
          <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">
            Reset all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <SuccessStory story={story} onClick={setSelectedStory} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <SuccessStoryModal 
        story={selectedStory} 
        isOpen={!!selectedStory} 
        onClose={() => setSelectedStory(null)} 
      />
    </div>
  );
};

export default SuccessStoriesGallery;