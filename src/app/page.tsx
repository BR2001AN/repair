"use client";

// biome-ignore assist/source/organizeImports:<explanation>//
import { useState, useEffect, useRef } from "react";
import { motion, type Variants, useScroll } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, ShoppingBag, Shield, HardHat, Star, Clock, MapPin, Phone, ArrowRight } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  if (!mounted) {
    return null;
  }

  const features = [
    {
      icon: Wrench,
      title: "Certified Technicians",
      description: "Verified experts with 5-star ratings and background checks",
      badge: "500+ Experts"
    },
    {
      icon: ShoppingBag,
      title: "Quality Parts Marketplace",
      description: "Genuine parts with 1-year warranty and quality guarantee",
      badge: "10K+ Parts"
    },
    {
      icon: Shield,
      title: "Secure M-Pesa Payments",
      description: "Encrypted transactions with instant confirmation and receipts",
      badge: "100% Safe"
    }
  ];

  const stats = [
    { value: "50K+", label: "Repairs Completed" },
    { value: "4.9/5", label: "Customer Rating" },
    { value: "24/7", label: "Support Available" },
    { value: "Nationwide", label: "Service Coverage" }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50/20 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/5 transition-colors duration-500">
      {/* Header */}
      <motion.header
        className="fixed top-0 w-full z-50 transition-all duration-500"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          background: isScrolled ? 'hsl(var(--background) / 0.95)' : 'hsl(var(--background) / 0.5)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
          borderBottom: isScrolled ? '1px solid hsl(var(--border) / 0.1)' : '1px solid transparent'
        }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="relative"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <HardHat className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
              </motion.div>
              <div className="flex flex-col">
                <motion.h1 
                  className="text-2xl font-bold tracking-tight"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-foreground">Repair</span>
                  <span className="text-red-500">.ke</span>
                </motion.h1>
                <p className="text-xs text-muted-foreground -mt-1">Trusted Repairs</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="secondary" className="hidden sm:flex shadow-sm">
                  <Star className="w-3 h-3 mr-1 fill-primary text-primary" />
                  4.9/5 Rating
                </Badge>
              </motion.div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-stone-200/30 dark:bg-grid-stone-800/5 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full"
          animate={{
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-primary/15 rounded-full"
          animate={{
            y: [-12, 12, -12],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Reduced Logo Size */}
          <motion.div
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25"
                whileHover={{ 
                  rotate: [0, -3, 3, 0],
                  scale: 1.05 
                }}
                transition={{ duration: 0.5 }}
              >
                <HardHat className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-background flex items-center justify-center shadow-md"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-xs font-bold text-white">KE</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            className="mb-6"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="text-foreground">Repair</span>
              <span className="text-red-500">.ke</span>
            </motion.h1>
            
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="outline" className="text-xs px-3 py-1">
                🚀 Fast Service
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1">
                💰 Affordable
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1">
                🛡️ Guaranteed
              </Badge>
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-8 font-normal leading-relaxed"
            variants={itemVariants}
          >
            Your Trusted Partner for <span className="text-primary font-semibold">Repairs</span> & <span className="text-primary font-semibold">Quality Parts</span>
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12 max-w-xl mx-auto"
            variants={itemVariants}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card className="text-center border-0 shadow-md bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="text-xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
            variants={itemVariants}
          >
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button size="lg" className="px-6 py-5 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300 group">
                <Wrench className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Book a Repair
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button variant="outline" size="lg" className="px-6 py-5 text-base font-semibold border-2 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group">
                <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Explore Marketplace
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground font-medium"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center gap-2 bg-background/40 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
              whileHover={{ scale: 1.03, y: -1 }}
            >
              <Clock className="w-3 h-3 text-primary" />
              <span>Same Day Service</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-background/40 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
              whileHover={{ scale: 1.03, y: -1 }}
            >
              <MapPin className="w-3 h-3 text-primary" />
              <span>Nationwide Coverage</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-background/40 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
              whileHover={{ scale: 1.03, y: -1 }}
            >
              <Phone className="w-3 h-3 text-primary" />
              <span>24/7 Support</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-background/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <Badge variant="secondary" className="mb-3 text-xs font-semibold px-3 py-1 shadow-sm">
              Why Choose Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Kenya's Most Trusted Repair Platform
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Experience seamless repair services with certified technicians and genuine parts
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover="hover"
                custom={index}
              >
                <Card className="h-full text-center border shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-background to-muted/10">
                  <CardHeader className="pb-3 pt-6">
                    <motion.div
                      className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      whileHover={{ rotate: 360, scale: 1.05 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                      {feature.badge}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}