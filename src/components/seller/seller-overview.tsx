"use client";
// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Wrench, Package, Star, Smartphone, Laptop, Home, Tablet } from "lucide-react";
import { useState } from "react";
import { AddServiceForm } from "./add-service-form";
import { AddProductForm } from "./add-product-form";

interface SellerOverviewProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>//
  sellerData?: any;
}

// biome-ignore lint/correctness/noEmptyPattern: <explanation>//
export function SellerOverview({ }: SellerOverviewProps) {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const stats = [
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: "KES 245,800",
      description: "Lifetime earnings"
    },
    {
      icon: Wrench,
      label: "Active Services",
      value: "3",
      description: "Services listed"
    },
    {
      icon: Package,
      label: "Active Products",
      value: "3",
      description: "Products listed"
    },
    {
      icon: Star,
      label: "Seller Rating",
      value: "4.7",
      description: "657 reviews"
    }
  ];

  const recentServices = [
    {
      id: "1",
      name: "iPhone Screen Replacement",
      price: 4500,
      category: "Phone Repair",
      inStock: true
    },
    {
      id: "3",
      name: "Laptop Motherboard Repair",
      price: 3500,
      category: "Laptop Repair",
      inStock: true
    },
    {
      id: "7",
      name: "Home Appliance Repair",
      price: 2500,
      category: "Appliance Repair",
      inStock: true
    }
  ];

  const recentProducts = [
    {
      id: "2",
      name: "Original Samsung Battery",
      price: 2800,
      category: "Phone Parts",
      stock: 15
    },
    {
      id: "4",
      name: "Professional Repair Toolkit",
      price: 3200,
      category: "Tools",
      stock: 25
    },
    {
      id: "6",
      name: "Wireless Charging Coil",
      price: 1200,
      category: "Phone Parts",
      stock: 8
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Phone Repair":
      case "Phone Parts":
        return Smartphone;
      case "Laptop Repair":
      case "Laptop Parts":
        return Laptop;
      case "Tablet Repair":
        return Tablet;
      case "Appliance Repair":
        return Home;
      default:
        return Package;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your repair business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowServiceForm(true)}
                className="h-16 justify-start"
                variant="outline"
              >
                <Wrench className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Add Repair Service</div>
                  <div className="text-xs text-muted-foreground">Offer device repair services</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => setShowProductForm(true)}
                className="h-16 justify-start"
                variant="outline"
              >
                <Package className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Add Parts/Tools</div>
                  <div className="text-xs text-muted-foreground">Sell repair parts & tools</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Recent Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentServices.map((service) => {
                  const CategoryIcon = getCategoryIcon(service.category);
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CategoryIcon className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{service.name}</div>
                          <div className="text-xs text-muted-foreground">KES {service.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        service.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {service.inStock ? "Active" : "Inactive"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Recent Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => {
                  const CategoryIcon = getCategoryIcon(product.category);
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CategoryIcon className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground">KES {product.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        product.stock > 5 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {product.stock} left
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Forms */}
      <AddServiceForm 
        isOpen={showServiceForm}
        onClose={() => setShowServiceForm(false)}
      />

      <AddProductForm
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
      />
    </>
  );
}