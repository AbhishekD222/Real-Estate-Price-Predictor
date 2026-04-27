"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, GitCompare, Loader2 } from "lucide-react";

export default function ComparisonEngine() {
  const [comparisons, setComparisons] = useState<{region: string, type: string, price_per_sqft: number, is_positive: boolean, trend: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const FALLBACK_COMPARISONS = [
      { region: "Bandra West", type: "Premium Zone", price_per_sqft: 42000, is_positive: true, trend: "+12.4%" },
      { region: "Andheri East", type: "Emerging Hub", price_per_sqft: 18500, is_positive: true, trend: "+8.1%" },
    ];

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    fetch(`${apiBase}/compare/top`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then(data => setComparisons(data.comparisons?.length ? data.comparisons : FALLBACK_COMPARISONS))
      .catch(() => setComparisons(FALLBACK_COMPARISONS))
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="h-full"
    >
      <Card className="h-full bg-card/60 backdrop-blur-xl border-white/10 shadow-lg shadow-black/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <GitCompare className="text-blue-400 w-5 h-5" />
            Location Compare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
             <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
             </div>
          ) : comparisons.length > 0 ? (
            comparisons.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                <div>
                  <p className="text-white font-medium">{item.region}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">₹{item.price_per_sqft.toLocaleString('en-IN')}/sqft</p>
                  <p className={`text-sm flex items-center justify-end ${item.is_positive ? 'text-green-400' : 'text-red-400'}`}>
                    {item.is_positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {item.trend}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/50 text-sm text-center py-4">No data available.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
