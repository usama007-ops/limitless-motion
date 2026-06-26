import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { createMacroGoals, updateMacroGoals } from '@/db';
import { useMealPlanLogic } from '@/hooks/useMealPlanLogic';
import { toast } from 'sonner';
import { Loader2, Calculator, Target } from 'lucide-react';

const MacroGoalForm = ({ onGoalsSaved, currentGoals }) => {
  const { currentUser } = useAuth();
  const { calculateCalories, determineSurplusDeficit } = useMealPlanLogic();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    protein: currentGoals?.protein_target || '',
    carbs: currentGoals?.carbs_target || '',
    fats: currentGoals?.fats_target || '',
    maintenance: 2000
  });

  const [calculated, setCalculated] = useState({
    calories: currentGoals?.total_calories || 0,
    status: currentGoals?.surplus_deficit || 'Maintenance'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    
    const newFormData = { ...formData, [name]: numValue };
    setFormData(newFormData);

    if (newFormData.protein && newFormData.carbs && newFormData.fats) {
      const cals = calculateCalories(
        Number(newFormData.protein), 
        Number(newFormData.carbs), 
        Number(newFormData.fats)
      );
      const status = determineSurplusDeficit(cals, newFormData.maintenance);
      setCalculated({ calories: cals, status });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please log in to save goals');
      return;
    }

    setLoading(true);
    try {
      const data = {
        user_id: currentUser.id,
        protein_target: Number(formData.protein),
        carbs_target: Number(formData.carbs),
        fats_target: Number(formData.fats),
        total_calories: calculated.calories,
        surplus_deficit: calculated.status
      };

      if (currentGoals?.id) {
        await updateMacroGoals(currentGoals.id, data);
        toast.success('Macro goals updated successfully');
      } else {
        const record = await createMacroGoals(data);
        if (onGoalsSaved) onGoalsSaved(record);
        toast.success('Macro goals saved successfully');
      }
      
      if (onGoalsSaved) onGoalsSaved(currentGoals?.id ? { ...currentGoals, ...data } : data);
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save macro goals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-modern max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Target size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Set Macro Goals</h2>
          <p className="text-muted-foreground text-sm">Define your daily nutritional targets</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Protein (g)</label>
            <input
              type="number"
              name="protein"
              required
              min="0"
              value={formData.protein}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. 150"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Carbs (g)</label>
            <input
              type="number"
              name="carbs"
              required
              min="0"
              value={formData.carbs}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. 200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Fats (g)</label>
            <input
              type="number"
              name="fats"
              required
              min="0"
              value={formData.fats}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. 60"
            />
          </div>
        </div>

        <div className="space-y-2 md:w-1/3">
          <label className="text-sm font-medium text-foreground">Est. Maintenance Calories</label>
          <input
            type="number"
            name="maintenance"
            value={formData.maintenance}
            onChange={handleInputChange}
            className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="e.g. 2000"
          />
          <p className="text-xs text-muted-foreground">Used to calculate surplus/deficit</p>
        </div>

        {calculated.calories > 0 && (
          <div className="bg-muted p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calculator className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Calculated Daily Intake</p>
                <p className="text-2xl font-bold text-foreground">{calculated.calories} <span className="text-base font-normal text-muted-foreground">kcal</span></p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide ${
              calculated.status === 'Surplus' ? 'bg-warning/20 text-warning-foreground dark:text-warning' :
              calculated.status === 'Deficit' ? 'bg-success/20 text-success-foreground dark:text-success' :
              'bg-primary/20 text-primary'
            }`}>
              {calculated.status} Phase
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary-modern flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Save Macro Goals'}
        </button>
      </form>
    </div>
  );
};

export default MacroGoalForm;
