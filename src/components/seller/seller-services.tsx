"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Star, DollarSign, Clock, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AddServiceForm } from "./add-service-form";
import { Smartphone, Laptop, Home, Tablet, Gamepad } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  responseTime: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  tags: string[];
  inStock: boolean;
  technician: {
    name: string;
    specialization: string;
    responseTime: string;
    jobsCompleted: number;
    phone: string;
  };
}

export function SellerServices() {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "iPhone Screen Replacement",
      description: "Professional iPhone screen replacement with genuine parts and 6-month warranty",
      category: "Phone Repair",
      price: 4500,
      originalPrice: 6000,
      responseTime: "< 2 hours",
      rating: 4.8,
      reviewCount: 124,
      isVerified: true,
      tags: ["iPhone", "Screen", "Same Day"],
      inStock: true,
      technician: {
        name: "James Kariuki",
        specialization: "Apple Devices",
        responseTime: "< 2 hours",
        jobsCompleted: 450,
        phone: "+254712345678"
      }
    },
    {
      id: "3",
      name: "Laptop Motherboard Repair",
      description: "Expert motherboard diagnostics and repair for all major laptop brands",
      category: "Laptop Repair",
      price: 3500,
      originalPrice: 5000,
      responseTime: "< 4 hours",
      rating: 4.9,
      reviewCount: 67,
      isVerified: true,
      tags: ["Laptop", "Motherboard", "Diagnostics"],
      inStock: true,
      technician: {
        name: "Sarah Mwangi",
        specialization: "Laptop Hardware",
        responseTime: "< 4 hours",
        jobsCompleted: 289,
        phone: "+254723456789"
      }
    }
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Phone Repair":
        return Smartphone;
      case "Laptop Repair":
        return Laptop;
      case "Tablet Repair":
        return Tablet;
      case "Appliance Repair":
        return Home;
      case "Console Repair":
        return Gamepad;
      default:
        return Smartphone;
    }
  };

  const toggleServiceStatus = (id: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id 
          ? { ...service, inStock: !service.inStock }
          : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
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
            <h2 className="text-2xl font-bold text-foreground">Repair Services</h2>
            <p className="text-muted-foreground">Manage your device repair services</p>
          </div>
          <Button onClick={() => setShowServiceForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6">
          {services.map((service) => {
            const CategoryIcon = getCategoryIcon(service.category);
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <CategoryIcon className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {service.category}
                          </Badge>
                          {service.isVerified && (
                            <Badge className="bg-green-500/90 text-white border-0 text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">KES {service.price.toLocaleString()}</span>
                        {service.originalPrice && (
                          <span className="text-muted-foreground line-through text-xs">
                            KES {service.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{service.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-purple-600" />
                        <span>{service.technician.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleServiceStatus(service.id)}
                    >
                      {service.inStock ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteService(service.id)}
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

      <AddServiceForm 
        isOpen={showServiceForm}
        onClose={() => setShowServiceForm(false)}
      />
    </>
  );
}