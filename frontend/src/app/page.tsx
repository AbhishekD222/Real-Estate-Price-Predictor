"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin, TrendingUp, ShieldCheck } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import Footer from "@/components/Footer";

export default function DesignerLandingPage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white selection:bg-primary/30 font-sans">
      {/* Dynamic Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="shiny-sweep-container-slow flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity rounded-lg px-2 py-1 -ml-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Urban<span className="text-primary">Square</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="/market-intel" className="hover:text-white transition-colors">Market Intel</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth?tab=login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors hidden sm:block">
              Log In
            </Link>
            <Link href="/auth?tab=signup">
              <button className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors">
                Sign Up Now
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-20">
        {/* Modern Trendy Animated Building Background */}
        <div className="absolute inset-0 z-0 h-screen w-full overflow-hidden bg-[#0B132B]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/80 to-[#0B132B]/20 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B132B_100%)] z-10" />
          
          <motion.div
            initial={{ scale: 1.15, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 0.6, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 origin-bottom"
          >
             <img 
               src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2500&q=80" 
               alt="Modern Futuristic Skyscraper"
               className="w-full h-full object-cover"
             />
          </motion.div>

          {/* Real-Time Golden Grid Overlay */}
          <div className="absolute inset-0 z-10 opacity-20 pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, transparent, black 40%, transparent)" }}>
             <motion.div 
                initial={{ y: "0%" }}
                animate={{ y: "10%" }}
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                className="w-full h-[200%] absolute top-[-50%]"
                style={{
                  backgroundImage: "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
                  backgroundSize: "80px 80px",
                }}
             />
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-48 lg:pb-32 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Badge and Heading */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-8 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-sm font-medium text-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Mumbai Model Live: 98.4% Accuracy
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Real-Time <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-400">
                Property Value.
              </span><br/>
              Before You Buy.
            </h1>
          </motion.div>

          {/* Right Side: Paragraph and Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-8 text-left"
          >
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Equip yourself with institutional-grade market data. Discover undervalued assets, track massive growth neighborhoods, and secure exclusive real estate wealth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Magnetic>
                <Link href="/auth?tab=signup">
                  <button className="h-14 px-8 w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 transition-all font-semibold text-black flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)]">
                    Get Instant Access <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </Magnetic>
              <Link href="/dashboard">
                <button className="h-14 px-8 w-full sm:w-auto rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all font-semibold text-white flex items-center justify-center">
                  View Live Demo
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="relative z-20 bg-[#0A1128] border-y border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
               <MapPin className="w-8 h-8 text-white/40 mx-auto mb-4" />
               <p className="text-white font-semibold flex items-center justify-center gap-2 cursor-pointer hover:text-primary transition-colors">Hyper-Local Intel</p>
               <p className="text-sm text-white/50 mt-1">Granular street-level data</p>
            </div>
            <div className="text-center">
               <TrendingUp className="w-8 h-8 text-white/40 mx-auto mb-4" />
               <p className="text-white font-semibold flex items-center justify-center gap-2 cursor-pointer hover:text-primary transition-colors">Live Market Models</p>
               <p className="text-sm text-white/50 mt-1">Real-time pricing accuracy</p>
            </div>
            <div className="text-center">
               <Building2 className="w-8 h-8 text-white/40 mx-auto mb-4" />
               <p className="text-white font-semibold flex items-center justify-center gap-2 cursor-pointer hover:text-primary transition-colors">Institutional Grade</p>
               <p className="text-sm text-white/50 mt-1">Enterprise-level data</p>
            </div>
            <div className="text-center">
               <ShieldCheck className="w-8 h-8 text-white/40 mx-auto mb-4" />
               <p className="text-white font-semibold flex items-center justify-center gap-2 cursor-pointer hover:text-primary transition-colors">Risk Analysis</p>
               <p className="text-sm text-white/50 mt-1">Investment safety scoring</p>
            </div>
          </div>
        </div>

      </main>

      {/* Website Footer placed seamlessly at the bottom */}
      <Footer />
    </div>
  );
}
