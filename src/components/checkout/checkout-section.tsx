"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Shield, 
  Phone, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Store,
  ChevronDown,
  Info
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Order History Types
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  orderType: 'product' | 'service' | 'mixed';
  createdAt: string;
  pickupLocation?: string;
  technician?: {
    name: string;
    phone: string;
    specialization: string;
  };
}

interface CheckoutSectionProps {
  cartItems: CartItem[];
  cartTotal: number;
  cartItemsCount: number;
  onBackToCart: () => void;
  onCheckoutComplete?: () => void;
  onOrderCreated?: (order: Order) => void; // New prop for order creation
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Store locations data
const STORE_LOCATIONS = [
  { id: "nairobi-cbd", name: "Nairobi CBD", address: "Kenyatta Avenue, Nairobi Central" },
  { id: "westlands", name: "Westlands", address: "Westlands Mall, 2nd Floor" },
  { id: "karen", name: "Karen", address: "Karen Hub, Karen Road" },
  { id: "thika", name: "Thika", address: "Thika Road Mall, Ground Floor" },
  { id: "mombasa", name: "Mombasa", address: "Nyali Center, Mombasa" },
  { id: "kisumu", name: "Kisumu", address: "West End Mall, Kisumu" },
];

export function CheckoutSection({
  cartItems,
  cartTotal,
  cartItemsCount,
  onBackToCart,
  onCheckoutComplete,
  onOrderCreated, // New prop
  user
}: CheckoutSectionProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [selectedStore, setSelectedStore] = useState(STORE_LOCATIONS[0].id);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);

  // Calculate store pickup fee (20% of cart total)
  const pickupFee = Math.round(cartTotal * 0.2);
  const serviceFee = 50;
  const totalAmount = cartTotal + pickupFee + serviceFee;

  const steps = [
    { number: 1, title: "Pickup", description: "Store location" },
    { number: 2, title: "Payment", description: "Payment method" },
    { number: 3, title: "Confirm", description: "Review order" },
  ];

  const selectedStoreInfo = STORE_LOCATIONS.find(store => store.id === selectedStore);

  // Function to create a new order
  const createOrder = (): Order => {
    // Determine order type based on cart items
    const hasProducts = cartItems.length > 0;
    const orderType: Order['orderType'] = hasProducts ? 'product' : 'mixed';
    
    return {
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: 'product' as const, // Since we're only handling products in checkout
        image: item.image
      })),
      total: totalAmount,
      status: 'pending',
      orderType: orderType,
      createdAt: new Date().toISOString(),
      pickupLocation: selectedStoreInfo?.name
    };
  };

  const handleMpesaPayment = async () => {
    setIsProcessing(true);
    
    // Simulate MPesa payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would integrate with actual MPesa SDK
      console.log("Initiating MPesa payment for:", phoneNumber, totalAmount);
      
      // Create order after successful payment
      const newOrder = createOrder();
      
      // Notify parent component about the new order
      onOrderCreated?.(newOrder);
      
      // Simulate successful payment
      setIsComplete(true);
      setIsProcessing(false);
      
      // Call completion callback after a delay
      setTimeout(() => {
        onCheckoutComplete?.();
      }, 2000);
      
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order for cash payment
      const newOrder = createOrder();
      
      // Notify parent component about the new order
      onOrderCreated?.(newOrder);
      
      setIsComplete(true);
      setIsProcessing(false);
      
      setTimeout(() => {
        onCheckoutComplete?.();
      }, 2000);
      
    } catch (error) {
      console.error("Order creation failed:", error);
      setIsProcessing(false);
    }
  };

  const handleProceed = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      if (paymentMethod === "mpesa") {
        handleMpesaPayment();
      } else {
        handleCashPayment();
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      onBackToCart();
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h2>
          <p className="text-muted-foreground mb-4">
            Your order has been confirmed and is ready for pickup.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-700">Pickup Location</span>
            </div>
            <div className="text-sm text-left">
              <div className="font-medium">{selectedStoreInfo?.name}</div>
              <div className="text-muted-foreground">{selectedStoreInfo?.address}</div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Order Total</span>
              <span className="text-lg font-bold text-green-600">
                KES {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              A confirmation email has been sent to {user?.email}
            </div>
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onCheckoutComplete}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 dark:from-stone-950 dark:to-amber-950/5 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header - More Compact */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
            <p className="text-sm text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Progress Steps - More Compact */}
            <div className="bg-background rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      activeStep >= step.number
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground'
                    }`}>
                      {activeStep > step.number ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="font-semibold text-sm">{step.number}</span>
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div className={`text-sm font-medium ${
                        activeStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block h-0.5 w-8 mx-2 ${
                        activeStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Store Pickup Location */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background rounded-lg p-5 shadow-sm border space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Pickup Location
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Store pickup only • 20% pickup fee applies
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="store-select" className="text-sm font-medium">
                      Select Store
                    </Label>
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="w-full h-11 justify-between text-left font-normal"
                        onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium text-sm">{selectedStoreInfo?.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {selectedStoreInfo?.address}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isStoreDropdownOpen ? 'rotate-180' : ''}`} />
                      </Button>
                      
                      {isStoreDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                        >
                          {STORE_LOCATIONS.map((store) => (
                            <button
                              key={store.id}
                              type="button"
                              className={`w-full p-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0 ${
                                selectedStore === store.id ? 'bg-primary/5 border-primary/20' : ''
                              }`}
                              onClick={() => {
                                setSelectedStore(store.id);
                                setIsStoreDropdownOpen(false);
                              }}
                            >
                              <div className="font-medium text-sm">{store.name}</div>
                              <div className="text-xs text-muted-foreground">{store.address}</div>
                              <div className="text-xs text-green-600 font-medium mt-1">
                                ✓ Available for pickup
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Store Pickup Information - More Compact */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-foreground text-sm mb-2">Pickup Info</h4>
                    <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                      <li>• Bring order confirmation and ID</li>
                      <li>• Store hours: 9 AM - 6 PM (Mon-Sat)</li>
                      <li>• Orders held for 3 business days</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background rounded-lg p-5 shadow-sm border space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </h3>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    {/* MPesa Option */}
                    <Label htmlFor="mpesa" className="cursor-pointer block">
                      <div className={`border rounded-lg p-3 transition-all ${
                        paymentMethod === "mpesa" 
                          ? "border-primary bg-primary/5" 
                          : "border-muted-foreground/30 hover:border-primary/50"
                      }`}>
                        <RadioGroupItem value="mpesa" id="mpesa" className="sr-only" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">MPesa</div>
                              <div className="text-xs text-muted-foreground">
                                Pay via MPesa - Fast & Secure
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Recommended
                          </Badge>
                        </div>
                      </div>
                    </Label>

                    {/* Cash on Pickup Option */}
                    <Label htmlFor="cash" className="cursor-pointer block">
                      <div className={`border rounded-lg p-3 transition-all ${
                        paymentMethod === "cash" 
                          ? "border-primary bg-primary/5" 
                          : "border-muted-foreground/30 hover:border-primary/50"
                      }`}>
                        <RadioGroupItem value="cash" id="cash" className="sr-only" />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">Cash on Pickup</div>
                            <div className="text-xs text-muted-foreground">
                              Pay when you pickup your order
                            </div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "mpesa" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 pt-3 border-t"
                  >
                    <h4 className="font-semibold text-foreground text-sm">MPesa Details</h4>
                    <div className="space-y-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-medium">Phone Number</Label>
                        <Input 
                          id="phone"
                          type="tel"
                          placeholder="07XX XXX XXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="h-10 text-base"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter your MPesa registered phone number
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: Order Review */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background rounded-lg p-5 shadow-sm border space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Order Review</h3>
                
                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">Items ({cartItemsCount})</h4>
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-xs">
                              {item.quantity}x
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm truncate">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              KES {item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-primary whitespace-nowrap ml-3">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pickup Information */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">Pickup Location</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground text-sm">
                          {selectedStoreInfo?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedStoreInfo?.address}
                        </div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Store Hours: 9:00 AM - 6:00 PM (Mon-Sat)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-primary/5 rounded p-3 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground text-sm">Secure Payment</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your payment information is encrypted and secure. We do not store your MPesa PIN or personal payment details.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar - More Compact */}
          <div className="space-y-4">
            <div className="bg-background rounded-lg p-5 shadow-sm border sticky top-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-3">Order Summary</h3>
              
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="font-medium text-foreground text-sm truncate">
                        {item.quantity}x {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        KES {item.price.toLocaleString()} each
                      </div>
                    </div>
                    <span className="font-semibold whitespace-nowrap text-sm">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pickup Fee (20%)</span>
                  <span className="font-medium">KES {pickupFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">KES {serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full mt-4 h-11 text-base shadow-lg hover:shadow-primary/20"
                onClick={handleProceed}
                disabled={isProcessing || (paymentMethod === "mpesa" && !phoneNumber)}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : activeStep === 3 ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Order
                  </>
                ) : (
                  `Continue to ${steps[activeStep]?.title || "Next"}`
                )}
              </Button>

              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground justify-center">
                <Shield className="w-3 h-3" />
                <span>Secure SSL Encryption</span>
              </div>
            </div>

            {/* Trust Badges - More Compact */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground text-sm">Why Shop With Us?</span>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  <span>Genuine Parts Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                  <span>3-Month Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                  <span>Verified Technicians</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}