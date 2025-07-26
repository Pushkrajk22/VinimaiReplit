import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RazorpayCheckout } from "@/components/payments/razorpay-checkout";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";

export default function Checkout() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/checkout/:orderId");
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!params?.orderId) {
      navigate("/dashboard");
      return;
    }

    loadOrderData();
  }, [params?.orderId, isAuthenticated]);

  const loadOrderData = async () => {
    try {
      // In a real app, you'd have an API to get order details
      // For now, we'll simulate it
      setLoading(false);
    } catch (error) {
      console.error("Error loading order:", error);
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Redirect to success page or order tracking
    navigate(`/orders/${params?.orderId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // Stay on checkout page to retry
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Review your order and make payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Sample Product</h3>
                    <p className="text-sm text-muted-foreground">Electronics</p>
                    <p className="text-lg font-bold">₹2,500</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Product Price:</span>
                    <span>₹2,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (3%):</span>
                    <span>₹75.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹2,575.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-semibold">{user?.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Mobile: {user?.mobile}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Delivery address will be collected after payment confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RazorpayCheckout
                  amount={2575}
                  orderId={params?.orderId || "sample-order"}
                  productTitle="Sample Product"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}