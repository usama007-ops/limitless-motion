'use client';

import { useState, useEffect } from 'react';
import { Shield, Star, Zap, AlertCircle } from 'lucide-react';
import MembershipTierCard from '@/components/pricing/MembershipTierCard.jsx';
import CheckoutFlow from '@/components/pricing/CheckoutFlow.jsx';
import SubscriptionManager from '@/components/pricing/SubscriptionManager.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MembershipUpgradePage = () => {
  const { currentUser } = useAuth();
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentSystemAvailable, setPaymentSystemAvailable] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(true);

  useEffect(() => {
    document.title = 'Membership - Limitless Motion';
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const initializePaymentState = async () => {
      if (!currentUser?.id) {
        if (isMounted) setCheckingPayment(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/stripe/payment-methods?userId=${currentUser.id}`);
        if (!response.ok && isMounted) {
          setPaymentSystemAvailable(false);
        }
      } catch (error) {
        console.error("Failed to initialize payment state:", error);
        if (isMounted) setPaymentSystemAvailable(false);
      } finally {
        if (isMounted) setCheckingPayment(false);
      }
    };
    
    initializePaymentState();
    return () => { isMounted = false; };
  }, [currentUser]);

  const tiers = [
    { 
      name: 'Basic', 
      price: '9.99', 
      features: ['Access to ALIGN workouts', 'Basic tracking', 'Community access'],
      icon: <Shield className="w-6 h-6 mb-4 text-muted-foreground" />
    },
    { 
      name: 'Premium', 
      price: '19.99', 
      features: ['Everything in Basic', 'Custom FUEL meal plans', 'Advanced analytics', 'Priority support'], 
      isPopular: true,
      icon: <Star className="w-6 h-6 mb-4 text-primary" />
    },
    { 
      name: 'Elite', 
      price: '49.99', 
      features: ['Everything in Premium', '1-on-1 Coaching calls', 'Form review', 'Direct messaging'],
      icon: <Zap className="w-6 h-6 mb-4 text-warning" />
    }
  ];

  const isPremium = currentUser?.isPremium || false;
  const currentTierName = isPremium ? 'Premium' : 'Basic';

  return (
    <ErrorBoundary>
      <main className="flex-grow pt-32 pb-24 container-luxury">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="heading-display mb-4">Manage Membership</h1>
          <p className="text-xl text-muted-foreground">
            Upgrade your plan to unlock premium features, personalized coaching, and advanced analytics.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-12 bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Status</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground">{currentTierName} Plan</span>
              <Badge variant={isPremium ? 'default' : 'secondary'} className={isPremium ? 'bg-success hover:bg-success/90' : ''}>
                {isPremium ? 'Active' : 'Free Tier'}
              </Badge>
            </div>
          </div>
          {currentUser?.membershipEndDate && (
            <div className="text-right">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Renewal Date</p>
              <p className="text-lg font-medium text-foreground">
                {new Date(currentUser.membershipEndDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        
        {!paymentSystemAvailable && !checkingPayment && (
          <Alert variant="destructive" className="max-w-5xl mx-auto mb-8 bg-destructive/5 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment System Unavailable</AlertTitle>
            <AlertDescription>
              Payment processing is temporarily unavailable. Please try again later or contact support.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upgrade" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12 h-14 rounded-xl bg-muted/50 p-1">
            <TabsTrigger value="upgrade" className="rounded-lg text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Upgrade Plan
            </TabsTrigger>
            <TabsTrigger value="manage" className="rounded-lg text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Manage Subscription
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upgrade" className="space-y-16 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map(tier => (
                <div key={tier.name} className="relative">
                  <MembershipTierCard 
                    tier={tier.name}
                    price={tier.price}
                    features={tier.features}
                    isPopular={tier.isPopular}
                    selected={selectedTier === tier.name}
                    onSelect={setSelectedTier}
                    disabled={!paymentSystemAvailable && !checkingPayment}
                    disabledMessage="Payment processing is temporarily unavailable. Please try again later or contact support."
                  />
                </div>
              ))}
            </div>
            
            {selectedTier && paymentSystemAvailable && (
              <div className="max-w-xl mx-auto scroll-mt-32" id="checkout-section">
                <ErrorBoundary fallback={
                  <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-xl text-center">
                    <p className="text-destructive font-medium mb-2">Checkout is temporarily unavailable.</p>
                    <p className="text-sm text-muted-foreground">Please try refreshing the page or contact support if the issue persists.</p>
                  </div>
                }>
                  <CheckoutFlow 
                    selectedTier={selectedTier} 
                    onSuccess={() => {
                      setSelectedTier(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                  />
                </ErrorBoundary>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="manage" className="outline-none">
            <ErrorBoundary fallback={
              <div className="p-8 bg-card border border-border rounded-2xl text-center">
                <p className="text-foreground font-medium mb-2">Unable to load subscription details.</p>
                <p className="text-sm text-muted-foreground">We're having trouble connecting to the billing system. Please try again later.</p>
              </div>
            }>
              <SubscriptionManager />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </main>
    </ErrorBoundary>
  );
};

export default MembershipUpgradePage;
