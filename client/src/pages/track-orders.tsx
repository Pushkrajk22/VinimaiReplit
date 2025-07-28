import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

interface Order {
  id: string;
  trackingId: string;
  productName: string;
  status: 'packaging' | 'dispatched' | 'out_for_delivery' | 'delivered';
  orderDate: string;
  estimatedDelivery?: string;
}

const orderStatuses = [
  { id: 'packaging', label: 'Packaging', icon: Package },
  { id: 'dispatched', label: 'Dispatched', icon: Clock },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrders() {
  const { isAuthenticated, user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders/user', user?.id],
    enabled: !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Orders</h1>
          <p className="text-gray-600 mb-8">Please log in to view your order tracking information</p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIndex = (status: string) => {
    return orderStatuses.findIndex(s => s.id === status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Orders</h1>
          <p className="text-gray-600">Monitor your order status and delivery progress</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : !orders || (Array.isArray(orders) && orders.length === 0) ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/browse">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(orders) && orders.map((order: Order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.productName}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Order placed on {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Link href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {order.trackingId}
                      </Link>
                      <Badge 
                        variant={order.status === 'delivered' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {orderStatuses.find(s => s.id === order.status)?.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Progress Timeline */}
                  <div className="relative">
                    <div className="flex justify-between">
                      {orderStatuses.map((status, index) => {
                        const Icon = status.icon;
                        const currentIndex = getStatusIndex(order.status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        
                        return (
                          <div key={status.id} className="flex flex-col items-center relative">
                            {index < orderStatuses.length - 1 && (
                              <div 
                                className={`absolute top-5 left-5 w-full h-0.5 ${
                                  index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                                style={{ width: 'calc(100% + 2rem)' }}
                              />
                            )}
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                                isCompleted 
                                  ? 'bg-green-500 text-white' 
                                  : isCurrent 
                                  ? 'bg-blue-500 text-white animate-pulse' 
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <span 
                              className={`text-sm mt-2 text-center ${
                                isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                              }`}
                            >
                              {status.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {order.estimatedDelivery && order.status !== 'delivered' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center">
                    <Button variant="outline" asChild>
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Download Invoice
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}