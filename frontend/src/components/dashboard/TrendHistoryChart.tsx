"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface TrendHistoryChartProps {
  location?: string;
}

export default function TrendHistoryChart({ location }: TrendHistoryChartProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch trends from backend
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const url = location 
        ? `${apiBase}/trends?region=${encodeURIComponent(location)}` 
        : `${apiBase}/trends`;
        
    fetch(url)
      .then(res => res.json())
      .then(d => setData(d.trends || []))
      .catch(e => console.error("Failed to fetch trends", e));
  }, [location]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="col-span-full xl:col-span-2 h-full"
    >
      <Card className="h-full bg-card/60 backdrop-blur-xl border-white/10 shadow-lg shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <Activity className="text-primary w-5 h-5" />
            10-Year Price Growth {location ? `· ${location}` : ""}
          </CardTitle>
          <CardDescription>Historical trends per square foot (INR)</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="avg_price_sqft" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorPrice)" activeDot={{r: 8}} />
              <Area type="monotone" dataKey="premium_price_sqft" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPremium)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
