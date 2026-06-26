import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Plus, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const PaymentMethodManager = ({ onSelect }) => {
  const { currentUser } = useAuth();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMethods = useCallback(async () => {
    if (!currentUser?.id) {
      setError('User authentication required to load payment methods.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiServerClient.fetch(`/stripe/payment-methods?userId=${currentUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods from server.');
      }
      const data = await response.json();
      setMethods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Unable to load payment methods at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="w-8 h-6 rounded" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <Alert variant="destructive" className="bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 mt-2">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={fetchMethods} className="w-fit gap-2">
              <RefreshCw className="w-3 h-3" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Methods</h3>
      
      {!methods || methods.length === 0 ? (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="p-6 text-center flex flex-col items-center gap-3">
            <CreditCard className="w-8 h-8 text-muted-foreground/50" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">No payment methods saved</p>
              <p className="text-sm text-muted-foreground">Add a payment method to complete your subscription.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <Card 
              key={method.id} 
              className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => onSelect && onSelect(method.id)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-md">
                    <CreditCard className="text-foreground w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium capitalize text-sm">
                      {method.brand || method.type} •••• {method.last4Digits || '****'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {method.expMonth || '--'}/{method.expYear || '----'}
                    </p>
                  </div>
                </div>
                {method.isDefault && <CheckCircle2 className="text-primary w-5 h-5" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Button variant="outline" className="w-full gap-2 border-dashed hover:border-primary hover:bg-primary/5">
        <Plus className="w-4 h-4" /> Add New Payment Method
      </Button>
    </div>
  );
};

export default PaymentMethodManager;