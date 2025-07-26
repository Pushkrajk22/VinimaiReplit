import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
  onMakeOffer?: (product: Product) => void;
}

export function ProductCard({ product, onMakeOffer }: ProductCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'sold':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electronics':
        return 'bg-blue-50 text-blue-700';
      case 'fashion':
        return 'bg-pink-50 text-pink-700';
      case 'home_garden':
        return 'bg-green-50 text-green-700';
      case 'sports':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getStatusColor(product.isAvailable ? 'available' : 'sold')}>
            {product.isAvailable ? 'Available' : 'Sold'}
          </Badge>
          <Badge className={getCategoryColor(product.category)}>
            {product.category.replace('_', ' ')}
          </Badge>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary cursor-pointer">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <div className="text-xs text-gray-500">+ 3% platform fee</div>
          </div>
          
          {product.isAvailable && onMakeOffer && (
            <Button
              onClick={() => onMakeOffer(product)}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Make Offer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
