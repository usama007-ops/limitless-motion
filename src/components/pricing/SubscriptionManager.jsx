import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Calendar, CreditCard, RefreshCw, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const SubscriptionManager = () => {
  const { currentUser, profile, isPremium } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!currentUser?.id) {
      setError('Authentication required to view subscription details.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiServerClient.fetch(`/stripe/payment-history?userId=${currentUser.id}&page=1&limit=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch billing history.');
      }
      const data = await response.json();
      setHistory(data.items || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Unable to load billing history. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCancel = async () => {
    if (!profile?.stripe_subscription_id) {
      toast.error('No active subscription found to cancel.');
      return;
    }

    setCancelling(true);
    try {
      const response = await apiServerClient.fetch('/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: profile.stripe_subscription_id,
          action: 'cancel',
          userId: currentUser.id
        })
      });
      
      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        fetchHistory(); // Refresh data
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error(error.message || 'An error occurred while cancelling.');
    } finally {
      setCancelling(false);
    }
  };

  const currentTier = isPremium ? (profile?.current_tier ? `${profile.current_tier.charAt(0).toUpperCase() + profile.current_tier.slice(1)} Plan` : 'Premium Member') : 'Basic Plan';
  const renewalDate = profile?.membership_end_date 
    ? new Date(profile.membership_end_date).toLocaleDateString() 
    : 'N/A';

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Current Plan
          </CardTitle>
          <CardDescription>Manage your active subscription and billing cycle.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="text-2xl font-bold text-foreground">{currentTier}</p>
                <Badge variant={isPremium ? 'default' : 'secondary'} className={isPremium ? 'bg-success hover:bg-success/90' : ''}>
                  {isPremium ? 'Active' : 'Free'}
                </Badge>
              </div>
              {isPremium && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                  <Calendar className="w-4 h-4" /> Renews on {renewalDate}
                </p>
              )}
            </div>
            {isPremium && (
              <Button 
                variant="destructive" 
                onClick={handleCancel} 
                disabled={cancelling}
                className="w-full md:w-auto"
              >
                {cancelling ? 'Processing...' : 'Cancel Plan'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex flex-col gap-3 mt-2">
                <p>{error}</p>
                <Button variant="outline" size="sm" onClick={fetchHistory} className="w-fit gap-2">
                  <RefreshCw className="w-3 h-3" /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : history.length === 0 ? (
            <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">No billing history found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-foreground">
                      ${(item.amount / 100).toFixed(2)} {item.currency?.toUpperCase() || 'USD'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={item.status === 'succeeded' || item.status === 'completed' ? 'default' : 'secondary'} className={item.status === 'succeeded' || item.status === 'completed' ? 'bg-success hover:bg-success/90' : ''}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;