"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/mock-products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SlidersHorizontal } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenFilters?: () => void;
  activeFiltersCount?: number;
}

export function ProductGrid({ 
  products, 
  isLoading = false, 
  onProductClick,
  onAddToCart,
  onOpenFilters,
  activeFiltersCount = 0 
}: ProductGridProps) {

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded-lg w-48 animate-pulse" />
          <div className="h-10 bg-muted rounded-lg w-32 animate-pulse" />
        </div>
        
        {/* Loading Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>//
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-80 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 space-y-6"
      >
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
          <Filter className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-4">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          {onOpenFilters && (
            <Button onClick={onOpenFilters} variant="outline">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Adjust Filters
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {products.length} {products.length === 1 ? 'item' : 'items'} found
          </h2>
          {activeFiltersCount > 0 && (
            <Badge className="bg-primary/10 text-primary">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
            </Badge>
          )}
        </div>
        
        {onOpenFilters && (
          <Button 
            variant="outline" 
            onClick={onOpenFilters}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 bg-primary text-primary-foreground">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </motion.div>

      {/* Product Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                delay: index * 0.05
              }}
              layout
            >
              <ProductCard 
                product={product}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}