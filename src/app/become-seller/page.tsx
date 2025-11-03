"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { useState, useEffect } from "react";
import { BecomeASellerSection } from "@/components/seller/become-seller-section";
import { SellerDashboard } from "@/components/seller/seller-dashboard";

interface SellerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: "individual" | "company";
  businessRegistration?: string;
  serviceType: "repair" | "product" | "both";
  county: string;
  town: string;
  address: string;
}

export default function BecomeSellerPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [sellerData, setSellerData] = useState<SellerData | null>(null);

  const handleBackToHome = () => {
    // Navigate back to home page
    window.history.back();
  };

  const handleSignUpComplete = (sellerData: SellerData) => {
    console.log("Seller registered successfully:", sellerData);
    setSellerData(sellerData);
    setIsRegistered(true);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('sellerData', JSON.stringify(sellerData));
      localStorage.setItem('isSellerRegistered', 'true');
    }
  };

  const handleBackToRegistration = () => {
    setIsRegistered(false);
    setSellerData(null);
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sellerData');
      localStorage.removeItem('isSellerRegistered');
    }
  };

  // Check if user is already registered (on component mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRegistration = localStorage.getItem('isSellerRegistered');
      if (storedRegistration === 'true') {
        setIsRegistered(true);
        const storedSellerData = localStorage.getItem('sellerData');
        if (storedSellerData) {
          setSellerData(JSON.parse(storedSellerData));
        }
      }
    }
  }, []);

  if (isRegistered && sellerData) {
    return (
      <SellerDashboard 
        sellerData={sellerData}
        onBackToHome={handleBackToHome}
        onBackToRegistration={handleBackToRegistration}
      />
    );
  }

  return (
    <BecomeASellerSection
      onBackToHome={handleBackToHome}
      onSignUpComplete={handleSignUpComplete}
    />
  );
}