"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Shield, Wrench, ShoppingCart, X, Zap, MessageCircle, CheckCircle, User, Briefcase, MapPin } from "lucide-react";
import type { Product } from "@/lib/mock-products";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;
  
  const isService = product.type === 'service';

  const handleAddToCart = () => {
    if (product.type === 'product' && product.inStock) {
      onAddToCart(product);
      onClose();
    }
  };

  const handleBookService = () => {
    if (isService && product.technician?.phone) {
      const message = `Hello ${product.technician.name}! I would like to book your "${product.name}" service from Repair.ke.\n\nService: ${product.name}\nPrice: KES ${product.price.toLocaleString()}\nCategory: ${product.category}\n\nPlease let me know your availability.`;
      const phoneNumber = product.technician.phone.replace(/[^\d+]/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(0)}k reviews`;
    return `${count} reviews`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-stone-950 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {product.name} - {product.category} - KES {product.price.toLocaleString()} - Repair.ke
          </DialogTitle>
        </DialogHeader>
        
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-50 h-8 w-8 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border shadow-lg hover:bg-white dark:hover:bg-stone-900 hover:scale-110 transition-all duration-200"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
          <VisuallyHidden>Close dialog</VisuallyHidden>
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col"
        >
          {/* Header Section with Image */}
          <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              {isService ? (
                <Wrench className="w-8 h-8 text-primary" />
              ) : (
                <ShoppingCart className="w-8 h-8 text-primary" />
              )}
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="text-xs font-medium bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm">
                {product.category}
              </Badge>
            </div>

            {/* Verification Badge */}
            {product.isVerified && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs">
                <Shield className="w-3 h-3" />
                Verified
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Title and Basic Info */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{product.rating}</span>
                  <span>/5</span>
                </div>
                <span>•</span>
                <span>{formatReviewCount(product.reviewCount)}</span>
                {!product.inStock && (
                  <>
                    <span>•</span>
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Technician Info for Services */}
            {isService && product.technician && (
              <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{product.technician.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-primary/5">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {product.technician.jobsCompleted}+ jobs
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {product.technician.responseTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Nationwide
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs bg-stone-50 dark:bg-stone-800/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Quality Assurance */}
            {product.isVerified && (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Quality assured by Repair.ke</span>
              </div>
            )}

            {/* Price and Action Section */}
            <div className="space-y-3 pt-2">
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  KES {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      KES {product.originalPrice.toLocaleString()}
                    </span>
                    <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Save {((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Action Button */}
              <Button 
                className={`w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isService 
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20 hover:shadow-green-500/30' 
                    : 'bg-primary hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/30'
                } ${(!product.inStock && !isService) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!product.inStock && !isService}
                onClick={isService ? handleBookService : handleAddToCart}
              >
                {isService ? (
                  <>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book via WhatsApp
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Secure
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  24/7 Support
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {isService ? 'On-site' : 'Delivery'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}