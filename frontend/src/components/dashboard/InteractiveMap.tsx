"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

export default function InteractiveMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiBase}/locations`)
      .then(res => res.json())
      .then(data => setLocations(data.heatmap))
      .catch(e => console.error("Could not load heatmap", e));
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="col-span-full xl:col-span-2 h-full z-10"
    >
      <Card className="h-full bg-card/60 backdrop-blur-xl border-white/10 shadow-lg shadow-primary/20 flex flex-col pt-0 relative z-10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <MapPin className="text-destructive w-5 h-5" />
            Hot & Cold Price Zones
          </CardTitle>
          <CardDescription>Visualizing market demand using heatmap overlays</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] w-full mt-2 relative z-0">
          <MapContainer 
            center={[19.0760, 72.8777]} // Mumbai coordinates
            zoom={11} 
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%", borderRadius: "0.5rem", zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {locations.map((loc: {lat: number, lng: number, intensity: number}, i: number) => {
              // Red = hot (high intensity), Blue = cold (low intensity)
              const color = loc.intensity > 0.6 ? "#ef4444" : (loc.intensity > 0.3 ? "#eab308" : "#3b82f6");
              return (
                <CircleMarker 
                  key={i} 
                  center={[loc.lat, loc.lng]} 
                  radius={10} 
                  color="transparent" 
                  fillColor={color} 
                  fillOpacity={0.7}
                >
                  <LeafletTooltip direction="top" opacity={1}>
                    Intensity: {(loc.intensity * 100).toFixed(1)}%
                  </LeafletTooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
