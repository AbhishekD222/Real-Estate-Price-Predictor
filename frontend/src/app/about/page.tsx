"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Mail, MapPin, Database, ShieldCheck, Cpu, Send, Phone } from "lucide-react";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white selection:bg-primary/30 font-sans relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B132B]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">Urban<span className="text-primary">Square</span></span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/market-intel" className="hover:text-white transition-colors">Market Intel</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-primary font-semibold">About Us</Link>
          </div>

          <Link href="/auth?tab=login">
            <button className="px-5 py-2.5 bg-primary/20 text-primary border border-primary/30 text-sm font-bold rounded-lg hover:bg-primary/30 transition-colors">
              Access Portal
            </button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary mb-6 uppercase tracking-wider">
              About UrbanSquare
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Empowering Real Estate with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Data Intelligence.</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              We aggregate complex, high-volume real estate transactional data and distill it down to actionable, lightning-fast valuations. Welcome to the future of property acquisition.
            </p>
          </motion.div>
        </section>

        {/* Data Architecture Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight">Institutional-Grade Data. <br/><span className="text-white/50">Accessible to Everyone.</span></h2>
              <p className="text-white/60 leading-relaxed text-lg">
                At UrbanSquare, our predictive engine doesn&apos;t rely on guesswork. We are processing comprehensive, multi-year historical datasets covering the most volatile real estate markets, like Mumbai.
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Live Market Feeds</h4>
                    <p className="text-white/50 text-sm">We process millions of square footage metrics spanning a decade of historical trends to plot accurate market graphs.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Predictive ML Architecture</h4>
                    <p className="text-white/50 text-sm">Advanced Regression Models running on FastAPI backends supply real-time valuations the second you adjust standard parameters.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            {/* Visual Glass Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[500px] w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl overflow-hidden group"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
               <div className="relative z-10 text-center space-y-6">
                  <ShieldCheck className="w-24 h-24 text-primary opacity-80 mx-auto group-hover:scale-110 transition-transform duration-500" />
                  <div className="space-y-2">
                     <p className="text-3xl font-black text-white">98.4% Accuracy</p>
                     <p className="text-white/50 font-medium uppercase tracking-widest text-sm">Mumbai Regional Model</p>
                  </div>
               </div>
               
               {/* Animated tech grid */}
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <div className="w-full h-full" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-black/30 border border-white/5 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Get In Touch</h2>
                <p className="text-white/60 mb-8 max-w-md">
                  Interested in enterprise API access to our Live Market Estimator? Need assistance with your UrbanSquare account? Leave us a message.
                </p>
                
                <div className="space-y-6">
                   <div className="flex items-center gap-4 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">contact@urbansquare.inc</span>
                   </div>
                   <div className="flex items-center gap-4 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">+91 (800) 123-4567</span>
                   </div>
                   <div className="flex items-center gap-4 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">Bandra Kurla Complex, Mumbai</span>
                   </div>
                </div>
             </div>
             
             {/* Contact Form */}
             <div className="bg-[#0B132B]/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <div className="space-y-2">
                     <Label className="text-white/70">Full Name</Label>
                     <Input 
                       placeholder="e.g. John Doe"
                       className="bg-black/50 border-white/10 focus-visible:ring-primary h-12"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-white/70">Corporate Email</Label>
                     <Input 
                       type="email"
                       placeholder="john@company.com"
                       className="bg-black/50 border-white/10 focus-visible:ring-primary h-12"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-white/70">Message</Label>
                     <textarea 
                       placeholder="How can our data team help you?"
                       className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-y placeholder:text-muted-foreground"
                     />
                   </div>
                   <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-bold mt-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                     <Send className="w-4 h-4 mr-2" /> Send Message
                   </Button>
                </form>
             </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
