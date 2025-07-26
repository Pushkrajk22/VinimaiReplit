import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  category?: string;
  search?: string;
  onMakeOffer?: (product: Product) => void;
}

export function ProductGrid({ category, search, onMakeOffer }: ProductGridProps) {
  const [page, setPage] = React.useState(0);
  const limit = 20;

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products', { category, search, limit, offset: page * limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      params.append('limit', limit.toString());
      params.append('offset', (page * limit).toString());

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json() as Product[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load products. Please try again.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
        {search && (
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search terms or browse all products.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onMakeOffer={onMakeOffer}
          />
        ))}
      </div>

      {products.length === limit && (
        <div className="text-center">
          <Button
            onClick={() => setPage(prev => prev + 1)}
            variant="outline"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
