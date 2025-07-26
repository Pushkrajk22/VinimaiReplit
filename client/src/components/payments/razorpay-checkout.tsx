import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

interface RazorpayCheckoutProps {
  amount: number;
  orderId: string;
  productTitle: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({ 
  amount, 
  orderId, 
  productTitle, 
  onSuccess, 
  onError 
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order on backend
      const response = await apiRequest("POST", "/api/payments/create-order", {
        amount,
        orderId
      });

      const orderData = await response.json();

      // Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Vinimai Exchange',
        description: `Payment for ${productTitle}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await apiRequest("POST", "/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            });

            const verificationData = await verificationResponse.json();

            if (verificationData.success) {
              toast({
                title: "Payment Successful",
                description: "Your order has been confirmed!"
              });
              onSuccess({
                paymentId: verificationData.paymentId,
                orderId: response.razorpay_order_id
              });
            } else {
              throw new Error(verificationData.message);
            }
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description: error.message,
              variant: "destructive"
            });
            onError(error.message);
          }
        },
        prefill: {
          name: user?.username || '',
          contact: user?.mobile || '',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onError('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive"
      });
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Product:</span>
            <span>{productTitle}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total:</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Secure payments powered by Razorpay. Supports UPI, Cards, Net Banking & Wallets.
      </p>
    </div>
  );
}