import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/products/product-grid";
import { OfferModal } from "@/components/offers/offer-modal";
import { Product } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const categories = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'home_garden', label: 'Home & Garden' },
  { id: 'sports', label: 'Sports' },
  { id: 'books', label: 'Books' },
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

  // Parse search query and category from URL - handle both location and window.location
  const currentUrl = location || window.location.pathname + window.location.search;
  const searchParams = new URLSearchParams(currentUrl.split('?')[1] || '');
  const searchQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'all';
  
  // Initialize selected category from URL and handle URL changes
  React.useEffect(() => {
    const actualUrl = window.location.pathname + window.location.search;
    const actualParams = new URLSearchParams(window.location.search);
    const actualCategory = actualParams.get('category') || 'all';
    
    console.log('Browse page - Wouter location:', location);
    console.log('Browse page - Actual URL:', actualUrl);
    console.log('Browse page - Actual params:', actualParams.toString());
    console.log('Browse page - Actual category:', actualCategory);
    console.log('Browse page - Setting selectedCategory to:', actualCategory);
    
    setSelectedCategory(actualCategory);
  }, [location]); // Depend on location changes
  
  // Also listen for popstate events to handle manual navigation
  React.useEffect(() => {
    const handlePopState = () => {
      const actualParams = new URLSearchParams(window.location.search);
      const actualCategory = actualParams.get('category') || 'all';
      console.log('PopState event - Setting category to:', actualCategory);
      setSelectedCategory(actualCategory);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    // Update URL to reflect category change
    const newSearchParams = new URLSearchParams(location.split('?')[1] || '');
    if (category === 'all') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', category);
    }
    
    const newUrl = newSearchParams.toString() 
      ? `/browse?${newSearchParams.toString()}` 
      : '/browse';
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

  // Smart category suggestions based on search keywords
  const getCategorySuggestion = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const keywords = {
      electronics: ['mobile', 'phone', 'laptop', 'computer', 'tablet', 'headphones', 'camera', 'tv', 'watch', 'smartphone', 'iphone', 'android', 'macbook', 'dell', 'hp', 'samsung', 'apple', 'sony', 'lg'],
      fashion: ['shirt', 'dress', 'shoes', 'bag', 'watch', 'clothing', 'jeans', 'jacket', 'sneakers', 'handbag', 'jewelry', 'accessories', 'fashion', 'style'],
      home_garden: ['furniture', 'sofa', 'chair', 'table', 'bed', 'lamp', 'decoration', 'kitchen', 'garden', 'plant', 'home', 'decor'],
      sports: ['sports', 'fitness', 'gym', 'exercise', 'football', 'cricket', 'basketball', 'cycling', 'running', 'yoga', 'outdoor']
    };

    for (const [category, categoryKeywords] of Object.entries(keywords)) {
      if (categoryKeywords.some(keyword => lowerQuery.includes(keyword))) {
        return category;
      }
    }
    return null;
  };

  const suggestedCategory = searchQuery ? getCategorySuggestion(searchQuery) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
            <div className="mb-4 md:mb-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Products</h1>
              {searchQuery ? (
                <div className="mb-4">
                  <p className="text-gray-600">Search results for: <span className="font-semibold">"{searchQuery}"</span></p>
                  {suggestedCategory && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        💡 <strong>Smart suggestion:</strong> Based on your search, you might find what you're looking for in the{' '}
                        <button 
                          onClick={() => handleCategoryChange(suggestedCategory)}
                          className="font-semibold underline hover:text-blue-900"
                        >
                          {categories.find(c => c.id === suggestedCategory)?.label}
                        </button> category.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Discover amazing products from verified sellers</p>
              )}
            </div>
            
            {/* Additional search bar on browse page */}
            <div className="md:w-96">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const query = formData.get('search') as string;
                if (query?.trim()) {
                  const params = new URLSearchParams();
                  params.set('search', query.trim());
                  
                  // Auto-detect category from search query
                  const detectedCategory = getCategorySuggestion(query.trim());
                  if (detectedCategory) {
                    params.set('category', detectedCategory);
                  }
                  
                  const newUrl = `/browse?${params.toString()}`;
                  setLocation(newUrl);
                }
              }}>
                <div className="relative">
                  <Input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="pr-10"
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
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

        {searchQuery && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Didn't find what you were looking for?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const newUrl = new URL(window.location.href);
                  newUrl.searchParams.delete('search');
                  window.history.pushState({}, '', newUrl.toString());
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={() => handleCategoryChange('all')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse All Products
              </button>
            </div>
          </div>
        )}
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