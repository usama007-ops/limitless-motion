'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CancelPage = () => {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Payment Cancelled - Limitless Motion';
  }, []);

  return (
    <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
      <div className="container-luxury max-w-2xl w-full">
        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-6">
                <XCircle size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Payment Cancelled</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Your checkout process was cancelled and you have not been charged. You can try again whenever you're ready.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Button 
                  onClick={() => router.push('/membership-upgrade')}
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Upgrade
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="h-12 px-8"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CancelPage;
