"use client";

import { useState, useEffect } from "react";
import PredictorCard from "@/components/dashboard/PredictorCard";
import InvestmentScoreCard from "@/components/dashboard/InvestmentScoreCard";
import ComparisonEngine from "@/components/dashboard/ComparisonEngine";
import ComparisonTabView from "@/components/dashboard/ComparisonTabView";
import TrendHistoryChart from "@/components/dashboard/TrendHistoryChart";
import InteractiveMapDynamic from "@/components/dashboard/InteractiveMapDynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Search, Bell, LogOut, Building2, Heart, Activity, Plus, X, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "favourites" | "compare">("overview");
  const [featuredProperties, setFeaturedProperties] = useState<{location: string, price: string, sqft: number, bhk: number, trend: string}[]>([
     { location: "Bandra West, Mumbai", price: "8.5 Cr", sqft: 2200, bhk: 4, trend: "+12.1%" },
     { location: "Andheri East, Commercial", price: "3.2 Cr", sqft: 1500, bhk: 0, trend: "+5.0%" },
     { location: "Navi Mumbai, Seawoods", price: "1.8 Cr", sqft: 1100, bhk: 2, trend: "+18.4%" }
  ]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedFavCard, setSelectedFavCard] = useState<{location: string, price: string, sqft: number, bhk: number, trend: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [topRegions, setTopRegions] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mockUser, setMockUser] = useState({ name: "Guest Explorer", email: "guest@urbansquare.com", role: "Trial Access" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('urbanUser');
      if (savedUser) setMockUser(JSON.parse(savedUser));
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "US";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const FALLBACK_TOP = ["Bandra West", "Andheri East", "Worli", "Juhu", "Powai"];
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiBase}/regions/top`)
      .then(res => res.json())
      .then(data => setTopRegions(data.regions?.length ? data.regions : FALLBACK_TOP))
      .catch(() => setTopRegions(FALLBACK_TOP));
  }, []);

  useEffect(() => {
    // Optionally fetch live properties but we've initialized with defaults.
    // If you want robust fetching, you'd merge or override here.
  }, []);

  return (
    <main className="min-h-screen bg-[#0B132B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.15),rgba(11,19,43,1))] text-white font-sans flex flex-col">
      {/* Upperbar Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="shiny-sweep-container flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity rounded-lg px-2 py-1 -ml-2">
            <div className="p-1.5 bg-primary/20 rounded border border-primary/30">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold tracking-tight text-white hidden sm:block">
              Urban<span className="text-primary">Square</span>
            </span>
          </Link>

          {/* Upperbar Tabs */}
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 relative overflow-x-auto hide-scrollbar max-w-[45vw] md:max-w-none">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`relative px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors z-10 whitespace-nowrap ${activeTab === "overview" ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Overview
              {activeTab === "overview" && (
                 <motion.div layoutId="navTab" className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-md -z-10" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("favourites")}
              className={`relative px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors z-10 whitespace-nowrap ${activeTab === "favourites" ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Favourites
              {activeTab === "favourites" && (
                 <motion.div layoutId="navTab" className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-md -z-10" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("compare")}
              className={`relative px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors z-10 whitespace-nowrap ${activeTab === "compare" ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Compare
              {activeTab === "compare" && (
                 <motion.div layoutId="navTab" className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-md -z-10" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group hidden md:block z-50">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-primary transition-colors cursor-pointer" />
               <input 
                 type="text" 
                 placeholder="Search popular areas..." 
                 className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm w-48 focus:w-64 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder:text-white/30 cursor-text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onFocus={() => setShowSuggestions(true)}
                 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
               />
               
               {showSuggestions && topRegions.length > 0 && (
                 <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-black/95 border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden text-sm animate-in fade-in shadow-xl z-50">
                   <div className="p-3 text-xs text-white/40 font-semibold uppercase tracking-wider bg-white/5 border-b border-white/10">Popular Locations</div>
                   <div className="max-h-64 overflow-y-auto custom-scrollbar">
                     {topRegions.filter(r => r.toLowerCase().includes(searchQuery.toLowerCase())).map((region, idx) => (
                        <div 
                          key={idx} 
                          className="px-4 py-2.5 hover:bg-primary/20 cursor-pointer text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
                          onClick={() => { 
                            setSearchQuery(region); 
                            setSelectedLocation(region); 
                            setShowSuggestions(false);
                          }}
                        >
                           {region}
                        </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
             {/* Notifications Dropdown */}
             <div className="relative z-[60]">
               <button 
                 onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                 className="text-white/60 hover:text-white transition-colors relative cursor-pointer mr-2 p-1.5 focus:outline-none"
               >
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
               </button>
               
               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                   >
                     <div className="p-4 border-b border-white/5 bg-[#0B132B] flex justify-between items-center">
                       <h3 className="font-bold text-white tracking-tight text-sm">Real-Time Alerts</h3>
                       <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">3 New</span>
                     </div>
                     <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                       {[
                         { id: 1, title: 'Price Surge Alert', desc: 'Navi Mumbai, Seawoods property values increased by +4.2% this week.', time: '2m ago', color: 'text-green-400', dot: 'bg-green-400' },
                         { id: 2, title: 'New Data Model Active', desc: 'Institutional pricing inputs for Bandra West have been recently refreshed with latest transactions.', time: '1h ago', color: 'text-primary', dot: 'bg-primary' },
                         { id: 3, title: 'Market Correction', desc: 'Thane West commercial spaces observed a slight -1.1% dip.', time: '5h ago', color: 'text-red-400', dot: 'bg-red-400' }
                       ].map((notif, i) => (
                         <div key={notif.id} className={`p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer ${i === 0 ? 'bg-white/[0.02]' : ''}`}>
                           <div className="flex justify-between items-start mb-1">
                             <div className="flex items-center gap-2">
                               <div className={`w-1.5 h-1.5 rounded-full ${notif.dot}`} />
                               <h4 className={`text-sm font-semibold ${notif.color}`}>{notif.title}</h4>
                             </div>
                             <span className="text-[10px] text-white/40">{notif.time}</span>
                           </div>
                           <p className="text-xs text-white/60 leading-relaxed pl-3.5 mt-1">{notif.desc}</p>
                         </div>
                       ))}
                     </div>
                     <div className="p-2 border-t border-white/5 bg-[#0B132B] text-center">
                       <button 
                         onClick={() => setShowNotifications(false)}
                         className="text-xs text-white/50 hover:text-white transition-colors py-1.5 w-full font-medium"
                       >
                         Dismiss All Alerts
                       </button>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             {/* User Profile Dropdown */}
             <div className="relative z-50">
               <button 
                 onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                 className="flex items-center gap-3 text-sm font-medium focus:outline-none hover:bg-white/5 p-1.5 rounded-lg transition-colors border border-transparent hover:border-white/10"
               >
                 <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
                   {getInitials(mockUser.name)}
                 </div>
                 <div className="hidden lg:block text-left">
                   <p className="text-white text-xs font-bold leading-tight">{mockUser.name}</p>
                   <p className="text-white/50 text-[10px] uppercase tracking-wider">{mockUser.role}</p>
                 </div>
               </button>
               
               <AnimatePresence>
                 {showUserMenu && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                   >
                     <div className="p-4 border-b border-white/5 bg-[#0B132B]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                            {getInitials(mockUser.name)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-white font-bold truncate">{mockUser.name}</p>
                            <p className="text-white/50 text-xs truncate">{mockUser.email}</p>
                          </div>
                        </div>
                     </div>
                     <div className="p-2">
                       <div className="px-3 py-2 text-xs text-white/40 uppercase tracking-widest font-semibold">Account</div>
                       <div className="flex flex-col gap-1 px-1">
                          <Link href="/dashboard/settings" className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {mockUser.role} Status
                          </Link>
                          <Link href="/dashboard/billing" className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors inline-block">
                            Billing & Plans
                          </Link>
                          <Link href="/dashboard/settings" className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors inline-block">
                            Settings
                          </Link>
                       </div>
                     </div>
                     <div className="p-2 border-t border-white/5">
                        <Link href="/" onClick={() => localStorage.removeItem('urbanUser')}>
                          <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </Link>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          
          {/* Header specific to Tab */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 min-h-[60px]">
            {activeTab === "overview" ? (
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  Global Market Board
                </h1>
                <p className="text-muted-foreground mt-2 text-md">
                  Real-time data feeds and live pricing metrics.
                </p>
              </div>
            ) : activeTab === "favourites" ? (
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-white">
                  <Heart className="w-8 h-8 text-red-500 fill-red-500/20" /> Saved Favourites
                </h1>
                <p className="text-muted-foreground mt-2 text-md">
                  Your tracked properties and portfolio estimations.
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary">
                  Location Intelligence
                </h1>
                <p className="text-muted-foreground mt-2 text-md">
                  Compare two global region metrics side-by-side.
                </p>
              </div>
            )}
            
            {activeTab === "overview" && (
              <div className="flex bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-md items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold tracking-wider text-green-400">
                  SYSTEM ONLINE
                </span>
              </div>
            )}
          </header>

          <AnimatePresence mode="wait">
             {activeTab === "overview" ? (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 auto-rows-min gap-6 pt-4"
                >
                  <div className="xl:col-span-2 xl:row-span-2">
                     <PredictorCard 
                       defaultLocation={selectedLocation} 
                       onLocationChange={(loc) => setSelectedLocation(loc)}
                       onCalculate={(loc) => setSelectedLocation(loc)} 
                       onAddFavourite={(fav) => {
                         setFeaturedProperties(prev => [fav, ...prev]);
                         setActiveTab("favourites");
                       }}
                     />
                  </div>
                  <div className="xl:col-span-1 xl:row-span-1"><InvestmentScoreCard /></div>
                  <div className="xl:col-span-1 xl:row-span-1"><ComparisonEngine /></div>
                  <div className="xl:col-span-2 xl:row-span-1"><TrendHistoryChart location={selectedLocation} /></div>
                  <div className="xl:col-span-4 h-[400px]"><InteractiveMapDynamic location={selectedLocation} /></div>
                </motion.div>
             ) : activeTab === "favourites" ? (
                <motion.div 
                  key="favourites"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
                >
                  {/* Featured Favourites Cards */}
                  <AnimatePresence mode="popLayout">
                    {featuredProperties.map((item, idx) => (
                      <motion.div 
                        key={item.location + idx} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: -30 }}
                        layout
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedFavCard(item)}
                        className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:border-primary/50 transition-colors group relative overflow-hidden cursor-pointer"
                      >
                         <div className="absolute top-0 right-0 p-3 z-10">
                           <button 
                             onClick={(e) => { 
                               e.stopPropagation(); 
                               setFeaturedProperties(prev => prev.filter((_, i) => i !== idx));
                             }}
                             className="p-2 hover:bg-red-500/20 rounded-xl group/btn transition-colors"
                             title="Remove from Favourites"
                           >
                             <Trash2 className="w-5 h-5 text-red-500 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                           </button>
                         </div>
                         <div className="w-12 h-12 bg-primary/10 rounded-xl mb-4 flex items-center justify-center border border-primary/20">
                           <Building2 className="w-6 h-6 text-primary" />
                         </div>
                         <h3 className="text-xl font-bold text-white mb-1">{item.location}</h3>
                         <div className="flex items-center gap-3 text-sm text-white/50 mb-6">
                           <span>{item.sqft} sqft</span>
                           <span>•</span>
                           <span>{item.bhk > 0 ? `${item.bhk} BHK` : 'Office'}</span>
                         </div>
                         <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                            <div>
                              <p className="text-xs text-white/40 mb-1">Live Estimate</p>
                              <p className="text-2xl font-black text-white">₹{item.price}</p>
                            </div>
                            <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold border border-green-500/30">
                              {item.trend}
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Add New Favourite Ghost Card */}
                  <div 
                    onClick={() => setActiveTab("overview")}
                    className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors min-h-[250px]"
                  >
                     <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                       <Plus className="w-6 h-6 text-white/60" />
                     </div>
                     <p className="font-medium text-white/80">Track New Property</p>
                     <p className="text-sm text-white/40 mt-1">Run an estimate and save it here</p>
                  </div>
                </motion.div>
             ) : (
                <ComparisonTabView key="compare" topRegions={topRegions} />
             )}
          </AnimatePresence>
        </div>

        {/* Favourites Item Detail Popup Modal */}
        <AnimatePresence>
          {selectedFavCard && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setSelectedFavCard(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-[#0B132B] border border-white/20 rounded-3xl shadow-2xl p-6 overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-4">
                   <button onClick={(e) => { e.stopPropagation(); setSelectedFavCard(null); }} className="text-white/50 hover:text-white transition-colors bg-white/5 rounded-full p-2 z-10 relative">
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 
                 <div className="w-16 h-16 bg-primary/20 rounded-2xl mb-6 flex items-center justify-center border border-primary/30 mt-2">
                   <Building2 className="w-8 h-8 text-primary" />
                 </div>
                 
                 <h2 className="text-2xl font-bold tracking-tight mb-3 pr-8">{selectedFavCard.location}</h2>
                 
                 <div className="flex flex-wrap items-center gap-3 mb-8">
                   <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm font-medium text-white/80">{selectedFavCard.sqft} sqft</div>
                   <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm font-medium text-white/80">{selectedFavCard.bhk > 0 ? `${selectedFavCard.bhk} BHK` : 'Commercial'}</div>
                   <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 text-sm font-bold">{selectedFavCard.trend} Trend</div>
                 </div>
                 
                 <div className="mb-8 p-5 bg-gradient-to-br from-black/50 to-primary/10 border border-primary/20 rounded-xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">Estimated Value</p>
                   <p className="text-4xl font-black text-white">₹{selectedFavCard.price}</p>
                 </div>
                 
                 <button 
                   onClick={() => {
                     setSelectedLocation(selectedFavCard.location);
                     setActiveTab("overview");
                     setSelectedFavCard(null);
                   }}
                   className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                 >
                   Analyze Detailed Insights
                 </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
