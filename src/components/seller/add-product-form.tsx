"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, X, TrendingDown } from "lucide-react";
import { useState } from "react";

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>//
  onProductAdded?: (product: any) => void;
}

export function AddProductForm({ isOpen, onClose, onProductAdded }: AddProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    tags: ""
  });

  const productCategories = [
    "Phone Parts", "Laptop Parts", "Tools", "Accessories", 
    "Batteries", "Charging", "Screens"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newProduct = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      image: "/api/placeholder/300/300",
      category: form.category,
      type: "product" as const,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      // biome-ignore lint/correctness/useParseIntRadix: <explanation>//
      inStock: parseInt(form.stock) > 0
    };
    
    onProductAdded?.(newProduct);
    
    // Reset form and close
    setForm({ name: "", description: "", category: "", price: "", originalPrice: "", stock: "", tags: "" });
    onClose();
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">Add Parts & Tools</h2>
              <p className="text-sm text-muted-foreground">List your products for sale</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium">
                Product Name *
              </Label>
              <Input
                id="productName"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Original Samsung Battery"
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productCategory" className="text-sm font-medium">
                Category *
              </Label>
              <select
                id="productCategory"
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              >
                <option value="">Select category</option>
                {productCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor="productDescription" className="text-sm font-medium">
              Product Description *
            </Label>
            <Textarea
              id="productDescription"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product in detail, including compatibility and warranty..."
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productPrice" className="text-sm font-medium">
                Price (KES) *
              </Label>
              <Input
                id="productPrice"
                type="number"
                value={form.price}
                onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="2800"
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalPrice" className="text-sm font-medium">
                <TrendingDown className="w-4 h-4 inline mr-1 text-amber-600 dark:text-amber-400" />
                Original Price
              </Label>
              <Input
                id="originalPrice"
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="3500"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium">
                Stock Quantity *
              </Label>
              <Input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="50"
                className="h-11"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="productTags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="productTags"
              value={form.tags}
              onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Samsung, Battery, Original (comma separated)"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Add relevant tags to help customers find your product</p>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}