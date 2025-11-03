/** biome-ignore-all assist/source/organizeImports: <explanation> **/
"use client";

import { useState, useMemo } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductModal } from "@/components/products/product-modal";
import { MarketplaceSidebar } from "@/components/products/marketplace-sidebar";
import { CheckoutSection } from "@/components/checkout/checkout-section";
import { mockProducts, type Product } from "@/lib/mock-products";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { HardHatIcon } from "lucide-react";

// Define CartItem type that matches the MarketplaceSidebar expectations
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

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState('filters');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]); // New state for orders
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    priceRange: [0, 10000] as [number, number],
    minRating: 0,
    searchQuery: '',
    inStock: false
  });

  // Mock user data (replace with actual auth later)
  const user = {
    name: "Brian Nyagaka",
    email: "brian@repair.ke",
    avatar: "/avatars/brian.jpg",
    phone: "0712345678"
  };

  // Add to cart function
  const addToCart = (product: Product) => {
    if (product.type === 'product' && product.inStock) {
      const existingItem = cartItems.find(item => item.id === product.id);
      if (existingItem) {
        // Update quantity if item exists
        setCartItems(prev => prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        // Add new item with quantity
        setCartItems(prev => [...prev, { 
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image 
        }]);
      }
    }
  };

  // Remove item from cart
  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Handle order creation from checkout
  const handleOrderCreated = (newOrder: Order) => {
    // Add the new order to the orders state
    setOrders(prev => [newOrder, ...prev]);
    console.log('New order created:', newOrder);
  };

  // Handle order deletion
  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    console.log('Order deleted:', orderId);
  };

  // Handle checkout completion
  const handleCheckoutComplete = () => {
    setShowCheckout(false);
    setCartItems([]); // Clear cart after successful checkout
    setIsSidebarOpen(false);
  };

  // Handle proceed to checkout from sidebar
  const handleProceedToCheckout = () => {
    setIsSidebarOpen(false);
    setShowCheckout(true);
  };

  // Handle back to landing page
  const handleBackToLanding = () => {
    router.push('/'); // Navigate back to landing page
  };

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && product.type !== filters.type) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (product.rating < filters.minRating) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery && 
          !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !product.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))) {
        return false;
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.type !== 'all',
    filters.minRating > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000,
    filters.inStock,
    filters.searchQuery !== ''
  ].filter(Boolean).length;

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Show checkout section if checkout is active
  if (showCheckout) {
    return (
      <CheckoutSection
        cartItems={cartItems}
        cartTotal={cartTotal}
        cartItemsCount={cartItemsCount}
        onBackToCart={() => setShowCheckout(false)}
        onCheckoutComplete={handleCheckoutComplete}
        onOrderCreated={handleOrderCreated} // Pass the order creation handler
        user={user}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50/20 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/5">
        {/* Main Sidebar */}
        <MarketplaceSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          cartItemsCount={cartItemsCount}
          cartItems={cartItems}
          onCartItemRemove={removeCartItem}
          onProceedToCheckout={handleProceedToCheckout}
          activeSection={activeSidebarSection}
          onSectionChange={setActiveSidebarSection}
          user={user}
          orders={orders} // Pass orders to sidebar
          onAddOrder={handleOrderCreated} // Pass order creation handler
          onDeleteOrder={handleDeleteOrder} // Pass order deletion handler
        />
        
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo and Back Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackToLanding}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Go back to landing page"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <HardHatIcon className="text-primary-foreground font-bold text-sm" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      Repair<span className="text-red-500">.ke</span>
                    </h1>
                    <p className="text-xs text-muted-foreground -mt-1">Marketplace</p>
                  </div>
                </div>

                {/* Search Bar - Desktop */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search services, parts, technicians..."
                      value={filters.searchQuery}
                      onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-3">
                  {/* Desktop Cart & Menu */}
                  <div className="hidden md:flex items-center gap-2">
                    {/* Theme Toggle */}
                    <ModeToggle />
                    
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSidebarSection('cart');
                        setIsSidebarOpen(true);
                      }}
                      className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      aria-label={`Shopping cart with ${cartItemsCount} items`}
                    >
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSidebarSection('profile');
                        setIsSidebarOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      aria-label="User profile"
                    >
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="flex items-center gap-2 md:hidden">
                    {/* Theme Toggle for Mobile */}
                    <ModeToggle />
                    
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSidebarSection('filters');
                        setIsSidebarOpen(true);
                      }}
                      className="p-2 rounded-lg bg-primary text-primary-foreground"
                      aria-label="Open filters menu"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Repair<span className="text-red-500">.ke</span> Marketplace
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  Discover quality repair services and genuine parts from verified technicians and sellers across Kenya
                </p>
                
                {/* Mobile Search & Action Buttons */}
                <div className="md:hidden space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search services, parts, technicians..."
                      value={filters.searchQuery}
                      onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSidebarSection('filters');
                        setIsSidebarOpen(true);
                      }}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                      Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSidebarSection('cart');
                        setIsSidebarOpen(true);
                      }}
                      className="px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {cartItemsCount > 0 && `(${cartItemsCount})`}
                    </button>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSidebarSection('filters');
                      setIsSidebarOpen(true);
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Browse & Filter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSidebarSection('cart');
                      setIsSidebarOpen(true);
                    }}
                    className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSidebarSection('faq');
                      setIsSidebarOpen(true);
                    }}
                    className="px-6 py-3 bg-stone-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-stone-500/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help & FAQ
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid 
                products={filteredProducts}
                onProductClick={setSelectedProduct}
                onAddToCart={addToCart}
                onOpenFilters={() => {
                  setActiveSidebarSection('filters');
                  setIsSidebarOpen(true);
                }}
                activeFiltersCount={activeFiltersCount}
              />

              {/* Product Modal */}
              <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
              />
            </main>

            {/* Back to Top Button */}
            <div className="sticky bottom-6 flex justify-end mr-6 mb-6">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-110"
                aria-label="Scroll to top"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}