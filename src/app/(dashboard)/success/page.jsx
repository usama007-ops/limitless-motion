'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext.jsx';

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { currentUser } = useAuth();
  
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    document.title = 'Payment Successful - Limitless Motion';
  }, []);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setErrorMessage('No session ID found. Please contact support if you completed a payment.');
        return;
      }

      if (!currentUser) {
        setStatus('error');
        setErrorMessage('You must be logged in to verify your membership.');
        return;
      }

      try {
        const response = await fetch('/api/stripe/session/' + sessionId);
        if (!response.ok) {
          throw new Error('Failed to verify payment session');
        }
        
        const sessionData = await response.json();
        setSessionDetails(sessionData);

        if (sessionData.status === 'complete' || sessionData.status === 'paid') {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(`Payment status is ${sessionData.status}. Please try again or contact support.`);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage('An error occurred while verifying your payment. If you were charged, please contact support.');
      }
    };

    verifyPayment();
  }, [sessionId, currentUser]);

  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  return (
    <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
      <div className="container-luxury max-w-2xl w-full">
        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            {status === 'verifying' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-8"
              >
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
                <h2 className="text-2xl font-bold mb-2">Verifying your payment...</h2>
                <p className="text-muted-foreground">Please don't close this window.</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Welcome to Limitless Motion Premium!</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Your payment was successful. You now have full access to all premium content, workouts, and resources.
                </p>

                <div className="w-full bg-muted/50 rounded-2xl p-6 mb-8 text-left border border-border">
                  <h3 className="font-semibold text-foreground mb-4 border-b border-border/50 pb-2">Subscription Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2"><CreditCard size={16}/> Plan</span>
                      <span className="font-medium">Limitless Motion Premium</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2"><CreditCard size={16}/> Amount</span>
                      <span className="font-medium">${sessionDetails?.amountTotal ? (sessionDetails.amountTotal / 100).toFixed(2) : '24.99'} / month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2"><Calendar size={16}/> Next Billing</span>
                      <span className="font-medium">{nextBillingDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="h-14 px-10 text-lg font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-8"
              >
                <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={40} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {errorMessage}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/membership-upgrade')}
                    className="h-12 px-8"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    className="h-12 px-8"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SuccessPage;
