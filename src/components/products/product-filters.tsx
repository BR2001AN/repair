"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, Wrench, ShoppingBag, Zap, Search } from "lucide-react";

interface ProductFiltersProps {
  filters: {
    category: string;
    type: string;
    priceRange: [number, number];
    minRating: number;
    searchQuery: string;
    inStock: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

const categories = [
  { id: 'all', label: 'All Categories', icon: '🔧' },
  { id: 'phone-repair', label: 'Phone Repair', icon: '📱' },
  { id: 'laptop-repair', label: 'Laptop Repair', icon: '💻' },
  { id: 'appliance-repair', label: 'Appliance Repair', icon: '🏠' },
  { id: 'phone-parts', label: 'Phone Parts', icon: '⚡' },
  { id: 'tools', label: 'Tools & Equipment', icon: '🛠️' }
];

const priceRanges = [
  { label: 'Under KES 1,000', value: [0, 1000] },
  { label: 'KES 1,000 - 3,000', value: [1000, 3000] },
  { label: 'KES 3,000 - 5,000', value: [3000, 5000] },
  { label: 'Over KES 5,000', value: [5000, 10000] }
];

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {/* Search */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search Products
        </Label>
        <Input
          placeholder="What are you looking for?"
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="bg-background/50 backdrop-blur-sm border-2 focus:border-primary/40"
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Category</Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={filters.category === category.id ? "default" : "outline"}
                size="sm"
                className="w-full h-auto py-2 px-2 text-xs justify-start gap-2 font-normal"
                onClick={() => updateFilter('category', category.id)}
              >
                <span className="text-base">{category.icon}</span>
                {category.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Type</Label>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              variant={filters.type === 'all' ? "default" : "outline"}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => updateFilter('type', 'all')}
            >
              <Zap className="w-4 h-4" />
              All
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              variant={filters.type === 'service' ? "default" : "outline"}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => updateFilter('type', 'service')}
            >
              <Wrench className="w-4 h-4" />
              Services
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              variant={filters.type === 'product' ? "default" : "outline"}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => updateFilter('type', 'product')}
            >
              <ShoppingBag className="w-4 h-4" />
              Products
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-foreground">
          Price Range
          <Badge variant="secondary" className="ml-2 text-xs">
            KES {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
          </Badge>
        </Label>
        
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value)}
          max={10000}
          step={100}
          className="my-4"
        />
        
        <div className="grid grid-cols-2 gap-2">
          {priceRanges.map((range, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-auto py-2"
                onClick={() => updateFilter('priceRange', range.value)}
              >
                {range.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Minimum Rating</Label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <motion.div
              key={rating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={filters.minRating === rating ? "default" : "outline"}
                size="sm"
                className={`gap-1 ${rating === 0 ? 'px-3' : 'px-2'}`}
                onClick={() => updateFilter('minRating', rating)}
              >
                {rating > 0 && (
                  <>
                    <Star className={`w-3 h-3 ${filters.minRating === rating ? 'fill-white' : 'fill-primary text-primary'}`} />
                    <span>{rating}+</span>
                  </>
                )}
                {rating === 0 && 'Any Rating'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={filters.inStock}
          onCheckedChange={(checked) => updateFilter('inStock', checked)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <Label
          htmlFor="inStock"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Show only in stock items
        </Label>
      </div>
    </motion.div>
  );
}