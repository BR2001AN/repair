"use client";

// biome-ignore assist/source/organizeImports: <explanation>
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, User, Mail, Phone, MapPin, Briefcase, Shield } from "lucide-react";

interface SellerProfileProps {
  sellerData?: any;
}

export function SellerProfile({ sellerData }: SellerProfileProps) {
  const [profile, setProfile] = useState({
    businessName: sellerData?.businessName || "Tech Repair Kenya",
    email: sellerData?.email || "contact@techrepair.co.ke",
    phone: sellerData?.phone || "+254712345678",
    location: sellerData?.location || "Nairobi, Kenya",
    specialization: sellerData?.specialization || "Phone & Laptop Repair",
    description: sellerData?.description || "Professional device repair services with 5+ years experience. Specialized in Apple and Samsung devices.",
    yearsExperience: sellerData?.yearsExperience || "5"
  });

  const handleSave = () => {
    // Save profile logic here
    console.log("Saving profile:", profile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Seller Profile</h2>
          <p className="text-muted-foreground">Manage your business information</p>
        </div>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profile.businessName}
                    onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={profile.specialization}
                    onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Service Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-green-700 dark:text-green-300">Verified Seller</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Your account is verified</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Member since</span>
                  <span className="font-medium">2023</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response rate</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completion rate</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy & Security
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                Business Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}