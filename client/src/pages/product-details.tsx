import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OfferModal } from "@/components/offers/offer-modal";
import { Product, Offer } from "@shared/schema";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Package, 
  Shield, 
  Truck, 
  RefreshCw,
  Heart,
  Share2,
  MessageSquare,
  Star
} from "lucide-react";

interface ProductDetailsProps {
  productId: string;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Scroll to top when component mounts (when navigating to product details)
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json() as Product;
    },
  });

  // Fetch offers for this product
  const { data: offers } = useQuery({
    queryKey: ['/api/offers', 'product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/offers/product/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch offers');
      return await response.json() as Offer[];
    },
  });

  // Create order mutation (direct purchase)
  const createOrderMutation = useMutation({
    mutationFn: async (data: { finalPrice: string; deliveryAddress: string }) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productId,
          sellerId: product?.sellerId,
          finalPrice: data.finalPrice,
          deliveryAddress: data.deliveryAddress,
        }),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const handleMakeOffer = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    if (product) {
      setSelectedProduct(product);
      setOfferModalOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDirectPurchase = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // In a real app, this would open a checkout flow
    const deliveryAddress = prompt("Enter your delivery address:");
    if (deliveryAddress && product) {
      createOrderMutation.mutate({
        finalPrice: product.price,
        deliveryAddress,
      });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const calculateFees = (amount: number) => {
    const fee = amount * 0.03;
    return {
      buyerTotal: amount + fee,
      sellerReceives: amount - fee,
      platformFee: fee * 2,
    };
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

  const getReturnPolicy = (category: string) => {
    switch (category) {
      case 'fashion':
        return "Return on spot during delivery inspection";
      case 'electronics':
        return "2-day return window after delivery";
      default:
        return "2-day return window after delivery";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-32 mb-6 rounded"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-300 h-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
              <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link href="/">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const fees = calculateFees(Number(product.price));
  const isOwner = user?.id === product.sellerId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge className={getCategoryColor(product.category)}>
                  {product.category.replace('_', ' ')}
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                <Badge variant={product.isAvailable ? "default" : "secondary"}>
                  {product.isAvailable ? 'Available' : 'Sold'}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Pricing Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Product Price:</span>
                  <span>{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Total (with 3% fee):</span>
                  <span className="font-medium">{formatPrice(fees.buyerTotal.toString())}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Platform fee covers secure payments, dispute resolution & support
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {!isOwner && product.isAvailable && (
              <div className="space-y-3">
                <Button
                  onClick={handleDirectPurchase}
                  className="w-full"
                  size="lg"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Processing..." : "Buy Now"}
                </Button>
                <Button
                  onClick={handleMakeOffer}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Make Offer
                </Button>
              </div>
            )}

            {isOwner && (
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-700">
                    This is your product. You can manage it from your dashboard.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Trust & Safety Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium">Verified Seller</h3>
                  <p className="text-sm text-gray-600">Admin approved</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">Safe Delivery</h3>
                  <p className="text-sm text-gray-600">Track your order</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-medium">Return Policy</h3>
                  <p className="text-sm text-gray-600">{getReturnPolicy(product.category)}</p>
                </div>
              </div>
            </div>

            {/* Offers Section */}
            {offers && offers.length > 0 && (isOwner || user?.role === 'admin') && (
              <>
                <Separator />
                <div>
                  <h2 className="text-lg font-semibold mb-3">Recent Offers</h2>
                  <div className="space-y-2">
                    {offers.slice(0, 3).map((offer) => (
                      <div key={offer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{formatPrice(offer.amount)}</span>
                          {offer.message && (
                            <p className="text-sm text-gray-600">"{offer.message}"</p>
                          )}
                        </div>
                        <Badge variant="outline">{offer.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Offer Modal */}
        <OfferModal
          product={selectedProduct}
          open={offerModalOpen}
          onOpenChange={setOfferModalOpen}
        />
      </div>
    </div>
  );
}
