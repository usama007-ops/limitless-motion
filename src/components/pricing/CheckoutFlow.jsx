import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag, CreditCard } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { toast } from 'sonner';

const CheckoutFlow = ({ items, totalAmount }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const stripeItems = items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/apparel`;

      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: stripeItems,
          successUrl,
          cancelUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate checkout.');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout page
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col h-full">
      <h3 className="text-xl font-serif font-medium mb-6 flex items-center gap-2 text-foreground">
        <ShoppingBag className="w-5 h-5 text-primary" /> Order Summary
      </h3>
      
      <div className="space-y-4 mb-8 flex-grow">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex-1">
              {item.name} <span className="text-xs ml-1">x{item.quantity}</span>
            </span>
            <span className="font-medium text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            No items selected
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 mb-6">
        <div className="flex justify-between items-center text-lg font-serif font-medium">
          <span className="text-foreground">Total</span>
          <span className="text-primary">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        onClick={handleCheckout} 
        disabled={loading || items.length === 0}
        className="w-full btn-premium flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <CreditCard className="w-5 h-5" /> Proceed to Checkout
          </>
        )}
      </Button>
    </div>
  );
};

export default CheckoutFlow;