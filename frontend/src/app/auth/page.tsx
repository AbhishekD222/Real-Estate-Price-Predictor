"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Loader2, ArrowRight } from "lucide-react";

function AuthComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    let name = "Urban Investor";
    let email = "investor@urbansquare.com";
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.type === 'email' && input.value) email = input.value;
      if (input.type === 'text' && input.value) name = input.value;
    });
    
    if (activeTab === "login" && email) {
       name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    }

    localStorage.setItem('urbanUser', JSON.stringify({ name, email, role: "PRO Member" }));

    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md z-10">
      <Card className="bg-black/60 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <CardHeader className="space-y-4 pb-6 text-center pt-8">
          <Link href="/" className="inline-flex justify-center mb-0 mx-auto">
             <div className="p-3 bg-white/5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:scale-105 transition-transform">
               <Building2 className="w-8 h-8 text-primary" />
             </div>
          </Link>
          <CardTitle className="text-2xl font-bold tracking-tight text-white px-2">
            UrbanSquare Real-Time Market
          </CardTitle>
          
          {/* Custom Tabs Navigation */}
          <div className="bg-white/5 p-1 rounded-xl mx-4 flex relative mt-4">
            {/* Sliding Indicator */}
            <motion.div 
               layoutId="activeTabIndicator"
               className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary/20 border border-primary/30 rounded-lg shadow-sm"
               initial={false}
               animate={{ left: activeTab === "login" ? "4px" : "calc(50%)" }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
              onClick={() => setActiveTab("login")}
              className={`flex-1 relative z-10 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "login" ? "text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setActiveTab("signup")}
              className={`flex-1 relative z-10 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "signup" ? "text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Create Account
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          <AnimatePresence mode="wait">
            <motion.form 
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="space-y-4">
                {activeTab === "signup" && (
                  <div className="space-y-2 text-left">
                    <Label className="text-white/80 text-xs uppercase tracking-wider font-semibold">Full Name</Label>
                    <Input 
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl" 
                    />
                  </div>
                )}
                <div className="space-y-2 text-left">
                  <Label className="text-white/80 text-xs uppercase tracking-wider font-semibold">Email Address</Label>
                  <Input 
                    type="email"
                    required
                    placeholder="investor@example.com"
                    className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl" 
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
                    className="bg-black/50 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl" 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-13 bg-white hover:bg-neutral-200 text-black font-bold text-base rounded-xl transition-all flex items-center justify-center mt-6"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-black" />
                ) : (
                  <>
                    {activeTab === "login" ? "Access Dashboard" : "Secure Your Account"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-white/40">
                  By continuing, you agree to our Terms of Service and Privacy Policy. Institutional grade security built-in.
                </p>
              </div>
            </motion.form>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Luxury Real Estate Dark Background */}
      <div className="absolute inset-0 z-0 h-screen w-full">
        <div className="absolute inset-0 bg-black/80 z-10 backdrop-blur-sm" />
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Luxury Real Estate"
          className="w-full h-full object-cover opacity-30 saturate-0 scale-105"
        />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <Suspense fallback={<div className="z-10 animate-pulse"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
        <AuthComponent />
      </Suspense>
    </main>
  );
}
