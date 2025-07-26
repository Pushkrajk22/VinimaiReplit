import React from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderTracking } from "@/components/orders/order-tracking";
import { Product, Order, Offer } from "@shared/schema";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Plus, Package, ShoppingCart, MessageSquare, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's products (for sellers)
  const { data: products } = useQuery({
    queryKey: ['/api/products', 'seller', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/products?sellerId=${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json() as Product[];
    },
    enabled: user?.role === 'seller',
  });

  // Fetch user's orders as buyer
  const { data: buyerOrders } = useQuery({
    queryKey: ['/api/orders', 'buyer', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/buyer/${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json() as Order[];
    },
    enabled: !!user?.id,
  });

  // Fetch user's orders as seller
  const { data: sellerOrders } = useQuery({
    queryKey: ['/api/orders', 'seller', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/seller/${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json() as Order[];
    },
    enabled: user?.role === 'seller',
  });

  // Fetch offers as buyer
  const { data: buyerOffers } = useQuery({
    queryKey: ['/api/offers', 'buyer', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/offers/buyer/${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch offers');
      return response.json() as Offer[];
    },
    enabled: !!user?.id,
  });

  // Fetch offers as seller
  const { data: sellerOffers } = useQuery({
    queryKey: ['/api/offers', 'seller', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/offers/seller/${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch offers');
      return response.json() as Offer[];
    },
    enabled: user?.role === 'seller',
  });

  // Accept offer mutation
  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to accept offer');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Offer Accepted",
        description: "The buyer has been notified to proceed with payment.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
    },
  });

  // Reject offer mutation
  const rejectOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const response = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to reject offer');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Offer Rejected",
        description: "The buyer has been notified.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
    },
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    totalProducts: products?.length || 0,
    activeOffers: sellerOffers?.filter(o => o.status === 'pending').length || 0,
    totalOrders: buyerOrders?.length || 0,
    completedOrders: buyerOrders?.filter(o => o.status === 'delivered').length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your {user?.role === 'seller' ? 'products and sales' : 'orders and offers'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {user?.role === 'seller' ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Offers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeOffers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Sales</p>
                      <p className="text-2xl font-bold text-gray-900">{sellerOrders?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">My Offers</p>
                      <p className="text-2xl font-bold text-gray-900">{buyerOffers?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue={user?.role === 'seller' ? 'products' : 'orders'} className="space-y-6">
          <TabsList>
            {user?.role === 'seller' ? (
              <>
                <TabsTrigger value="products">My Products</TabsTrigger>
                <TabsTrigger value="offers">Offers Received</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="orders">My Orders</TabsTrigger>
                <TabsTrigger value="offers">My Offers</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Products Tab (Sellers) */}
          {user?.role === 'seller' && (
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Products</h2>
                <Button asChild>
                  <Link href="/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    List New Product
                  </Link>
                </Button>
              </div>
              
              <div className="grid gap-6">
                {products?.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold">{product.title}</h3>
                            <p className="text-gray-600">{formatPrice(product.price)}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={product.status === 'approved' ? 'default' : 'secondary'}>
                                {product.status}
                              </Badge>
                              <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
                                {product.isAvailable ? 'Available' : 'Sold'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/products/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {!products || products.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                      <p className="text-gray-600 mb-4">Start selling by listing your first product</p>
                      <Button asChild>
                        <Link href="/products/new">List Your First Product</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </TabsContent>
          )}

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            <h2 className="text-2xl font-bold">
              {user?.role === 'seller' ? 'Offers Received' : 'My Offers'}
            </h2>
            
            <div className="grid gap-6">
              {(user?.role === 'seller' ? sellerOffers : buyerOffers)?.map((offer) => (
                <Card key={offer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Offer: {formatPrice(offer.amount)}</h3>
                        <p className="text-gray-600">Product ID: {offer.productId}</p>
                        {offer.message && (
                          <p className="text-sm text-gray-500 mt-1">"{offer.message}"</p>
                        )}
                        <div className="mt-2">
                          <Badge className={getOfferStatusColor(offer.status)}>
                            {offer.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {user?.role === 'seller' && offer.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => rejectOfferMutation.mutate(offer.id)}
                            disabled={rejectOfferMutation.isPending}
                          >
                            Reject
                          </Button>
                          <Button
                            onClick={() => acceptOfferMutation.mutate(offer.id)}
                            disabled={acceptOfferMutation.isPending}
                          >
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!(user?.role === 'seller' ? sellerOffers : buyerOffers)?.length && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
                    <p className="text-gray-600">
                      {user?.role === 'seller' 
                        ? 'Offers from buyers will appear here' 
                        : 'Browse products and make offers to sellers'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">
              {user?.role === 'seller' ? 'Sales' : 'My Orders'}
            </h2>
            
            <div className="grid gap-6">
              {(user?.role === 'seller' ? sellerOrders : buyerOrders)?.map((order) => (
                <OrderTracking key={order.id} order={order} />
              ))}
              
              {!(user?.role === 'seller' ? sellerOrders : buyerOrders)?.length && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">
                      {user?.role === 'seller' 
                        ? 'Sales from your products will appear here' 
                        : 'Your purchase history will appear here'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Sales Tab (Sellers) */}
          {user?.role === 'seller' && (
            <TabsContent value="sales" className="space-y-6">
              <h2 className="text-2xl font-bold">Sales History</h2>
              
              <div className="grid gap-6">
                {sellerOrders?.map((order) => (
                  <OrderTracking key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
