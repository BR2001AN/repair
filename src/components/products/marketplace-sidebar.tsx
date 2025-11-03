"use client";

// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Filter, 
  X, 
  Search, 
  ShoppingCart, 
  User, 
  HelpCircle, 
  Settings, 
  LogOut,
  // biome-ignore lint/correctness/noUnusedImports: <explanation>//
  Star,
  Heart,
  History,
  Shield,
  Phone,
  Mail,
  Trash2,
  CreditCard,
  Store,
  HardHatIcon,
  Package,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { ProductFilters } from "./product-filters";
import { useRouter } from "next/navigation";

interface Filters {
  category: string;
  type: string;
  priceRange: [number, number];
  minRating: number;
  searchQuery: string;
  inStock: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface UserData {
  name: string;
  email: string;
  avatar?: string;
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
  pickupDate?: string;
  technician?: {
    name: string;
    phone: string;
    specialization: string;
  };
}

interface MarketplaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  cartItemsCount: number;
  cartItems: CartItem[];
  onCartItemRemove?: (id: string) => void;
  onProceedToCheckout?: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  user?: UserData;
  // New props for order history
  orders?: Order[];
  onAddOrder?: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void; // New prop for deleting orders
}

const sidebarSections = [
  {
    id: 'filters',
    label: 'Filters & Search',
    icon: Filter,
    badge: null
  },
  {
    id: 'cart',
    label: 'Shopping Cart',
    icon: ShoppingCart,
    badge: 'count'
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: User,
    badge: null
  },
  {
    id: 'orders',
    label: 'Order History',
    icon: History,
    badge: 'count'
  },
  {
    id: 'seller',
    label: 'Become a Seller',
    icon: Store,
    badge: 'new'
  },
  {
    id: 'faq',
    label: 'Help & FAQ',
    icon: HelpCircle,
    badge: null
  }
] as const;

const faqItems = [
  {
    question: "How do I book a repair service?",
    answer: "Click on any service card, then click 'Book Service' to schedule with a verified technician."
  },
  {
    question: "Are the parts genuine?",
    answer: "All parts are verified and come with minimum 1-year warranty. Look for the 'Verified' badge."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept M-Pesa and cash payments. M-Pesa payments are secured through escrow."
  },
  {
    question: "How long do repairs take?",
    answer: "Most phone repairs take 1-2 hours, while complex laptop repairs may take 24-48 hours."
  },
  {
    question: "Do you offer warranties?",
    answer: "Yes! Services come with 3-month warranty, parts with 1-year warranty."
  }
];

export function MarketplaceSidebar({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  cartItemsCount,
  cartItems = [],
  onCartItemRemove,
  onProceedToCheckout,
  activeSection,
  onSectionChange,
  user,
  orders = [],
  onDeleteOrder // New prop for deleting orders
}: MarketplaceSidebarProps) {
  const router = useRouter();
  
  // Use the orders prop directly instead of local state
  const orderHistory = orders;

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.type !== 'all',
    filters.minRating > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000,
    filters.inStock,
    filters.searchQuery !== ''
  ].filter(Boolean).length;

  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleBecomeSeller = () => {
    onClose();
    router.push('/become-seller');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (onDeleteOrder) {
      onDeleteOrder(orderId);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getOrderTypeIcon = (type: Order['orderType']) => {
    switch (type) {
      case 'product': return <Package className="w-4 h-4" />;
      case 'service': return <Wrench className="w-4 h-4" />;
      case 'mixed': return <ShoppingCart className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md">
      {/* Backdrop */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> **/}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
        role="presentation"
      />
      
      {/* Sidebar Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative flex flex-col h-full w-full max-w-md bg-background/95 backdrop-blur-md border-l shadow-xl ml-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <HardHatIcon className="text-primary-foreground font-bold text-sm" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Marketplace</h2>
              <p className="text-xs text-muted-foreground">Everything you need</p>
            </div>
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation Tabs */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-2 gap-2">
              {sidebarSections.map((section) => (
                <motion.div
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={activeSection === section.id ? "default" : "outline"}
                    size="sm"
                    className="w-full h-auto py-3 justify-start gap-2 font-normal relative"
                    onClick={() => {
                      if (section.id === 'seller') {
                        handleBecomeSeller();
                      } else {
                        onSectionChange(section.id);
                      }
                    }}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-xs">{section.label}</span>
                    
                    {section.badge === 'count' && section.id === 'cart' && cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 p-0">
                        {cartItemsCount}
                      </Badge>
                    )}
                    
                    {section.badge === 'count' && section.id === 'orders' && orderHistory.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 p-0">
                        {orderHistory.length}
                      </Badge>
                    )}
                    
                    {section.badge === 'new' && (
                      <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 p-0">
                        New
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeSection === 'filters' && (
              <div className="p-6 space-y-6">
                <ProductFilters 
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                />
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 hover:border-primary/40 hover:bg-primary/5"
                    onClick={() => onFiltersChange({
                      category: 'all',
                      type: 'all',
                      priceRange: [0, 10000],
                      minRating: 0,
                      searchQuery: '',
                      inStock: false
                    })}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                  
                  <Button 
                    className="w-full shadow-lg hover:shadow-primary/20"
                    onClick={onClose}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Show Results
                    <Badge className="ml-2 bg-primary/10 text-primary">
                      {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'All'}
                    </Badge>
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'cart' && (
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {cartItemsCount > 0 ? `${cartItemsCount} Items in Cart` : 'Your Cart is Empty'}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {cartItemsCount > 0 
                      ? 'Ready to checkout?' 
                      : 'Add some products to get started'
                    }
                  </p>
                </div>

                {cartItemsCount > 0 ? (
                  <div className="space-y-4">
                    {/* Cart Items List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-xs font-semibold text-primary">
                                KES {item.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold">
                              KES {(item.price * item.quantity).toLocaleString()}
                            </span>
                            {onCartItemRemove && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                onClick={() => onCartItemRemove(item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="bg-muted/30 rounded-lg p-4 border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Subtotal</span>
                        <span className="font-semibold">KES {cartSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                        <span>Items</span>
                        <span>{cartItemsCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-primary">
                        <span>Total</span>
                        <span>KES {cartSubtotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full shadow-lg hover:shadow-primary/20"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                    
                    <Button variant="outline" className="w-full" onClick={onClose}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    Browse Products
                  </Button>
                )}

                {/* Trust Badges */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Secure Checkout</span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>✓ M-Pesa & Cash Payments</div>
                    <div>✓ 24/7 Customer Support</div>
                    <div>✓ Nationwide Delivery</div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="p-6 space-y-6">
                {/* User Profile */}
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-background shadow-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User avatar"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {user?.name || 'Guest User'}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {user?.email || 'Sign in to access full features'}
                  </p>
                  
                  {!user && (
                    <Button className="w-full shadow-lg hover:shadow-primary/20">
                      <User className="w-4 h-4 mr-2" />
                      Sign In / Register
                    </Button>
                  )}
                </div>

                {/* Profile Actions */}
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => onSectionChange('orders')}
                  >
                    <History className="w-4 h-4" />
                    Order History ({orderHistory.length})
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Button>
                  
                  {user && (
                    <Button variant="outline" className="w-full justify-start gap-3 text-destructive">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Order History</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {orderHistory.length > 0 
                      ? `You have ${orderHistory.length} order${orderHistory.length > 1 ? 's' : ''}` 
                      : 'No orders yet'
                    }
                  </p>
                </div>

                {orderHistory.length > 0 ? (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted/30 rounded-lg p-4 border space-y-3 relative group"
                      >
                        {/* Delete Button */}
                        {onDeleteOrder && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                        
                        {/* Order Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getOrderTypeIcon(order.orderType)}
                            <div>
                              <div className="font-semibold text-foreground text-sm">
                                Order #{order.orderNumber}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                                  <span className="text-primary font-bold text-xs">
                                    {item.quantity}x
                                  </span>
                                </div>
                                <span className="truncate text-foreground">{item.name}</span>
                              </div>
                              <span className="font-medium whitespace-nowrap ml-2">
                                KES {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>

                        {/* Order Details */}
                        <div className="space-y-2 text-xs text-muted-foreground">
                          {order.pickupLocation && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{order.pickupLocation}</span>
                            </div>
                          )}
                          {order.technician && (
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              <span>{order.technician.name} • {order.technician.specialization}</span>
                            </div>
                          )}
                        </div>

                        {/* Order Total */}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="font-bold text-primary">
                            KES {order.total.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="bg-muted/30 rounded-lg p-6 border">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h4 className="font-semibold text-foreground mb-2">No Orders Yet</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Start shopping to see your order history here
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          onSectionChange('filters');
                          onClose();
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Start Shopping
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'seller' && (
              <div className="p-6 space-y-6">
                {/* Become a Seller Promotion */}
                <div className="text-center">
                  <Store className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Become a Seller</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Start your business on Kenya's trusted repair platform
                  </p>
                  
                  <Button 
                    className="w-full shadow-lg hover:shadow-green-500/20 bg-green-600 hover:bg-green-700"
                    onClick={handleBecomeSeller}
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Start Selling Today
                  </Button>
                </div>

                {/* Seller Benefits */}
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-foreground mb-3 text-sm">Why Sell With Us?</h4>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Reach thousands of customers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Secure M-Pesa & card payments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Get verified badge for trust</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Dedicated seller dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>24/7 customer support</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <div className="text-lg font-bold text-blue-600">500+</div>
                      <div className="text-xs text-muted-foreground">Active Sellers</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                      <div className="text-lg font-bold text-purple-600">KES 200</div>
                      <div className="text-xs text-muted-foreground">One-time Fee</div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-center text-white">
                    <h4 className="font-semibold mb-2 text-sm">Ready to Grow Your Business?</h4>
                    <p className="text-xs opacity-90 mb-3">
                      Join our community of successful sellers
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white text-green-600 hover:bg-gray-100"
                      onClick={handleBecomeSeller}
                    >
                      Get Started Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Help & Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Find answers to common questions
                  </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {faqItems.map((faq, index) => (
                    <motion.div
                      key={`faq-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>//
index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-muted/30 rounded-lg p-4 border"
                    >
                      <h4 className="font-medium text-foreground mb-2 text-sm">
                        {faq.question}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Support */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-medium text-foreground mb-3 text-sm">Still need help?</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Phone className="w-4 h-4" />
                      Call Support: 0700 123 456
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      Email Support
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}