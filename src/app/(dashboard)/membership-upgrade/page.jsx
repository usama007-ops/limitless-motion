'use client';

import { useState, useEffect } from 'react';
import { Shield, Star, Zap, AlertCircle, Loader2 } from 'lucide-react';
import MembershipTierCard from '@/components/pricing/MembershipTierCard.jsx';
import SubscriptionManager from '@/components/pricing/SubscriptionManager.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MembershipUpgradePage = () => {
  const { currentUser, profile, isPremium, refreshProfile } = useAuth();
  const [selectedTier, setSelectedTier] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentSystemAvailable, setPaymentSystemAvailable] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Membership - Limitless Motion';
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      setShowSuccess(true);
      window.history.replaceState({}, '', '/membership-upgrade');

      (async () => {
        try {
          await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        } catch (e) {
          console.error('Session verification error:', e);
        }

        let attempts = 0;
        const maxAttempts = 10;
        const poll = async () => {
          await refreshProfile();
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 1500);
          }
        };
        poll();
      })();
    }
  }, [refreshProfile]);

  useEffect(() => {
    let isMounted = true;
    
    const initializePaymentState = async () => {
      if (!currentUser?.id) {
        if (isMounted) setCheckingPayment(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/stripe/payment-methods?userId=${currentUser.id}`);
        if (response.status >= 500 && isMounted) {
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

  async function handleSubscribe() {
    if (!selectedTier || !currentUser?.id) return;
    setSubscribing(true);
    try {
      const successUrl = `${window.location.origin}/membership-upgrade?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/membership-upgrade`;
      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: selectedTier, billingCycle, successUrl, cancelUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create checkout');
      window.location.href = data.url;
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error.message || 'Failed to start subscription checkout. Please try again.');
      setSubscribing(false);
    }
  }

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

  const currentTierName = isPremium ? (profile?.current_tier || 'Premium') : 'Basic';

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
              <Badge variant={isPremium ? 'default' : 'secondary'} className={isPremium ? 'bg-success hover:bg-success/90 text-black' : ''}>
                {isPremium ? 'Active' : 'Free Tier'}
              </Badge>
            </div>
          </div>
          {profile?.membership_end_date && (
            <div className="text-right">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Renewal Date</p>
              <p className="text-lg font-medium text-foreground">
                {new Date(profile.membership_end_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        
        {showSuccess && (
          <Alert className="max-w-5xl mx-auto mb-8 bg-success/5 border-success/20 text-success">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscription Successful!</AlertTitle>
            <AlertDescription>
              Your membership has been activated. Welcome to Limitless Motion!
            </AlertDescription>
          </Alert>
        )}

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
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h3 className="text-xl font-serif font-medium mb-6 text-foreground">
                    Subscribe to {selectedTier}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-foreground">Billing Cycle</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          billingCycle === 'monthly'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:border-muted-foreground/30'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          billingCycle === 'yearly'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:border-muted-foreground/30'
                        }`}
                      >
                        Yearly <span className="text-xs opacity-75">(save ~17%)</span>
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="w-full btn-premium flex items-center gap-2"
                  >
                    {subscribing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Subscribe to {selectedTier}</>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    You will be redirected to Stripe's secure checkout to complete payment.
                  </p>
                </div>
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
