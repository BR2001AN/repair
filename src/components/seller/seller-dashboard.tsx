"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  ArrowLeft,
  LogOut,
  Star
} from "lucide-react";
import { SellerOverview } from  "./seller-overview";
import { SellerServices } from "./seller-services";
import { SellerProducts } from "./seller-products";
import { SellerOrders } from "./seller-orders";
import { SellerProfile } from "./seller-profile";

interface SellerDashboardProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>//
  sellerData?: any;
  onBackToHome?: () => void;
  onBackToRegistration?: () => void;
}

export function SellerDashboard({
  sellerData,
  onBackToHome,
  onBackToRegistration
}: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "products" | "orders" | "profile">("overview");

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sellerData');
      localStorage.removeItem('isSellerRegistered');
    }
    if (onBackToRegistration) {
      onBackToRegistration();
    }
  };

  const navigationItems = [
    { id: "overview", label: "Overview", icon: Store },
    { id: "services", label: "Repair Services", icon: Store },
    { id: "products", label: "Parts & Tools", icon: Store },
    { id: "orders", label: "Bookings", icon: Store },
    { id: "profile", label: "Profile", icon: Store }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <SellerOverview sellerData={sellerData} />;
      case "services":
        return <SellerServices />;
      case "products":
        return <SellerProducts />;
      case "orders":
        return <SellerOrders />;
      case "profile":
        return <SellerProfile sellerData={sellerData} />;
      default:
        return <SellerOverview sellerData={sellerData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 dark:from-stone-950 dark:to-amber-950/5">
      {/* Header */}
      <motion.header
        className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBackToHome && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBackToHome}
                  className="h-9 w-9 rounded-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Store className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Repair<span className="text-red-500">.ke</span> Seller Hub
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {sellerData?.businessName || sellerData?.firstName || "Seller"}!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-primary text-primary" />
                4.7/5
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Switch Account
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>//
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === item.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}