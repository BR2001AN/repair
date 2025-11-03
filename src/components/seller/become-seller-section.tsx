"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft,
  User,
  Building,
  Shield,
  CheckCircle2,
  CreditCard,
  Store,
  Wrench,
  Package,
  Star,
  HardHat,
  ArrowRight,
  MapPin,
  Users,
  BadgeCheck,
  // biome-ignore lint/correctness/noUnusedImports: <explanation>//
  Phone
} from "lucide-react";

interface SellerSignUpData {
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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phoneNumber: string;
}

function PaymentModal({ isOpen, onClose, onSuccess, phoneNumber }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumberForPayment, setPhoneNumberForPayment] = useState(phoneNumber);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      onSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-700"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Complete Registration</h3>
          <p className="text-gray-400">Pay one-time registration fee with M-Pesa</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">KES 200</div>
            <div className="text-sm text-gray-400 mt-1">One-time registration fee</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentPhone" className="text-white text-sm font-medium">
              M-Pesa Phone Number *
            </Label>
            <Input
              id="paymentPhone"
              type="tel"
              value={phoneNumberForPayment}
              onChange={(e) => setPhoneNumberForPayment(e.target.value)}
              placeholder="07XX XXX XXX"
              className="h-11 bg-gray-700 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400">
              You will receive an M-Pesa prompt on this number
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 border-gray-600 text-white hover:bg-gray-700"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing || !phoneNumberForPayment}
            className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay KES 200
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function BecomeASellerSection({
  onBackToHome,
  onSignUpComplete
}: {
  onBackToHome: () => void;
  onSignUpComplete?: (sellerData: SellerSignUpData) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [formData, setFormData] = useState<SellerSignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "individual",
    businessRegistration: "",
    serviceType: "repair",
    county: "",
    town: "",
    address: "",
  });

  const steps = [
    { number: 1, title: "Personal Info", description: "Your details", icon: User },
    { number: 2, title: "Business Info", description: "Business details", icon: Building },
    { number: 3, title: "Service Type", description: "What you offer", icon: Wrench },
    { number: 4, title: "Location", description: "Your location", icon: MapPin },
  ];

  const kenyanCounties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale",
    "Garissa", "Kakamega", "Embu", "Nyeri", "Machakos", "Meru", "Kiambu", "Kilifi"
  ];

  const serviceTypes = [
    {
      value: "repair",
      label: "Repair Services",
      description: "Offer repair and maintenance services",
      icon: Wrench
    },
    {
      value: "product", 
      label: "Product Sales",
      description: "Sell automotive parts and accessories",
      icon: Package
    },
    {
      value: "both",
      label: "Both Services & Products",
      description: "Offer both repairs and sell products",
      icon: Store
    }
  ];

  const sellerBenefits = [
    {
      icon: Users,
      title: "Access Thousands of Customers",
      description: "Get discovered by active customers searching for your services",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: BadgeCheck,
      title: "Verified Trust Badge",
      description: "Build credibility and stand out with our seller verification",
      bgColor: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      icon: CreditCard,
      title: "Secure Payment Processing",
      description: "M-Pesa payments with instant transfers to your account",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
    }
  ];

  const handleInputChange = (field: keyof SellerSignUpData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceed = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBackToHome();
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    onSignUpComplete?.(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.businessName && formData.businessType;
      case 3:
        return formData.serviceType;
      case 4:
        return formData.county && formData.town && formData.address;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-12 w-12 rounded-xl shadow-lg bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/70 border border-gray-700 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30"
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <HardHat className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Become a Seller
              </h1>
              <p className="text-gray-400 text-lg">Join Kenya's fastest-growing repair platform</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Enhanced Progress Steps */}
            <motion.div
              className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap justify-between items-center gap-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center gap-3 flex-1 min-w-[150px]">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                        currentStep >= step.number
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-500 shadow-lg shadow-amber-500/25'
                          : 'border-gray-600 bg-gray-700/50 text-gray-400'
                      }`}>
                        {currentStep > step.number ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <step.icon className="w-4 h-4" />
                        )}
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                          currentStep >= step.number 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm mb-1 ${
                          currentStep >= step.number 
                            ? 'text-white' 
                            : 'text-gray-400'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden lg:block h-0.5 flex-1 max-w-12 mx-1 transition-all duration-500 ${
                        currentStep > step.number 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                          : 'bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                      <p className="text-sm text-gray-400">Tell us about yourself</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'firstName', label: 'First Name *', placeholder: 'Enter your first name' },
                      { id: 'lastName', label: 'Last Name *', placeholder: 'Enter your last name' },
                      { id: 'email', label: 'Email Address *', placeholder: 'your.email@example.com', type: 'email' },
                      { id: 'phone', label: 'Phone Number *', placeholder: '07XX XXX XXX', type: 'tel' }
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <Label htmlFor={field.id} className="text-sm font-medium text-white">
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          // biome-ignore lint/suspicious/noExplicitAny: <explanation>//
                          type={field.type as any}
                          value={formData[field.id as keyof SellerSignUpData] as string}
                          onChange={(e) => handleInputChange(field.id as keyof SellerSignUpData, e.target.value)}
                          placeholder={field.placeholder}
                          className="h-11 shadow-sm bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Business Information</h3>
                      <p className="text-sm text-gray-400">Tell us about your business</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="businessName" className="text-sm font-medium text-white">
                        Business Name *
                      </Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Enter your business name"
                        className="h-11 shadow-sm bg-gray-700 border-gray-600 text-white"
                      />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-medium text-white">Business Type *</Label>
                      <RadioGroup 
                        value={formData.businessType} 
                        onValueChange={(value: "individual" | "company") => handleInputChange('businessType', value)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {[
                          { value: "individual", label: "Individual", description: "Sole proprietor or freelancer", icon: User },
                          { value: "company", label: "Registered Company", description: "Limited company or partnership", icon: Building }
                        ].map((type) => (
                          <Label key={type.value} htmlFor={type.value} className="cursor-pointer">
                            <motion.div
                              whileHover={{ y: -2, scale: 1.01 }}
                              className={`border-2 rounded-xl p-4 transition-all h-full ${
                                formData.businessType === type.value 
                                  ? "border-amber-500 bg-amber-500/10 shadow-md" 
                                  : "border-gray-600 hover:border-amber-500/50 shadow-sm bg-gray-700"
                              }`}
                            >
                              <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                              <div className="flex items-start gap-3">
                                <type.icon className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm text-white">{type.label}</div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Label>
                        ))}
                      </RadioGroup>
                    </motion.div>

                    {formData.businessType === "company" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="businessRegistration" className="text-sm font-medium text-white">
                          Business Registration Number
                        </Label>
                        <Input
                          id="businessRegistration"
                          value={formData.businessRegistration}
                          onChange={(e) => handleInputChange('businessRegistration', e.target.value)}
                          placeholder="Enter registration number"
                          className="h-11 shadow-sm bg-gray-700 border-gray-600 text-white"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Service Type */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Service Type</h3>
                      <p className="text-sm text-gray-400">What will you offer?</p>
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <Label className="text-sm font-medium text-white">Select Your Service Type *</Label>
                    <RadioGroup 
                      value={formData.serviceType} 
                      onValueChange={(value: "repair" | "product" | "both") => handleInputChange('serviceType', value)}
                      className="grid grid-cols-1 gap-4"
                    >
                      {serviceTypes.map((service, index) => (
                        <Label key={service.value} htmlFor={service.value} className="cursor-pointer">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2, scale: 1.01 }}
                            className={`border-2 rounded-xl p-4 transition-all ${
                              formData.serviceType === service.value 
                                ? "border-amber-500 bg-amber-500/10 shadow-md" 
                                : "border-gray-600 hover:border-amber-500/50 shadow-sm bg-gray-700"
                            }`}
                          >
                            <RadioGroupItem value={service.value} id={service.value} className="sr-only" />
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <service.icon className="w-6 h-6 text-amber-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-base text-white">{service.label}</div>
                                <div className="text-sm text-gray-400 mt-1">
                                  {service.description}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 4: Location */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Location Information</h3>
                      <p className="text-sm text-gray-400">Where are you located?</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="county" className="text-sm font-medium text-white">
                        County *
                      </Label>
                      <select
                        id="county"
                        value={formData.county}
                        onChange={(e) => handleInputChange('county', e.target.value)}
                        className="w-full h-11 px-3 rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="">Select County</option>
                        {kenyanCounties.map(county => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="town" className="text-sm font-medium text-white">
                        Town/City *
                      </Label>
                      <Input
                        id="town"
                        value={formData.town}
                        onChange={(e) => handleInputChange('town', e.target.value)}
                        placeholder="Enter your town or city"
                        className="h-11 shadow-sm bg-gray-700 border-gray-600 text-white"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="md:col-span-2 space-y-2"
                    >
                      <Label htmlFor="address" className="text-sm font-medium text-white">
                        Street Address *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your street address"
                        className="h-11 shadow-sm bg-gray-700 border-gray-600 text-white"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Compact Sidebar with Scroll */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-700/50 h-[calc(100vh-200px)] flex flex-col"
            >
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25"
                  >
                    <Star className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Seller Benefits
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Grow your business with us
                  </p>
                </div>
                
                {/* Compact Benefits */}
                <div className="space-y-4 mb-6">
                  {sellerBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      className="group relative overflow-hidden rounded-lg p-4 bg-gray-700/30 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${benefit.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <benefit.icon className={`w-4 h-4 ${benefit.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm mb-1 leading-tight">
                            {benefit.title}
                          </div>
                          <div className="text-xs text-gray-400 leading-relaxed">
                            {benefit.description}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pricing Card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 border border-amber-500/20 mb-6"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-300 mb-1">
                      KES 200
                    </div>
                    <div className="text-xs text-amber-200/80 font-medium">
                      One-time registration
                    </div>
                    <div className="text-xs text-amber-200/60 mt-1">
                      No hidden charges
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Fixed Bottom Section */}
              <div className="flex-shrink-0 pt-4 border-t border-gray-700/50">
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mb-4"
                >
                  <Button
                    className="w-full h-12 text-sm font-bold shadow-lg hover:shadow-amber-500/20 transition-all duration-300 group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl border border-amber-400/20"
                    onClick={handleProceed}
                    disabled={!isStepValid()}
                  >
                    {currentStep === 4 ? (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Security Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-2 p-2 bg-gray-700/30 rounded-lg border border-gray-600/30"
                >
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-gray-400 font-medium">
                    Secure & Encrypted
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30 text-center mt-4"
            >
              <div className="space-y-2">
                <div className="text-white font-semibold text-sm">
                  500+ Kenyan Sellers
                </div>
                <div className="flex justify-center items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span>4.9/5</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full" />
                  <div>97% Success</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Modal - M-Pesa Only */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        phoneNumber={formData.phone}
      />
    </div>
  );
}