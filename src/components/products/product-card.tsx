"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Wrench, Shield, Zap, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/mock-products";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onProductClick, onAddToCart }: ProductCardProps) {
  const isService = product.type === 'service';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.type === 'product') {
      onAddToCart(product);
    }
  };

  const handleBookService = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isService && product.technician?.phone) {
      // Create WhatsApp message
      const message = `Hello ${product.technician.name}! I would like to book your "${product.name}" service. I found you on Repair.ke marketplace.\n\nService Details:\n- ${product.name}\n- KES ${product.price.toLocaleString()}\n- ${product.description}\n\nPlease let me know your availability.`;
      
      // Format phone number for WhatsApp (remove any non-digit characters except +)
      const phoneNumber = product.technician.phone.replace(/[^\d+]/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    onProductClick(product);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isService) {
      handleBookService(e);
    } else {
      handleAddToCart(e);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="h-full"
    >
      <Card 
        className="h-full border shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-background to-muted/5 overflow-hidden group cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-stone-200/50 to-stone-300/30 dark:from-stone-700/50 dark:to-stone-600/30 flex items-center justify-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              {isService ? (
                <Wrench className="w-5 h-5 text-primary" />
              ) : (
                <ShoppingCart className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isVerified && (
              <Badge className="bg-green-500/90 text-white border-0 text-[10px] px-1.5 py-0 h-4">
                <Shield className="w-2.5 h-2.5 mr-0.5" />
                Verified
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                Out of Stock
              </Badge>
            )}
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-background/90 backdrop-blur-sm text-xs font-semibold border-0">
              KES {product.price.toLocaleString()}
            </Badge>
          </div>

          {/* Discount Badge */}
          {product.originalPrice && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 text-[10px] px-1.5 py-0 h-4">
                <Zap className="w-2.5 h-2.5 mr-0.5" />
                Save {((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)}%
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-3 pb-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0 h-5">
              {product.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="text-xs font-medium text-foreground">
                {product.rating}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {product.description}
          </p>

          {/* Quick Info for Services */}
          {isService && product.technician && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="line-clamp-1">{product.technician.name}</span>
              <span>{product.technician.responseTime}</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-[10px] bg-background/50 px-1.5 py-0 h-4"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0">
          <Button 
            size="sm" 
            className="w-full text-xs h-8 shadow-md hover:shadow-primary/20 transition-all duration-300"
            disabled={!product.inStock && !isService}
            onClick={handleButtonClick}
          >
            {isService ? (
              <>
                <MessageCircle className="w-3 h-3 mr-1" />
                Book via WhatsApp
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}