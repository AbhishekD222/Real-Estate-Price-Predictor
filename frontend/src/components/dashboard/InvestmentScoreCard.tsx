"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TrendingUp } from "lucide-react";

export default function InvestmentScoreCard() {
  // Hardcoded for UI demo; could be fetched from backend
  const score = 8.5;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full bg-card/60 backdrop-blur-xl border-white/10 shadow-lg shadow-black/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500"></div>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white/90">
            <TrendingUp className="text-green-400 w-5 h-5" />
            Investment Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center flex-1 h-[calc(100%-4rem)]">
          <div className="w-40 h-40">
            <CircularProgressbar
              value={score * 10}
              text={`${score}`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: "var(--color-primary)",
                trailColor: "rgba(255,255,255,0.1)",
                textSize: "24px"
              })}
            />
          </div>
          <p className="mt-6 text-center text-sm text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
            &quot;Highly Recommended for Growth&quot;
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
