import React, { forwardRef, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MealCard from './MealCard.jsx';
import HighProteinMealCard from './HighProteinMealCard.jsx';
import { Calendar, Download, Target, Lock, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const MacroProgress = ({ label, current, target, colorClass }) => {
  const percent = Math.min(100, Math.round((current / (target || 1)) * 100));
  
  return (
    <div className="flex-1">
      <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{current} / {target}</span>
      </div>
      <Progress value={percent} className={`h-2.5 bg-muted ${colorClass}`} />
    </div>
  );
};

const MealPlanDisplay = forwardRef(({ plan, targetMacros, category }, ref) => {
  const { isAuthenticated } = useAuth();
  const [downloading, setDownloading] = useState(false);

  if (!plan || plan.length === 0) return null;

  const isGlobal = category === 'global';

  const handleDownload = async () => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Limitless_Motion_Meal_Plan.pdf');
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full mt-20" ref={ref}>
      
      {/* Header & Feedback */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-primary font-bold bg-primary/10 px-4 py-2 rounded-full mb-4">
            <CheckCircle2 className="w-5 h-5" /> Plan Generated Successfully
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Custom Nutrition Plan</h2>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
            Structured for {plan.length} weeks. Stick to these portions to hit your exact goals.
          </p>
        </div>
        
        {/* Download Actions */}
        <div className="shrink-0">
          {isAuthenticated ? (
            <Button 
              onClick={handleDownload} 
              disabled={downloading}
              size="lg"
              className="font-bold rounded-xl h-14 bg-foreground text-background hover:bg-foreground/90 shadow-elevation-1 hover:shadow-elevation-2"
            >
              {downloading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
              Export PDF
            </Button>
          ) : (
            <div className="bg-muted p-4 rounded-xl border border-border flex items-center gap-3 text-sm font-medium max-w-xs text-left">
              <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
              <span>Sign up or log in to unlock PDF exports of your meal plans.</span>
            </div>
          )}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["week-1"]} className="space-y-6">
        {plan.map((week) => (
          <AccordionItem 
            key={`week-${week.weekNumber}`} 
            value={`week-${week.weekNumber}`}
            className="bg-card border border-border shadow-elevation-1 rounded-2xl overflow-hidden px-2 data-[state=open]:shadow-elevation-2 transition-all"
          >
            <AccordionTrigger className="px-4 py-6 hover:no-underline group">
              <div className="flex items-center gap-4 text-left w-full">
                <div className="bg-primary/10 text-primary p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-extrabold tracking-tight">Week {week.weekNumber}</h3>
                  {week.weeklyAverages && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1 text-sm text-muted-foreground font-semibold">
                      <span>Avg Cal: {week.weeklyAverages.calories}</span>
                      <span>Pro: {week.weeklyAverages.protein}g</span>
                      <span>Carb: {week.weeklyAverages.carbs}g</span>
                      <span>Fat: {week.weeklyAverages.fats}g</span>
                    </div>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-8 pt-2">
              <div className="space-y-12">
                {week.days.map((day) => (
                  <div key={`day-${day.dayNumber}`} className="relative border-t border-border pt-8 first:border-0 first:pt-0">
                    
                    <div className="flex flex-col xl:flex-row justify-between gap-6 mb-8">
                      <h4 className="text-2xl font-bold">Day {day.dayNumber}</h4>
                      
                      {/* Daily Macro Progress */}
                      <div className="flex-1 max-w-2xl bg-muted/40 p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4">
                        <MacroProgress 
                          label="Calories" 
                          current={day.totals.calories} 
                          target={targetMacros.calories} 
                          colorClass="indicator-emerald" 
                        />
                        <MacroProgress 
                          label="Protein" 
                          current={day.totals.protein} 
                          target={targetMacros.protein} 
                          colorClass="indicator-primary" 
                        />
                        <MacroProgress 
                          label="Carbs" 
                          current={day.totals.carbs} 
                          target={targetMacros.carbs} 
                          colorClass="indicator-amber" 
                        />
                        <MacroProgress 
                          label="Fats" 
                          current={day.totals.fats} 
                          target={targetMacros.fats} 
                          colorClass="indicator-rose" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {day.meals.map((meal) => (
                        <div key={meal.id} className="h-full">
                          {isGlobal ? (
                            <HighProteinMealCard meal={meal} />
                          ) : (
                            <MealCard meal={meal} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
});

MealPlanDisplay.displayName = 'MealPlanDisplay';
export default MealPlanDisplay;