"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Loader2, ArrowRight, TrendingUp, ShieldCheck, MapPin } from "lucide-react";

// Premium real estate images for the showcase carousel
const SHOWCASE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
];

const FEATURES = [
  { icon: MapPin, text: "Hyper-Local Market Intel" },
  { icon: TrendingUp, text: "Live Pricing Models" },
  { icon: ShieldCheck, text: "Institutional Grade Data" }
];

function AuthComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    let name = "";
    let email = "";
    let password = "";
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.type === 'email' && input.value) email = input.value;
      if (input.type === 'text' && input.value) name = input.value;
      if (input.type === 'password' && input.value) password = input.value;
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Client-side authentication simulation
    const usersStr = localStorage.getItem('urbanRegisteredUsers');
    const users = usersStr ? JSON.parse(usersStr) : {};
    
    if (activeTab === "signup") {
      if (users[email]) {
        setError("Account already exists with this email. Please sign in.");
        setIsLoading(false);
        return;
      }
      
      // Default name if not provided
      if (!name) name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

      users[email] = { name, email, password, role: "PRO Member" };
      localStorage.setItem('urbanRegisteredUsers', JSON.stringify(users));
      localStorage.setItem('urbanUser', JSON.stringify({ name, email, role: "PRO Member" }));
      
      router.push("/dashboard");
    } else {
      const user = users[email];
      
      if (!user) {
        setError("Account not found. Please create an account first.");
        setIsLoading(false);
        return;
      }
      
      if (user.password !== password) {
        setError("Incorrect password. Please try again.");
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem('urbanUser', JSON.stringify({ name: user.name, email: user.email, role: user.role }));
      router.push("/dashboard");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md z-10"
    >
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="space-y-6 text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-2 mx-auto group">
             <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:scale-105 group-hover:border-primary/50 transition-all duration-300">
               <Building2 className="w-8 h-8 text-primary" />
             </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome to Urban<span className="text-primary">Square</span>
            </h1>
            <p className="text-sm text-white/50">
              Access real-time property intelligence
            </p>
          </div>
          
          {/* Custom Tabs Navigation */}
          <div className="bg-white/5 p-1.5 rounded-2xl flex relative mt-6">
            <motion.div 
               layoutId="activeTabIndicator"
               className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary/20 border border-primary/30 rounded-xl shadow-sm"
               initial={false}
               animate={{ left: activeTab === "login" ? "6px" : "calc(50%)" }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
              onClick={() => { setActiveTab("login"); setError(null); }}
              className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-colors ${activeTab === "login" ? "text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setActiveTab("signup"); setError(null); }}
              className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-colors ${activeTab === "signup" ? "text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Create Account
            </button>
          </div>
        </div>
        
        <div className="px-2">
          <AnimatePresence mode="wait">
            <motion.form 
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                {activeTab === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 text-left"
                  >
                    <Label className="text-white/80 text-xs uppercase tracking-wider font-semibold">Full Name</Label>
                    <Input 
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl transition-all focus:bg-white/5" 
                    />
                  </motion.div>
                )}
                <div className="space-y-2 text-left">
                  <Label className="text-white/80 text-xs uppercase tracking-wider font-semibold">Email Address</Label>
                  <Input 
                    type="email"
                    required
                    placeholder="investor@example.com"
                    className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl transition-all focus:bg-white/5" 
                  />
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <Label className="text-white/80 text-xs uppercase tracking-wider font-semibold">Password</Label>
                    {activeTab === "login" && (
                      <Link href="#" className="text-xs text-primary/80 hover:text-primary transition-colors">Forgot?</Link>
                    )}
                  </div>
                  <Input 
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl transition-all focus:bg-white/5" 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-bold text-base rounded-xl transition-all flex items-center justify-center mt-6 group relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-black relative z-10" />
                ) : (
                  <span className="relative z-10 flex items-center">
                    {activeTab === "login" ? "Access Dashboard" : "Secure Your Account"}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-xs text-white/40 leading-relaxed">
                  By continuing, you agree to our Terms of Service and Privacy Policy.<br/> Institutional grade security built-in.
                </p>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={SHOWCASE_IMAGES[currentIndex]}
            alt="Luxury Real Estate"
            fill
            className="object-cover opacity-60"
            priority
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Gradients to blend into the design */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B] via-[#0B132B]/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-[#0B132B]/30 z-10" />

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-sm font-medium text-primary mb-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Market Updates
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Discover value before the market does.
          </h2>
          
          <p className="text-lg text-white/70 leading-relaxed">
            Join thousands of smart investors using our AI-driven models to identify high-yield opportunities and minimize risk.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + (idx * 0.1) }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <feature.icon className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-white/80">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-16 flex gap-2">
          {SHOWCASE_IMAGES.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#0B132B] text-white flex overflow-hidden font-sans">
      {/* Decorative Background Elements for the form side */}
      <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B132B_100%)] opacity-80" />
      </div>

      {/* Left side - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-10">
        <Suspense fallback={<div className="z-10 animate-pulse flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <span className="text-sm text-white/50">Loading interface...</span>
        </div>}>
          <AuthComponent />
        </Suspense>
      </div>

      {/* Right side - Animated Real Estate Art Showcase */}
      <div className="hidden lg:block lg:w-[55%] relative bg-[#0B132B] overflow-hidden border-l border-white/5">
         <AnimatedShowcase />
      </div>
    </main>
  );
}
