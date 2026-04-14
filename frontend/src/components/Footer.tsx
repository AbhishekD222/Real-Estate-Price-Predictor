import Link from "next/link";
import { Building2, Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-tight text-white">Urban<span className="text-primary">Square</span></span>
          </div>
          <p className="text-sm text-white/50">&copy; {new Date().getFullYear()} UrbanSquare. Institutional Real-Time Data.</p>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-white/60">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Support</Link>
        </div>

        <div className="flex items-center gap-4 text-white/40">
          <Link href="#" className="hover:text-white transition-colors"><Globe className="w-5 h-5" /></Link>
          <Link href="#" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></Link>
          <Link href="#" className="hover:text-white transition-colors"><Phone className="w-5 h-5" /></Link>
        </div>
      </div>
    </footer>
  );
}
