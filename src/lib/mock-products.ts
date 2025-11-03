export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  type: 'product' | 'service';
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  tags: string[];
  inStock: boolean;
  quantity?: number;
  technician?: {
    name: string;
    specialization: string;
    responseTime: string;
    jobsCompleted: number;
    phone: string; // Add phone number field
  };
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone Screen Replacement",
    description: "Professional iPhone screen replacement with genuine parts and 6-month warranty",
    price: 4500,
    originalPrice: 6000,
    image: "/api/placeholder/300/300",
    category: "Phone Repair",
    type: "service",
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
      phone: "+254712345678" // Added phone number
    }
  },
  {
    id: "2",
    name: "Original Samsung Battery",
    description: "Genuine Samsung battery with 1-year warranty. Compatible with S21, S22, S23 series",
    price: 2800,
    image: "/api/placeholder/300/300",
    category: "Phone Parts",
    type: "product",
    rating: 4.6,
    reviewCount: 89,
    isVerified: true,
    tags: ["Samsung", "Battery", "Original"],
    inStock: true
  },
  {
    id: "3",
    name: "Laptop Motherboard Repair",
    description: "Expert motherboard diagnostics and repair for all major laptop brands",
    price: 3500,
    originalPrice: 5000,
    image: "/api/placeholder/300/300",
    category: "Laptop Repair",
    type: "service",
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
      phone: "+254723456789" // Added phone number
    }
  },
  {
    id: "4",
    name: "Professional Repair Toolkit",
    description: "64-piece precision screwdriver set with magnetic mat and spudgers",
    price: 3200,
    image: "/api/placeholder/300/300",
    category: "Tools",
    type: "product",
    rating: 4.7,
    reviewCount: 156,
    isVerified: true,
    tags: ["Tools", "Screwdriver", "Professional"],
    inStock: true
  },
  {
    id: "5",
    name: "MacBook Liquid Damage Repair",
    description: "Specialized liquid damage cleanup and component replacement for MacBooks",
    price: 7500,
    originalPrice: 9000,
    image: "/api/placeholder/300/300",
    category: "Laptop Repair",
    type: "service",
    rating: 4.5,
    reviewCount: 42,
    isVerified: true,
    tags: ["MacBook", "Liquid Damage", "Urgent"],
    inStock: true,
    technician: {
      name: "David Omondi",
      specialization: "Apple MacBooks",
      responseTime: "< 6 hours",
      jobsCompleted: 178,
      phone: "+254734567890" // Added phone number
    }
  },
  {
    id: "6",
    name: "Wireless Charging Coil",
    description: "Replacement wireless charging coil for most smartphone models",
    price: 1200,
    image: "/api/placeholder/300/300",
    category: "Phone Parts",
    type: "product",
    rating: 4.3,
    reviewCount: 34,
    isVerified: false,
    tags: ["Charging", "Wireless", "Replacement"],
    inStock: true
  },
  {
    id: "7",
    name: "Home Appliance Repair",
    description: "Fridge, washing machine, and microwave repair services with 3-month warranty",
    price: 2500,
    originalPrice: 4000,
    image: "/api/placeholder/300/300",
    category: "Appliance Repair",
    type: "service",
    rating: 4.4,
    reviewCount: 93,
    isVerified: true,
    tags: ["Home", "Appliance", "Warranty"],
    inStock: true,
    technician: {
      name: "Mike Chege",
      specialization: "Home Appliances",
      responseTime: "< 24 hours",
      jobsCompleted: 512,
      phone: "+254745678901" // Added phone number
    }
  },
  {
    id: "8",
    name: "Phone Back Glass Replacement",
    description: "Premium back glass replacement with color options available",
    price: 1800,
    image: "/api/placeholder/300/300",
    category: "Phone Parts",
    type: "product",
    rating: 4.2,
    reviewCount: 78,
    isVerified: true,
    tags: ["Back Glass", "Replacement", "Colors"],
    inStock: false
  },
  {
    id: "9",
    name: "Tablet Screen Repair",
    description: "Professional tablet screen repair for iPad and Android tablets",
    price: 5500,
    originalPrice: 7000,
    image: "/api/placeholder/300/300",
    category: "Tablet Repair",
    type: "service",
    rating: 4.7,
    reviewCount: 56,
    isVerified: true,
    tags: ["Tablet", "Screen", "iPad"],
    inStock: true,
    technician: {
      name: "Grace Wambui",
      specialization: "Tablets",
      responseTime: "< 3 hours",
      jobsCompleted: 234,
      phone: "+254756789012" // Added phone number
    }
  },
  {
    id: "10",
    name: "USB-C Charging Port",
    description: "Original USB-C charging port replacement for modern smartphones",
    price: 1500,
    image: "/api/placeholder/300/300",
    category: "Phone Parts",
    type: "product",
    rating: 4.5,
    reviewCount: 112,
    isVerified: true,
    tags: ["USB-C", "Charging", "Port"],
    inStock: true
  },
  {
    id: "11",
    name: "Gaming Console Repair",
    description: "PS5, Xbox Series X/S repair services with quick turnaround",
    price: 4000,
    originalPrice: 5500,
    image: "/api/placeholder/300/300",
    category: "Console Repair",
    type: "service",
    rating: 4.8,
    reviewCount: 78,
    isVerified: true,
    tags: ["Gaming", "Console", "PS5", "Xbox"],
    inStock: true,
    technician: {
      name: "Alex Kamau",
      specialization: "Gaming Consoles",
      responseTime: "< 8 hours",
      jobsCompleted: 167,
      phone: "+254767890123" // Added phone number
    }
  },
  {
    id: "12",
    name: "Phone Housing Frame",
    description: "Metal housing frame replacement for various smartphone models",
    price: 2200,
    image: "/api/placeholder/300/300",
    category: "Phone Parts",
    type: "product",
    rating: 4.1,
    reviewCount: 45,
    isVerified: true,
    tags: ["Frame", "Housing", "Metal"],
    inStock: true
  }
];