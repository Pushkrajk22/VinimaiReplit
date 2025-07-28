import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { OfferModal } from "@/components/offers/offer-modal";
import { Product } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Handshake, Shield, Truck } from "lucide-react";

const categories = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'home_garden', label: 'Home & Garden' },
  { id: 'sports', label: 'Sports' },
];

export default function Home() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Parse search query from URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = searchParams.get('search') || '';

  const handleMakeOffer = (product: Product) => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setSelectedProduct(product);
    setOfferModalOpen(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL without search params when changing category
    if (category === 'all') {
      setLocation('/');
    } else {
      setLocation(`/?category=${category}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-section text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Safe & Trusted
                <span className="block">Exchange Platform</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Your personal exchange where privacy meets security. Buy and sell with confidence through our protected platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link href="/register">Start Selling</Link>
                </Button>
                <button 
                  className="px-6 py-3 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-md transition-colors"
                  onClick={() => setLocation('/browse')}
                >
                  Browse Products
                </button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-center space-x-8">
                  <Smartphone className="h-16 w-16 text-white" />
                  <Handshake className="h-16 w-16 text-white" />
                  <Shield className="h-16 w-16 text-white" />
                  <Truck className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Vinimai?</h2>
            <p className="text-xl text-gray-600">Built for trust, designed for individuals</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Users</h3>
              <p className="text-gray-600">All users verified through mobile OTP. Admin-approved listings ensure quality and safety.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Make Offers</h3>
              <p className="text-gray-600">Negotiate directly with sellers. Accept offers and complete secure transactions.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Returns</h3>
              <p className="text-gray-600">Fashion items: return on spot. Electronics: 2-day return window for peace of mind.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1K+</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Satisfied Users</h3>
              <p className="text-gray-600">1000+ satisfied users and counting. Join our growing community today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
            </h2>
            {searchQuery && (
              <Button variant="outline" onClick={() => setLocation('/')}>
                Clear Search
              </Button>
            )}
          </div>

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className="rounded-full"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          )}

          <ProductGrid
            category={selectedCategory === 'all' ? undefined : selectedCategory}
            search={searchQuery}
            onMakeOffer={handleMakeOffer}
          />
        </div>
      </section>

      {/* Offer Modal */}
      <OfferModal
        product={selectedProduct}
        open={offerModalOpen}
        onOpenChange={setOfferModalOpen}
      />
    </div>
  );
}
