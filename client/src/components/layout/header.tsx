import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/IMG-20250628-WA0001_1753533870884.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Array<{text: string, category: string, categoryLabel: string}>>([]);

  // Search suggestion data
  const searchData = [
    // Electronics
    { keywords: ['mobile', 'phone', 'smartphone', 'iphone', 'android', 'samsung'], category: 'electronics', categoryLabel: 'Electronics' },
    { keywords: ['laptop', 'computer', 'macbook', 'dell', 'hp', 'lenovo'], category: 'electronics', categoryLabel: 'Electronics' },
    { keywords: ['tablet', 'ipad', 'tab'], category: 'electronics', categoryLabel: 'Electronics' },
    { keywords: ['headphones', 'earphones', 'airpods', 'headset'], category: 'electronics', categoryLabel: 'Electronics' },
    { keywords: ['camera', 'dslr', 'canon', 'nikon', 'sony'], category: 'electronics', categoryLabel: 'Electronics' },
    { keywords: ['tv', 'television', 'smart tv', 'led', 'oled'], category: 'electronics', categoryLabel: 'Electronics' },
    { keywords: ['watch', 'smartwatch', 'apple watch', 'fitness tracker'], category: 'electronics', categoryLabel: 'Electronics' },
    
    // Fashion
    { keywords: ['shirt', 'tshirt', 't-shirt', 'top'], category: 'fashion', categoryLabel: 'Fashion' },
    { keywords: ['dress', 'gown', 'frock'], category: 'fashion', categoryLabel: 'Fashion' },
    { keywords: ['shoes', 'sneakers', 'boots', 'sandals', 'heels'], category: 'fashion', categoryLabel: 'Fashion' },
    { keywords: ['jeans', 'pants', 'trousers'], category: 'fashion', categoryLabel: 'Fashion' },
    { keywords: ['jacket', 'coat', 'blazer'], category: 'fashion', categoryLabel: 'Fashion' },
    { keywords: ['bag', 'handbag', 'backpack', 'purse'], category: 'fashion', categoryLabel: 'Fashion' },
    { keywords: ['jewelry', 'necklace', 'earrings', 'ring'], category: 'fashion', categoryLabel: 'Fashion' },
    
    // Home & Garden
    { keywords: ['chair', 'sofa', 'couch', 'seating'], category: 'home_garden', categoryLabel: 'Home & Garden' },
    { keywords: ['table', 'dining table', 'coffee table', 'desk'], category: 'home_garden', categoryLabel: 'Home & Garden' },
    { keywords: ['bed', 'mattress', 'pillow'], category: 'home_garden', categoryLabel: 'Home & Garden' },
    { keywords: ['lamp', 'light', 'lighting'], category: 'home_garden', categoryLabel: 'Home & Garden' },
    { keywords: ['kitchen', 'cookware', 'utensils'], category: 'home_garden', categoryLabel: 'Home & Garden' },
    { keywords: ['plant', 'flowers', 'garden', 'pot'], category: 'home_garden', categoryLabel: 'Home & Garden' },
    { keywords: ['decoration', 'decor', 'art', 'frame'], category: 'home_garden', categoryLabel: 'Home & Garden' },
    
    // Sports
    { keywords: ['sports', 'fitness', 'gym', 'exercise'], category: 'sports', categoryLabel: 'Sports' },
    { keywords: ['football', 'soccer', 'cricket', 'basketball'], category: 'sports', categoryLabel: 'Sports' },
    { keywords: ['cycling', 'bicycle', 'bike'], category: 'sports', categoryLabel: 'Sports' },
    { keywords: ['running', 'jogging', 'marathon'], category: 'sports', categoryLabel: 'Sports' },
    { keywords: ['yoga', 'meditation', 'wellness'], category: 'sports', categoryLabel: 'Sports' },
    { keywords: ['outdoor', 'camping', 'hiking'], category: 'sports', categoryLabel: 'Sports' },
    
    // Books
    { keywords: ['book', 'novel', 'textbook', 'comic', 'magazine'], category: 'books', categoryLabel: 'Books' },
    { keywords: ['fiction', 'non-fiction', 'biography', 'history'], category: 'books', categoryLabel: 'Books' },
    { keywords: ['education', 'study', 'learning', 'academic'], category: 'books', categoryLabel: 'Books' }
  ];

  const getSuggestions = (query: string) => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const matches = new Set<{text: string, category: string, categoryLabel: string}>();
    
    searchData.forEach(item => {
      item.keywords.forEach(keyword => {
        if (keyword.includes(lowerQuery) || lowerQuery.includes(keyword)) {
          matches.add({
            text: keyword,
            category: item.category,
            categoryLabel: item.categoryLabel
          });
        }
      });
    });
    
    return Array.from(matches).slice(0, 6); // Limit to 6 suggestions
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(value.length > 0 && newSuggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: {text: string, category: string, categoryLabel: string}) => {
    setLocation(`/browse?category=${suggestion.category}&search=${encodeURIComponent(suggestion.text)}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const navigationItems = [
    { label: "Browse Products", href: "/browse" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="Vinimai" 
                className="h-10 w-auto mr-3 rounded-md"
              />
              <span className="text-gray-600 text-sm hidden sm:block">
                Trusted Exchange Platform
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0 && suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </form>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing before click
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{suggestion.text}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {suggestion.categoryLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {user?.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    {user?.role === 'seller' && (
                      <DropdownMenuItem asChild>
                        <Link href="/products/new">List Product</Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-lg">
                      {item.label}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <Link href="/login" className="text-lg">Login</Link>
                      <Link href="/register" className="text-lg">Sign Up</Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white p-4 relative">
            <form onSubmit={(e) => {
              handleSearch(e);
              setIsMobileSearchOpen(false);
            }}>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    setShowSuggestions(false);
                    setSearchQuery('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>

            {/* Mobile Search Suggestions */}
            {suggestions.length > 0 && searchQuery.length > 0 && (
              <div className="mt-4 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSuggestionClick(suggestion);
                      setIsMobileSearchOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{suggestion.text}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {suggestion.categoryLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
