"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Lock, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white selection:bg-primary/30 font-sans relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none z-0" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B132B]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">Urban<span className="text-primary">Square</span></span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/market-intel" className="hover:text-white transition-colors">Market Intel</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          </div>

          <Link href="/auth?tab=login">
            <button className="px-5 py-2.5 bg-primary/20 text-primary border border-primary/30 text-sm font-bold rounded-lg hover:bg-primary/30 transition-colors">
              Access Portal
            </button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-48 pb-32 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6 }}
          className="text-center w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
          
          <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-8 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
             <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">
             Restricted Access
          </h1>
          
          <p className="text-lg text-white/60 leading-relaxed mb-10">
            For more information regarding enterprise pricing, institutional API access, and detailed PRO membership tiers, please log in to your UrbanSquare account.
          </p>
          
          <Link href="/auth?tab=login" className="inline-block w-full sm:w-auto">
             <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
               Log In To View Pricing <ArrowRight className="w-5 h-5" />
             </button>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
