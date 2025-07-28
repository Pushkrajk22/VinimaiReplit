import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { OfferModal } from "@/components/offers/offer-modal";
import { Product } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'home_garden', label: 'Home & Garden' },
  { id: 'sports', label: 'Sports' },
];

const sortOptions = [
  { id: 'default', label: 'Default' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
];

export default function Browse() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('default');

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
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (sortBy !== 'default') params.set('sort', sortBy);
    if (searchQuery) params.set('search', searchQuery);
    
    const newUrl = params.toString() ? `/browse?${params.toString()}` : '/browse';
    setLocation(newUrl);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sort !== 'default') params.set('sort', sort);
    if (searchQuery) params.set('search', searchQuery);
    
    const newUrl = params.toString() ? `/browse?${params.toString()}` : '/browse';
    setLocation(newUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Products</h1>
          <p className="text-gray-600">Discover amazing products from verified sellers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 md:mb-0">Filters</h3>
            </div>
            
            {/* Categories Filter */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategory !== 'all' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCategoryChange('all')}
                className="text-xs"
              >
                {categories.find(c => c.id === selectedCategory)?.label} ✕
              </Button>
            )}
            {sortBy !== 'default' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSortChange('default')}
                className="text-xs"
              >
                {sortOptions.find(s => s.id === sortBy)?.label} ✕
              </Button>
            )}
            {searchQuery && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setLocation('/browse')}
                className="text-xs"
              >
                Search: "{searchQuery}" ✕
              </Button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             selectedCategory !== 'all' ? `${categories.find(c => c.id === selectedCategory)?.label} Products` : 
             'All Products'}
          </h2>
        </div>

        {/* Product Grid */}
        <ProductGrid
          category={selectedCategory === 'all' ? undefined : selectedCategory}
          search={searchQuery}
          onMakeOffer={handleMakeOffer}
        />
      </div>

      {/* Offer Modal */}
      <OfferModal
        product={selectedProduct}
        open={offerModalOpen}
        onOpenChange={setOfferModalOpen}
      />
    </div>
  );
}