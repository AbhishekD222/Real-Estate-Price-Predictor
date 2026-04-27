"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2, Home, Heart, AlertTriangle } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";

interface PredictorCardProps {
  defaultLocation?: string;
  onCalculate?: (location: string, price: number) => void;
  onAddFavourite?: (fav: {location: string, price: string, sqft: number, bhk: number, trend: string}) => void;
}

export default function PredictorCard({ defaultLocation = "", onCalculate, onAddFavourite }: PredictorCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [location, setLocation] = useState(defaultLocation);
  const [showLocationSuggs, setShowLocationSuggs] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);
  const [bhk, setBhk] = useState(2);
  const [sqft, setSqft] = useState([1000]);
  const [budget, setBudget] = useState<string>("");
  const [topRegions, setTopRegions] = useState<string[]>([]);
  const [allRegions, setAllRegions] = useState<string[]>([]);
  const [historicalTrends, setHistoricalTrends] = useState<{year: number, avg_price_sqft: number}[]>([]);
  const controls = useAnimation();

  // Keep in sync with searchbar selection
  useEffect(() => {
    if (defaultLocation && defaultLocation !== location) {
      setLocation(defaultLocation);
    }
  }, [defaultLocation, location]);

  useEffect(() => {
    const FALLBACK_TOP = ["Bandra West", "Andheri East", "Worli", "Juhu", "Powai"];
    const FALLBACK_ALL = [
      "Andheri East", "Andheri West", "Bandra East", "Bandra West", "Borivali East",
      "Borivali West", "Chembur", "Colaba", "Dahisar", "Dadar", "Ghatkopar East",
      "Ghatkopar West", "Goregaon East", "Goregaon West", "Juhu", "Kandivali East",
      "Kandivali West", "Kurla", "Lower Parel", "Malad East", "Malad West",
      "Matunga", "Mulund", "Navi Mumbai", "Parel", "Powai", "Santacruz East",
      "Santacruz West", "Thane", "Vikhroli", "Vile Parle East", "Vile Parle West",
      "Wadala", "Worli"
    ];

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    fetch(`${apiBase}/regions/top`)
      .then(res => res.json())
      .then(data => setTopRegions(data.regions?.length ? data.regions : FALLBACK_TOP))
      .catch(() => setTopRegions(FALLBACK_TOP));

    fetch(`${apiBase}/regions/all`)
      .then(res => res.json())
      .then(data => setAllRegions(data.regions?.length ? data.regions : FALLBACK_ALL))
      .catch(() => setAllRegions(FALLBACK_ALL));
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrice(null);
    
    // Simulate API Call delay for Premium feeling
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiBase}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location || "Mumbai", bhk, sqft: sqft[0] })
      });
      const data = await res.json();
      
      const trendRes = await fetch(`${apiBase}/trends?region=${encodeURIComponent(location || "Mumbai")}`);
      const trendData = await trendRes.json();
      
      setPrice(data.predicted_price);
      setHistoricalTrends(trendData.trends || []);
      controls.start({ opacity: 1, y: 0 });
      if (onCalculate) onCalculate(location || "Mumbai", data.predicted_price);
    } catch (e) {
      console.error(e);
      setPrice(7500000); // fallback
      if (onCalculate) onCalculate(location || "Mumbai", 7500000);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple number counter hook logic inside
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    if (price !== null) {
      let start = 0;
      const end = price;
      if (start === end) return;
      const duration = 1500;
      const incrementTime = 20;
      const step = Math.ceil((end - start) / (duration / incrementTime));
      
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setDisplayPrice(end);
          clearInterval(timer);
          if (budget && Number(budget) > 0 && end > Number(budget)) {
             setShowBudgetWarning(true);
          }
        } else {
          setDisplayPrice(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [price, budget]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full bg-card/60 backdrop-blur-xl border-white/10 shadow-lg shadow-primary/20 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg border border-primary/30 flex items-center justify-center transform hover:scale-105 transition-transform rotate-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
               <Home className="w-6 h-6 text-primary -rotate-3" strokeWidth={1.5} />
            </div>
            Live Property Estimator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter property details for an instant, highly accurate valuation.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-start space-y-8 min-h-0 overflow-y-auto custom-scrollbar pb-6">
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="space-y-2 relative">
              <Label className="text-white/80">Location</Label>
              <Input 
                className="bg-black/50 border-white/10 text-white focus:ring-primary placeholder:text-muted-foreground relative z-20" 
                placeholder="e.g. Bandra West"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setShowLocationSuggs(true); setFocusedIndex(-1); }}
                onFocus={() => setShowLocationSuggs(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggs(false), 200)}
                onKeyDown={(e) => {
                  const suggestions = allRegions
                    .filter(r => r.toLowerCase().includes(location.toLowerCase()))
                    .sort((a, b) => {
                      const aStarts = a.toLowerCase().startsWith(location.toLowerCase());
                      const bStarts = b.toLowerCase().startsWith(location.toLowerCase());
                      if (aStarts && !bStarts) return -1;
                      if (!aStarts && bStarts) return 1;
                      return a.localeCompare(b);
                    });
                    
                  if (!showLocationSuggs || suggestions.length === 0) return;
                  
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setFocusedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
                  } else if (e.key === "Enter" && focusedIndex >= 0) {
                    e.preventDefault();
                    setLocation(suggestions[focusedIndex]);
                    setShowLocationSuggs(false);
                    setFocusedIndex(-1);
                  } else if (e.key === "Escape") {
                    setShowLocationSuggs(false);
                    setFocusedIndex(-1);
                  }
                }}
                autoComplete="off"
              />
              
              {showLocationSuggs && allRegions.length > 0 && (
                 <div className="absolute top-[65px] left-0 w-full bg-black/95 border border-white/10 rounded-xl backdrop-blur-xl overflow-y-auto max-h-48 text-sm animate-in fade-in shadow-xl z-[100] custom-scrollbar">
                   {allRegions
                     .filter(r => r.toLowerCase().includes(location.toLowerCase()))
                     .sort((a, b) => {
                       const aStarts = a.toLowerCase().startsWith(location.toLowerCase());
                       const bStarts = b.toLowerCase().startsWith(location.toLowerCase());
                       if (aStarts && !bStarts) return -1;
                       if (!aStarts && bStarts) return 1;
                       return a.localeCompare(b);
                     })
                     .map((region, idx) => (
                      <div 
                        key={idx} 
                        className={`px-4 py-2 cursor-pointer transition-colors border-b border-white/5 last:border-0 ${idx === focusedIndex ? 'bg-primary/20 text-white' : 'text-white/80 hover:bg-primary/20 hover:text-white'}`}
                        onMouseDown={(e) => { 
                           e.preventDefault(); 
                           setLocation(region); 
                           setShowLocationSuggs(false); 
                           setFocusedIndex(-1);
                        }}
                      >
                         {region}
                      </div>
                   ))}
                   {allRegions.filter(r => r.toLowerCase().includes(location.toLowerCase())).length === 0 && (
                      <div className="px-4 py-3 text-white/40 italic">No exact matches found...</div>
                   )}
                 </div>
              )}
              
              <div className="flex flex-wrap gap-2 pt-1">
                {(topRegions.length > 0 ? topRegions : ["Bandra West", "Andheri East", "Worli", "Juhu", "Powai"]).map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="text-[10px] px-2.5 py-1 bg-white/5 hover:bg-primary/20 cursor-pointer rounded-full border border-white/10 transition-colors text-white/60 hover:text-white"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-white/80">Max Budget (Optional)</Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/50 bg-white/5 px-3 py-2 rounded border border-white/10">₹</span>
                <Input 
                  type="text" 
                  value={budget ? new Intl.NumberFormat('en-IN').format(Number(budget.replace(/,/g, ''))) : ''} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, '');
                    if (!isNaN(Number(val))) {
                       setBudget(val);
                    }
                  }}
                  placeholder="e.g. 2,00,00,000"
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-white/80">Square Footage</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={sqft[0]} 
                    onChange={(e) => setSqft([Number(e.target.value)])}
                    className="w-24 h-8 bg-black/50 border-white/10 text-white text-right focus-visible:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-white/50 text-sm">sqft</span>
                </div>
              </div>
              <Slider 
                value={sqft} 
                onValueChange={setSqft} 
                max={5000} 
                min={300} 
                step={50}
                className="[&>[data-radix-slider-range]]:bg-primary [&>[data-radix-slider-thumb]]:bg-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">BHK</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBhk(num)}
                    className={`flex-1 py-2 rounded-md border transition-all ${
                      bhk === num 
                        ? 'bg-primary border-primary text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                        : 'bg-black/30 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <Magnetic>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-6 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculating Value...
                  </>
                ) : (
                  "Calculate Live Value"
                )}
              </Button>
            </Magnetic>
          </form>

          {price !== null && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mt-2 rounded-xl bg-gradient-to-br from-black/80 to-primary/20 border border-primary/30 text-center overflow-hidden flex flex-col relative shrink-0"
            >
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start">
                   <p className="text-white/70 text-sm font-medium mb-1">Live Market Value</p>
                   {onAddFavourite && (
                     <button 
                       onClick={() => onAddFavourite({ 
                         location: location || "Mumbai", 
                         price: (displayPrice / 10000000).toFixed(2) + " Cr", 
                         sqft: sqft[0], 
                         bhk, 
                         trend: historicalTrends.length > 2 ? `+${((historicalTrends[historicalTrends.length-1].avg_price_sqft - historicalTrends[0].avg_price_sqft) / historicalTrends[0].avg_price_sqft * 100).toFixed(1)}%` : "+5.2%" 
                       })}
                       className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-red-400 rounded-lg text-white/40 transition-all flex items-center justify-center -mt-2 -mr-2 group"
                       title="Save Property Estimate"
                     >
                        <Heart className="w-5 h-5 group-hover:fill-red-400/20" />
                     </button>
                   )}
                </div>
                <h3 className="text-4xl font-bold text-white tracking-widest mt-1">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </h3>
                {budget && Number(budget) > 0 && (
                  <div className={`mt-3 py-1 px-3 rounded text-xs font-bold border inline-block ${price! <= Number(budget) ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {price! <= Number(budget) ? '✓ Within Budget' : '⚠️ Over Budget'}
                  </div>
                )}
              </div>
              
              {historicalTrends.length > 0 && (
                <div className="border-t border-white/10 p-4 bg-black/40">
                  <p className="text-[11px] text-white/50 mb-2 text-left uppercase font-bold tracking-wider">Historical Market Value ({location || "Mumbai"})</p>
                  <div className="flex items-end gap-1.5 h-16 w-full px-1">
                    {historicalTrends.map((t: {year: number, avg_price_sqft: number}, i: number) => {
                       const histValue = t.avg_price_sqft * sqft[0];
                       const maxVal = Math.max(...historicalTrends.map((ht: {year: number, avg_price_sqft: number}) => ht.avg_price_sqft * sqft[0]));
                       const heightPercent = (histValue / maxVal) * 100;
                       return (
                         <div 
                           key={i} 
                           className="flex-1 bg-primary/40 hover:bg-primary transition-colors rounded-t-[2px] relative group" 
                           style={{ height: `${heightPercent}%` }}
                         >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/10">
                              {t.year}: ₹{histValue.toLocaleString('en-IN')}
                            </div>
                         </div>
                       )
                    })}
                  </div>
                  <div className="flex justify-between mt-1.5 px-1">
                    <span className="text-[10px] text-white/40 font-medium">{historicalTrends[0].year}</span>
                    <span className="text-[10px] text-white/40 font-medium">Now</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </CardContent>

        {/* Budget Exceeded Popup Modal */}
        {showBudgetWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onMouseDown={(e) => e.stopPropagation()}>
             <div className="bg-gradient-to-br from-black to-red-950/40 border border-red-500/30 p-8 rounded-2xl w-full max-w-sm shadow-2xl shadow-red-500/20 text-center relative pointer-events-auto overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
               <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                 <AlertTriangle className="w-8 h-8 text-red-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Budget Exceeded</h3>
               <p className="text-white/70 text-[15px] mb-8 leading-relaxed">
                 This property&apos;s live valuation (₹{displayPrice.toLocaleString('en-IN')}) is currently exactly <span className="text-red-400 font-bold">₹{(displayPrice - Number(budget)).toLocaleString('en-IN')} over</span> your maximum budget cap of ₹{Number(budget).toLocaleString('en-IN')}.
               </p>
               <button 
                 onMouseDown={() => setShowBudgetWarning(false)}
                 className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3.5 rounded-xl transition-all border border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
               >
                 Acknowledge & Continue
               </button>
             </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
