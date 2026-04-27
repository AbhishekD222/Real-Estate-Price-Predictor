"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, Phone, MapPin, 
  Building2, Shield, Save, CheckCircle, Edit3, Globe, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bio: string;
  company: string;
  website: string;
  avatar: string;
  weeklyReport: boolean;
  priceAlerts: boolean;
}

const defaultProfile: UserProfile = {
  name: "Guest Explorer",
  email: "guest@urbansquare.com",
  role: "Trial Access",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  bio: "",
  company: "",
  website: "",
  avatar: "",
  weeklyReport: true,
  priceAlerts: false,
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isMounted, setIsMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "contact" | "preferences">("profile");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const base = localStorage.getItem('urbanUser');
      const extras = localStorage.getItem('urbanUserProfile');
      setProfile({
        ...defaultProfile,
        ...(base ? JSON.parse(base) : {}),
        ...(extras ? JSON.parse(extras) : {}),
      });
    } catch {
      // ignore
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Save core identity to urbanUser for navbar re-hydration
    localStorage.setItem("urbanUser", JSON.stringify({
      name: profile.name,
      email: profile.email,
      role: profile.role,
    }));
    // Save extended profile
    localStorage.setItem("urbanUserProfile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const getInitials = (name: string) =>
    name ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "US";

  const field = (
    label: string,
    key: keyof UserProfile,
    placeholder: string,
    icon: React.ReactNode,
    type = "text"
  ) => (
    <div className="space-y-1.5">
      <label className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={profile[key] as string}
        onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/50 transition-all text-sm"
      />
    </div>
  );

  const sections = [
    { id: "profile" as const, label: "Profile Info", icon: <User className="w-4 h-4" /> },
    { id: "contact" as const, label: "Contact & Address", icon: <MapPin className="w-4 h-4" /> },
    { id: "preferences" as const, label: "Preferences", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B132B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.12),rgba(11,19,43,1))] text-white flex flex-col font-sans">
      {!isMounted ? null : (
        <>

      {/* Sticky Nav */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <Link href="/dashboard" className="shiny-sweep-container flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity rounded-lg px-2 py-1">
            <div className="p-1.5 bg-primary/20 rounded border border-primary/30">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-white">Urban<span className="text-primary">Square</span></span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Account Settings
          </h1>
          <p className="text-white/40 mt-2 text-sm">Manage your profile, contact details, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* Left Sidebar — Avatar + Nav */}
          <div className="space-y-4">

            {/* Avatar Card */}
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />

              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary text-2xl font-black overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  {profile.avatar
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    : getInitials(profile.name)
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center shadow-lg hover:bg-primary/80 transition-colors"
                  title="Change photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <p className="font-bold text-white text-lg leading-tight">{profile.name}</p>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mt-0.5">{profile.role}</p>
              <p className="text-white/40 text-xs mt-1 truncate">{profile.email}</p>

              <button
                onClick={() => fileRef.current?.click()}
                className="mt-4 w-full py-2 text-xs bg-white/5 border border-white/10 rounded-xl hover:bg-primary/10 hover:border-primary/30 text-white/60 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>

            {/* Section Nav */}
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            <div className="p-6 border-b border-white/10">
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                {sections.find(s => s.id === activeSection)?.icon}
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">

                {activeSection === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {field("Full Name", "name", "e.g. Rahul Sharma", <User className="w-3.5 h-3.5" />)}
                    {field("Email Address", "email", "e.g. rahul@email.com", <Mail className="w-3.5 h-3.5" />, "email")}
                    {field("Company / Organisation", "company", "e.g. Sharma Realty Pvt Ltd", <Briefcase className="w-3.5 h-3.5" />)}
                    {field("Website", "website", "e.g. https://sharma.in", <Globe className="w-3.5 h-3.5" />, "url")}

                    <div className="space-y-1.5">
                      <label className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" /> Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us a bit about yourself..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/50 transition-all text-sm resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Membership Tier</label>
                      <div className="flex gap-3 flex-wrap">
                        {["Trial Access", "Pro Investor", "Enterprise"].map(tier => (
                          <button
                            key={tier}
                            onClick={() => setProfile(prev => ({ ...prev, role: tier }))}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                              profile.role === tier
                                ? "bg-primary/20 border-primary/50 text-primary"
                                : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30"
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === "contact" && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {field("Phone Number", "phone", "e.g. +91 98765 43210", <Phone className="w-3.5 h-3.5" />, "tel")}
                    {field("Street Address", "address", "e.g. 12, Marine Drive", <MapPin className="w-3.5 h-3.5" />)}
                    <div className="grid grid-cols-2 gap-4">
                      {field("City", "city", "e.g. Mumbai", <Building2 className="w-3.5 h-3.5" />)}
                      {field("State", "state", "e.g. Maharashtra", <Globe className="w-3.5 h-3.5" />)}
                    </div>
                    {field("PIN Code", "pincode", "e.g. 400001", <Shield className="w-3.5 h-3.5" />)}
                  </motion.div>
                )}

                {activeSection === "preferences" && (
                  <motion.div
                    key="prefs"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <p className="text-white/40 text-xs mb-4">Control your notification and data preferences.</p>
                    {[
                      { key: "weeklyReport" as const, label: "Receive weekly market trend reports", desc: "A curated summary of top gainers & losers every Monday." },
                      { key: "priceAlerts" as const, label: "Real-time price spike alerts", desc: "Instant browser notification when tracked areas surge >3%." },
                    ].map(({ key, label, desc }) => (
                      <label key={key} className="flex items-start gap-4 cursor-pointer p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={profile[key] as boolean}
                            onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            profile[key] ? "bg-primary border-primary" : "bg-black/40 border-white/20 group-hover:border-white/40"
                          }`}>
                            {profile[key] && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{label}</p>
                          <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky Save Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between bg-black/20">
              <Link
                href="/dashboard"
                className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-bold"
                  >
                    <CheckCircle className="w-4 h-4" /> Saved Successfully!
                  </motion.div>
                ) : (
                  <motion.button
                    key="save"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] text-sm"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
        </>
      )}
    </div>
  );
}
