"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, TrendingUp, BarChart3, Activity, ArrowRight, PieChart } from "lucide-react";
import Footer from "@/components/Footer";

export default function MarketIntelPage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white selection:bg-primary/30 font-sans relative">
      <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none z-0" />
      
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
            <Link href="/market-intel" className="text-primary font-semibold">Market Intel</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          </div>

          <Link href="/auth?tab=login">
            <button className="px-5 py-2.5 bg-primary/20 text-primary border border-primary/30 text-sm font-bold rounded-lg hover:bg-primary/30 transition-colors">
              Access Portal
            </button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6">
        <section className="text-center max-w-4xl mx-auto mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary mb-6 uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Real Data. Real Returns.
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Market Intel.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              Track global property trends, monitor surging neighborhoods, and identify highly profitable investment zones with absolute precision based on real-time pricing data.
            </p>
          </motion.div>
        </section>

        {/* Global Stats Grid */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/30 transition-colors shadow-2xl">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-green-400">
                 <TrendingUp className="w-6 h-6" />
               </div>
               <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-2">Urban Market Index</p>
               <h3 className="text-4xl font-black text-white mb-2">+12.4%</h3>
               <p className="text-white/60 text-sm leading-relaxed">Average YoY growth rate across top 5 metropolitan commercial and residential districts.</p>
            </div>
            <div className="bg-gradient-to-br from-[#0B132B] to-primary/20 backdrop-blur-xl border border-primary/30 rounded-3xl p-8 hover:border-primary transition-colors shadow-[0_0_30px_rgba(212,175,55,0.15)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-[50px] group-hover:bg-primary/50 transition-colors" />
               <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 text-primary relative z-10">
                 <Activity className="w-6 h-6" />
               </div>
               <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-2 relative z-10">Asset Pricing Tracked</p>
               <h3 className="text-4xl font-black text-white mb-2 relative z-10">₹4.2 Trillion</h3>
               <p className="text-white/60 text-sm leading-relaxed relative z-10">Securely aggregated and synthesized into our core ML real-estate prediction models.</p>
            </div>
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/30 transition-colors shadow-2xl">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-blue-400">
                 <BarChart3 className="w-6 h-6" />
               </div>
               <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-2">Pricing Matrix Data</p>
               <h3 className="text-4xl font-black text-white mb-2">10M+ Rows</h3>
               <p className="text-white/60 text-sm leading-relaxed">Analyzed dynamically to ensure accurate local real estate valuation outputs.</p>
            </div>
          </div>
        </section>

        {/* Detailed Price Intel Block */}
        <section className="bg-black/30 border border-white/5 rounded-3xl overflow-hidden mb-24 flex flex-col lg:flex-row">
           <div className="lg:w-1/2 p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-500 mb-6 uppercase tracking-wider w-max">
                Hot Pricing Alert
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Navi Mumbai: Pricing Boom Detected</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                With massive infrastructure upgrades, real estate queries in Navi Mumbai indicate a staggering 18.4% property price surge. Our predictor models currently forecast an additional 5% climb by year-end, driven heavily by commercial zoning updates.
              </p>
              <Link href="/dashboard" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all w-max">
                Load Analytics Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
           </div>
           
           {/* Mock Heatmap/Pricing Graph Display */}
           <div className="lg:w-1/2 bg-[#0B132B]/50 border-l border-white/10 p-8 flex items-center justify-center relative min-h-[400px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
              <div className="w-full max-w-md bg-black/80 rounded-2xl border border-white/10 p-6 shadow-2xl relative z-10 overflow-hidden group">
                 <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                   <h4 className="font-bold text-white">Live Regional Variance</h4>
                   <PieChart className="w-5 h-5 text-white/40" />
                 </div>
                 <div className="space-y-4">
                    {[
                      { region: "Navi Mumbai, Seawoods", val: "+18.4%", w: "90%", c: "bg-green-500" },
                      { region: "Bandra West", val: "+12.1%", w: "65%", c: "bg-green-400" },
                      { region: "Powai Commercial", val: "+8.3%", w: "50%", c: "bg-green-300" },
                      { region: "Thane West", val: "+5.0%", w: "40%", c: "bg-primary" },
                      { region: "Andheri East (Old)", val: "-1.1%", w: "20%", c: "bg-red-400" }
                    ].map((bar, i) => (
                       <div key={i} className="flex flex-col gap-1.5">
                         <div className="flex justify-between text-xs font-semibold text-white/70">
                           <span>{bar.region}</span>
                           <span className={bar.val.includes('-') ? 'text-red-400' : 'text-green-400'}>{bar.val}</span>
                         </div>
                         <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              whileInView={{ width: bar.w }} 
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className={`h-full ${bar.c} rounded-full`} 
                              style={{ width: bar.w }}
                            />
                         </div>
                       </div>
                    ))}
                 </div>
                 <div className="mt-6 pt-4 border-t border-white/10 flex justify-between">
                    <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Prices Extracted: Live</span>
                    <span className="text-xs text-primary font-bold">Updated Now</span>
                 </div>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
