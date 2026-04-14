"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white flex flex-col font-sans">
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50 p-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
           <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
      </nav>
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-8">
         <h1 className="text-3xl font-bold">Billing & Plans</h1>
         <div className="bg-card/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-primary">Active Plan: PRO Member</h2>
            <p className="text-white/60 mb-6">You currently have unlimited access to the real-time estimating ML models, comparing features, and historical trend data.</p>
            <div className="flex items-center gap-4">
               <button className="px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition">Manage Subscription</button>
               <button className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition">Payment Methods</button>
            </div>
         </div>
      </main>
      <Footer />
    </div>
  );
}
