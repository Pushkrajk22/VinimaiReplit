import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Truck, Home } from "lucide-react";
import { Order } from "@shared/schema";

interface OrderTrackingProps {
  order: Order;
}

const orderStatuses = [
  { key: 'placed', label: 'Placed', icon: Circle },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'picked_up', label: 'Picked Up', icon: Clock },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

export function OrderTracking({ order }: OrderTrackingProps) {
  const currentStatusIndex = orderStatuses.findIndex(status => status.key === order.status);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription>Final Price: {formatPrice(order.finalPrice)}</CardDescription>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Progress Timeline */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between mb-8">
            {orderStatuses.map((status, index) => {
              const Icon = status.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={status.key} className="flex flex-col items-center text-center w-1/5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-primary' : 'text-gray-400'
                  }`}>
                    {status.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isCompleted && index < currentStatusIndex && formatDate(order.updatedAt.toString())}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Amount:</span>
            <span>{formatPrice(order.finalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Buyer Fee:</span>
            <span>{formatPrice(order.buyerFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Paid:</span>
            <span className="font-medium">
              {formatPrice((Number(order.finalPrice) + Number(order.buyerFee)).toString())}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Address:</span>
            <span className="text-right max-w-xs">{order.deliveryAddress}</span>
          </div>
        </div>

        {/* Return Policy Notice */}
        {order.status === 'delivered' && (
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <Clock className="text-primary mt-1 w-4 h-4" />
              <div>
                <h4 className="font-medium text-primary mb-1">Return Policy</h4>
                <p className="text-sm text-blue-700">
                  Electronics can be returned within 2 days of delivery. Fashion items can be returned on spot during delivery inspection.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
