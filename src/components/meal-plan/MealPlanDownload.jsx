import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Link from 'next/link';

const MealPlanDownload = ({ planRef, hasPlan }) => {
  const { isAuthenticated } = useAuth();
  const [downloading, setDownloading] = useState(false);

  if (!hasPlan) return null;

  const handleDownload = async () => {
    if (!planRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(planRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Limitless_Motion_Meal_Plan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-muted/40 border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-background rounded-full shadow-sm">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Save Your Plan</h4>
            <p className="text-sm text-muted-foreground">Sign up or log in to download this plan as a PDF.</p>
          </div>
        </div>
        <Button asChild variant="default" className="font-bold rounded-xl whitespace-nowrap">
          <Link to="/signup">Create Free Account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-12 mb-8">
      <Button 
        onClick={handleDownload} 
        disabled={downloading}
        size="lg"
        className="font-bold tracking-wide rounded-xl px-8 h-14 bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
      >
        {downloading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating PDF...</>
        ) : (
          <><Download className="w-5 h-5 mr-2" /> Download Plan (PDF)</>
        )}
      </Button>
    </div>
  );
};

export default MealPlanDownload;