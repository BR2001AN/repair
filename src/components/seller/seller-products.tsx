"use client";
// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Star, DollarSign, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AddProductForm } from "./add-product-form";
import { Smartphone, Laptop, Wrench, Battery, Zap } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  type: 'product';
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  tags: string[];
  inStock: boolean;
  stock: number;
  image: string;
}

export function SellerProducts() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: "2",
      name: "Original Samsung Battery",
      description: "Genuine Samsung battery with 1-year warranty. Compatible with S21, S22, S23 series",
      price: 2800,
      category: "Phone Parts",
      type: 'product',
      rating: 4.6,
      reviewCount: 89,
      isVerified: true,
      tags: ["Samsung", "Battery", "Original"],
      inStock: true,
      stock: 15,
      image: "/api/placeholder/300/300"
    },
    {
      id: "4",
      name: "Professional Repair Toolkit",
      description: "64-piece precision screwdriver set with magnetic mat and spudgers",
      price: 3200,
      category: "Tools",
      type: 'product',
      rating: 4.7,
      reviewCount: 156,
      isVerified: true,
      tags: ["Tools", "Screwdriver", "Professional"],
      inStock: true,
      stock: 25,
      image: "/api/placeholder/300/300"
    }
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Phone Parts":
        return Smartphone;
      case "Laptop Parts":
        return Laptop;
      case "Tools":
        return Wrench;
      case "Batteries":
        return Battery;
      case "Charging":
        return Zap;
      default:
        return Smartphone;
    }
  };

  const toggleProductStatus = (id: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, inStock: !product.inStock }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Parts & Tools</h2>
            <p className="text-muted-foreground">Manage your repair parts and tools</p>
          </div>
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => {
            const CategoryIcon = getCategoryIcon(product.category);
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {product.category}
                            </Badge>
                            {product.isVerified && (
                              <Badge className="bg-green-500/90 text-white border-0 text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">KES {product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through text-xs">
                            KES {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${product.stock < 5 ? "text-red-600" : "text-green-600"}`}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleProductStatus(product.id)}
                    >
                      {product.inStock ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      <AddProductForm
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
      />
    </>
  );
}