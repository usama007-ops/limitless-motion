import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, ArrowLeft, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import apiServerClient from '@/lib/apiServerClient';

const PaymentForm = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 2499, // Using 2499 as requested, backend may interpret as cents or dollars depending on its internal logic
          productName: 'Limitless Motion Premium',
          successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/cancel'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize checkout session');
      }

      const data = await response.json();
      
      if (data.url) {
        // Open Stripe checkout in a new tab to bypass iframe restrictions
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-6 text-muted-foreground hover:text-foreground pl-0"
        disabled={loading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plan Details
      </Button>

      <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center gap-3">
          <CreditCard className="text-primary" size={24} />
          <h3 className="font-semibold text-lg">Order Summary</h3>
        </div>
        
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b border-border/50">
              <div>
                <p className="font-bold text-foreground text-lg">Limitless Motion Premium</p>
                <p className="text-sm text-muted-foreground">Monthly recurring subscription</p>
              </div>
              <p className="font-bold text-lg">$24.99</p>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <p className="font-medium text-foreground">Total due today</p>
              <p className="font-extrabold text-2xl text-primary">$24.99</p>
            </div>
          </div>

          <div className="bg-secondary/5 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-primary shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Payments are processed securely by Stripe. You can cancel your subscription at any time from your dashboard settings.
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          <Button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing payment...</>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PaymentForm;