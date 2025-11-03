"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, Plus, X, User, Clock, Phone } from "lucide-react";
import { useState } from "react";

interface AddServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>//
  onServiceAdded?: (service: any) => void;
}

export function AddServiceForm({ isOpen, onClose, onServiceAdded }: AddServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    responseTime: "",
    tags: "",
    technicianName: "",
    specialization: "",
    phone: ""
  });

  const serviceCategories = [
    "Phone Repair", "Laptop Repair", "Tablet Repair", "Appliance Repair", 
    "Console Repair", "Smartwatch Repair", "Camera Repair"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newService = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      image: "/api/placeholder/300/300",
      category: form.category,
      type: "service" as const,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      inStock: true,
      technician: {
        name: form.technicianName,
        specialization: form.specialization,
        responseTime: form.responseTime,
        jobsCompleted: 0,
        phone: form.phone
      }
    };
    
    onServiceAdded?.(newService);
    
    // Reset form and close
    setForm({ 
      name: "", description: "", category: "", price: "", originalPrice: "", 
      responseTime: "", tags: "", technicianName: "", specialization: "", phone: "" 
    });
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
              <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">Add Repair Service</h2>
              <p className="text-sm text-muted-foreground">List your repair service for customers</p>
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
          {/* Service Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName" className="text-sm font-medium">
                Service Name *
              </Label>
              <Input
                id="serviceName"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., iPhone Screen Replacement"
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceCategory" className="text-sm font-medium">
                Category *
              </Label>
              <select
                id="serviceCategory"
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              >
                <option value="">Select category</option>
                {serviceCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Description */}
          <div className="space-y-2">
            <Label htmlFor="serviceDescription" className="text-sm font-medium">
              Service Description *
            </Label>
            <Textarea
              id="serviceDescription"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your service in detail, including warranty information..."
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servicePrice" className="text-sm font-medium">
                Price (KES) *
              </Label>
              <Input
                id="servicePrice"
                type="number"
                value={form.price}
                onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="4500"
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalPrice" className="text-sm font-medium">
                Original Price (KES)
              </Label>
              <Input
                id="originalPrice"
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="6000"
                className="h-11"
              />
            </div>
          </div>

          {/* Technician Information */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-card-foreground">Technician Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technicianName" className="text-sm font-medium">
                  Technician Name *
                </Label>
                <Input
                  id="technicianName"
                  value={form.technicianName}
                  onChange={(e) => setForm(prev => ({ ...prev, technicianName: e.target.value }))}
                  placeholder="James Kariuki"
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium">
                  Specialization *
                </Label>
                <Input
                  id="specialization"
                  value={form.specialization}
                  onChange={(e) => setForm(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Apple Devices"
                  className="h-11"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="responseTime" className="text-sm font-medium">
                  <Clock className="w-4 h-4 inline mr-1 text-amber-600 dark:text-amber-400" />
                  Response Time *
                </Label>
                <Input
                  id="responseTime"
                  value={form.responseTime}
                  onChange={(e) => setForm(prev => ({ ...prev, responseTime: e.target.value }))}
                  placeholder="< 2 hours"
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="technicianPhone" className="text-sm font-medium">
                  <Phone className="w-4 h-4 inline mr-1 text-amber-600 dark:text-amber-400" />
                  Phone Number *
                </Label>
                <Input
                  id="technicianPhone"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254712345678"
                  className="h-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="serviceTags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="serviceTags"
              value={form.tags}
              onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="iPhone, Screen, Same Day (comma separated)"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Add relevant tags to help customers find your service</p>
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
                  Adding Service...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}