import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, Order, Return, User } from "@shared/schema";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  RefreshCw, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit3,
  Eye,
  IndianRupee
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editRequests, setEditRequests] = useState("");

  // Fetch pending products
  const { data: pendingProducts } = useQuery({
    queryKey: ['/api/admin/products/pending'],
    queryFn: async () => {
      const response = await fetch('/api/admin/products/pending', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch pending products');
      return await response.json() as Product[];
    },
  });

  // Fetch all orders for admin overview
  const { data: allOrders } = useQuery({
    queryKey: ['/api/admin/orders'],
    queryFn: async () => {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json() as Order[];
    },
  });

  // Approve product mutation
  const approveProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) throw new Error('Failed to approve product');
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Approved",
        description: "The product has been approved and is now live.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products/pending'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve product",
        variant: "destructive",
      });
    },
  });

  // Reject product mutation
  const rejectProductMutation = useMutation({
    mutationFn: async ({ productId, reason }: { productId: string; reason?: string }) => {
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to reject product');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Rejected",
        description: "The product has been rejected and the seller has been notified.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products/pending'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject product",
        variant: "destructive",
      });
    },
  });

  // Request edit mutation
  const requestEditMutation = useMutation({
    mutationFn: async ({ productId, editRequests }: { productId: string; editRequests: string }) => {
      const response = await fetch(`/api/admin/products/${productId}/request-edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ editRequests }),
      });
      if (!response.ok) throw new Error('Failed to request edit');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Edit Request Sent",
        description: "The seller has been notified about the required changes.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products/pending'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send edit request",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
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

  // Calculate admin statistics
  const stats = {
    pendingProducts: pendingProducts?.length || 0,
    totalOrders: allOrders?.length || 0,
    activeOrders: allOrders?.filter(o => ['placed', 'confirmed', 'picked_up', 'out_for_delivery'].includes(o.status)).length || 0,
    completedOrders: allOrders?.filter(o => o.status === 'delivered').length || 0,
    totalRevenue: allOrders?.reduce((sum, order) => sum + Number(order.platformFee), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage products, orders, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
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
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.totalRevenue.toString())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">
              Product Approval
              {stats.pendingProducts > 0 && (
                <Badge className="ml-2 bg-red-500">{stats.pendingProducts}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Product Approval Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pending Product Approvals</h2>
              <Badge variant="outline">
                {stats.pendingProducts} pending
              </Badge>
            </div>

            <div className="grid gap-6">
              {pendingProducts?.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-4 gap-6">
                      {/* Product Image */}
                      <div className="lg:col-span-1">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="lg:col-span-2 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold">{product.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getCategoryColor(product.category)}>
                              {product.category.replace('_', ' ')}
                            </Badge>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 line-clamp-3">{product.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Listed: {new Date(product.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Additional product info */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Condition: {product.condition || 'Not specified'}</span>
                            <span>•</span>
                            <span>Location: {product.location || 'Not specified'}</span>
                          </div>
                          
                          {product.images && product.images.length > 1 && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              <span>{product.images.length} images</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 flex flex-col space-y-3">
                        <Button
                          onClick={() => approveProductMutation.mutate(product.id)}
                          disabled={approveProductMutation.isPending}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSelectedProduct(product);
                                setRejectReason("");
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Product</DialogTitle>
                              <DialogDescription>
                                Provide a reason for rejecting "{product.title}". The seller will be notified.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="reason">Rejection Reason</Label>
                                <Textarea
                                  id="reason"
                                  placeholder="e.g., Images are unclear, description needs more details, price seems unreasonable..."
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => {
                                  rejectProductMutation.mutate({ 
                                    productId: product.id, 
                                    reason: rejectReason 
                                  });
                                }}
                                disabled={rejectProductMutation.isPending}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Reject Product
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSelectedProduct(product);
                                setEditRequests("");
                              }}
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Request Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Request Product Edit</DialogTitle>
                              <DialogDescription>
                                Specify what changes are needed for "{product.title}". The seller will be notified.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edits">Required Changes</Label>
                                <Textarea
                                  id="edits"
                                  placeholder="e.g., Please add more product images, update the description with specifications, adjust the pricing..."
                                  value={editRequests}
                                  onChange={(e) => setEditRequests(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => {
                                  requestEditMutation.mutate({ 
                                    productId: product.id, 
                                    editRequests: editRequests 
                                  });
                                }}
                                disabled={requestEditMutation.isPending || !editRequests.trim()}
                              >
                                Send Edit Request
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!pendingProducts || pendingProducts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                    <p className="text-gray-600">All products have been reviewed</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </TabsContent>

          {/* Order Management Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Order Management</h2>
            
            <div className="grid gap-6">
              {allOrders?.slice(0, 10).map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-gray-600">
                          Amount: {formatPrice(order.finalPrice)} | 
                          Platform Fee: {formatPrice(order.platformFee)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!allOrders || allOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Orders will appear here as they are placed</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </TabsContent>

          {/* Returns Tab */}
          <TabsContent value="returns" className="space-y-6">
            <h2 className="text-2xl font-bold">Return Requests</h2>
            
            <Card>
              <CardContent className="p-12 text-center">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No return requests</h3>
                <p className="text-gray-600">Return requests will appear here for review</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Platform commission earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-bold">{formatPrice(stats.totalRevenue.toString())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Orders:</span>
                      <span>{stats.completedOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value:</span>
                      <span>
                        {stats.completedOrders > 0 
                          ? formatPrice((stats.totalRevenue / stats.completedOrders).toString())
                          : formatPrice("0")
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Statistics</CardTitle>
                  <CardDescription>Order status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-bold">{stats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Orders:</span>
                      <span>{stats.activeOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Orders:</span>
                      <span>{stats.completedOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span>
                        {stats.totalOrders > 0 
                          ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%`
                          : "0%"
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
