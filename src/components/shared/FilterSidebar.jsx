import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const FilterSidebar = ({ filterOptions, selectedFilters, onFilterChange }) => {
  const handleToggle = (group, value) => {
    const currentGroup = selectedFilters[group] || [];
    const newGroup = currentGroup.includes(value)
      ? currentGroup.filter(item => item !== value)
      : [...currentGroup, value];
    
    onFilterChange({
      ...selectedFilters,
      [group]: newGroup
    });
  };

  return (
    <div className="w-full space-y-8 bg-card p-6 rounded-2xl border border-border shadow-sm">
      <h3 className="font-bold text-lg border-b border-border pb-4">Filters</h3>
      
      {Object.entries(filterOptions).map(([groupName, options]) => (
        <div key={groupName} className="space-y-4">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            {groupName}
          </h4>
          <div className="space-y-3">
            {options.map(option => (
              <div key={option} className="flex items-center space-x-3">
                <Checkbox 
                  id={`filter-${groupName}-${option}`} 
                  checked={(selectedFilters[groupName] || []).includes(option)}
                  onCheckedChange={() => handleToggle(groupName, option)}
                />
                <Label 
                  htmlFor={`filter-${groupName}-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;