"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Target } from "lucide-react";
import fallbackData from "@/lib/heatmapData.json";

interface HeatmapLocation {
  name?: string;
  lat: number;
  lng: number;
  intensity?: number;
  price?: number;
}

interface InteractiveMapProps {
  location?: string;
}

const createPulseIcon = () => {
  return L.divIcon({
    className: "bg-transparent border-none",
    html: `
      <div class="relative flex items-center justify-center w-12 h-12">
        <div class="absolute inline-flex w-full h-full bg-[#d4af37] opacity-40 rounded-full animate-ping"></div>
        <div class="absolute inline-flex w-8 h-8 bg-[#d4af37] opacity-30 rounded-full animate-pulse"></div>
        <div class="relative inline-flex w-4 h-4 bg-[#d4af37] rounded-full shadow-[0_0_20px_#d4af37] border-2 border-black z-10"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString()}`;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

function MapUpdater({ location }: { location?: string }) {
  const map = useMap();
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [exactPrice, setExactPrice] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - necessary state update
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExactPrice(null);
    if (!location) {
      map.flyTo([19.0760, 72.8777], 11, { duration: 2 });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - necessary state update
      setCoords(null);
      return;
    }

    const cleanLocation = location.trim().toLowerCase();
    const exactMatch = fallbackData.find(loc => loc.name?.trim().toLowerCase() === cleanLocation);
    
    if (exactMatch) {
       if (exactMatch.price) setExactPrice(exactMatch.price);
    }

    let isMounted = true;
    const fetchCoords = async () => {
      if (exactMatch && isMounted) {
         setCoords([exactMatch.lat, exactMatch.lng]);
         map.flyTo([exactMatch.lat, exactMatch.lng], 14, { duration: 2.5, easeLinearity: 0.25 });
         return;
      }

      try {
        const query = encodeURIComponent(`${location}, Mumbai, Maharashtra, India`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
        const data = await res.json();
        
        if (data && data.length > 0 && isMounted) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoords([lat, lon]);
          map.flyTo([lat, lon], 14, { duration: 2.5, easeLinearity: 0.25 });
        }
      } catch (e) {
        console.error("Geocoding failed", e);
      }
    };

    const timer = setTimeout(fetchCoords, 500); // debounce API calls
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [location, map]);

  return coords ? (
    <>
      <CircleMarker 
        center={coords} 
        radius={140} 
        color="#d4af37" 
        weight={1} 
        fillColor="#d4af37" 
        fillOpacity={0.05} 
        dashArray="5, 10"
      />
      <Marker position={coords} icon={createPulseIcon()}>
        <LeafletTooltip 
          permanent={true} 
          direction="top" 
          offset={[0, -15]} 
          opacity={1} 
          className="bg-white text-black border-gray-200 shadow-xl rounded-md px-3 py-1.5 font-sans z-[600]"
        >
          <div className="font-bold text-sm tracking-tight">{location}</div>
          <div className="text-xs text-black/60 font-semibold mt-0.5">
             {exactPrice ? `Avg Value: ${formatPrice(exactPrice)}` : 'Target Analysis Zone'}
          </div>
        </LeafletTooltip>
      </Marker>
    </>
  ) : null;
}

const getPriceColor = (price: number) => {
  if (price >= 50000000) return { color: "#ef4444", tier: "Premium (> 5 Cr)", radius: 14, opacity: 0.8 }; // Red
  if (price >= 25000000) return { color: "#f97316", tier: "High (2.5 - 5 Cr)", radius: 12, opacity: 0.7 }; // Orange
  if (price >= 10000000) return { color: "#eab308", tier: "Mid (1 - 2.5 Cr)", radius: 10, opacity: 0.6 }; // Yellow
  if (price >= 5000000) return { color: "#22c55e", tier: "Affordable (50L - 1 Cr)", radius: 8, opacity: 0.5 }; // Green
  return { color: "#3b82f6", tier: "Budget (< 50L)", radius: 6, opacity: 0.4 }; // Blue
};

export default function InteractiveMap({ location }: InteractiveMapProps) {
  const [locations, setLocations] = useState<HeatmapLocation[]>(fallbackData);

  useEffect(() => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    fetch(`${apiBase}/locations`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then(data => {
        // If backend provides specific pricing heatmap data, use it, otherwise keep fallback
        if (data.heatmap && data.heatmap.length > 0) {
           setLocations(data.heatmap);
        }
      })
      .catch(e => {
        console.error("Could not load heatmap", e);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  }, []);

  let targetLat: number | null = null;
  let targetLng: number | null = null;
  if (location) {
    const cleanLocation = location.trim().toLowerCase();
    const exactMatch = fallbackData.find(loc => loc.name?.trim().toLowerCase() === cleanLocation);
    if (exactMatch) {
       targetLat = exactMatch.lat;
       targetLng = exactMatch.lng;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="col-span-full xl:col-span-2 h-full z-10"
    >
      <Card className="h-full bg-card/60 backdrop-blur-xl border-white/10 shadow-lg shadow-primary/20 flex flex-col pt-0 relative z-10 overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-xl font-bold flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-destructive/20 rounded-lg border border-destructive/30 flex items-center justify-center">
                 <MapPin className="text-destructive w-4 h-4" />
              </div>
              Real-Time Price Map
            </div>
            {location && (
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold text-primary animate-in fade-in zoom-in duration-500">
                <Target className="w-3.5 h-3.5" />
                Tracking: {location}
              </div>
            )}
          </CardTitle>
          <CardDescription>Visualizing {locations.length} locations by average property prices</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] w-full mt-2 relative z-0 p-4 pt-0">
          <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-inner relative">
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none z-50" />
            
            <MapContainer 
              center={[19.0760, 72.8777]} // Default Mumbai center
              zoom={11} 
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", zIndex: 1, backgroundColor: "#000" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              <MapUpdater location={location} />

              {locations.map((loc, i) => {
                // If it's pure intensity, fallback to old logic. But if it has price, use new logic.
                let displayColor = "#ef4444";
                let displayRadius = 10;
                let displayOpacity = 0.7;
                if (loc.price) {
                  const style = getPriceColor(loc.price);
                  displayColor = style.color;
                  displayRadius = style.radius;
                  displayOpacity = style.opacity;
                } else if (loc.intensity) {
                  const isHot = loc.intensity > 0.6;
                  const isWarm = loc.intensity > 0.3;
                  displayColor = isHot ? "#ef4444" : (isWarm ? "#eab308" : "#3b82f6");
                  displayRadius = isHot ? 14 : (isWarm ? 10 : 8);
                  displayOpacity = isHot ? 0.8 : 0.5;
                }

                let isNearby = false;
                if (targetLat && targetLng && loc.lat && loc.lng) {
                   const dist = getDistance(targetLat, targetLng, loc.lat, loc.lng);
                   if (dist <= 3.5 && dist > 0.1) isNearby = true; // Within 3.5km but exclude the target itself
                }

                return (
                  <CircleMarker 
                    key={i} 
                    center={[loc.lat, loc.lng]} 
                    radius={displayRadius} 
                    color="transparent" 
                    fillColor={displayColor} 
                    fillOpacity={displayOpacity}
                  >
                    <LeafletTooltip 
                      permanent={isNearby} 
                      direction="top" 
                      opacity={isNearby ? 0.95 : 0.9} 
                      className={`shadow-sm rounded px-1.5 py-0.5 ${isNearby ? 'bg-white text-black border border-gray-200 z-[500]' : 'bg-black/90 text-white border-white/10 z-[400]'}`}
                    >
                      <span className={`font-bold whitespace-nowrap tracking-tight ${isNearby ? 'text-[10px]' : 'text-[10px]'}`}>
                        {loc.name ? `${loc.name} : ` : ''}
                        <span style={{ color: displayColor }}>
                          {loc.price ? formatPrice(loc.price) : ''}
                        </span>
                      </span>
                    </LeafletTooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Custom map legend overlay for Price Tiers */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg z-[400] flex flex-col gap-2 shadow-2xl">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Avg Price Zone</span>
              <div className="flex items-center gap-2 text-xs text-white">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> &gt; 5 Cr
              </div>
              <div className="flex items-center gap-2 text-xs text-white">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span> 2.5 - 5 Cr
              </div>
              <div className="flex items-center gap-2 text-xs text-white">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span> 1 - 2.5 Cr
              </div>
              <div className="flex items-center gap-2 text-xs text-white">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> 50L - 1 Cr
              </div>
              <div className="flex items-center gap-2 text-xs text-white">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> &lt; 50L
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
