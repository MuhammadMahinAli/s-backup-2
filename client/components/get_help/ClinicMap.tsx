"use client"

import { useEffect, useRef, useState } from "react";
import { clinics, type Clinic, ngos, clinicsByCategory } from "../../data/clinics.js";
import {
  Phone,
  Mail,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";

interface ClinicMapProps {
  selectedClinic?: Clinic;
  onClinicSelect: (clinic: Clinic) => void;
}

const ClinicMap = ({ selectedClinic, onClinicSelect }: ClinicMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedClinicData, setSelectedClinicData] = useState<Clinic | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  // Initialize map
  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !map) {
      // Dynamically import Leaflet to avoid SSR issues
      import("leaflet").then((L) => {
        // Fix for default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        const mapInstance = L.map(mapRef.current!).setView([3.0644, 101.5892], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance);

        setMap(mapInstance);
      });
    }
  }, [map]);

  // Add markers to map
  useEffect(() => {
    if (map && typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Clear existing markers
        markers.forEach((marker) => marker.remove());
        setMarkers([]);

        const newMarkers: any[] = [];

        // Custom icons for different clinic types
        const createCustomIcon = (category: string) => {
          const color = getMarkerColor(category);
          return L.divIcon({
            className: 'custom-clinic-marker',
            html: `
              <div style="
                width: 30px;
                height: 30px;
                background-color: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 8h2v8H4zm4-6h2v14H8z"/>
                  <path d="M12 2l-2 3h4l-2-3z"/>
                  <rect x="10" y="5" width="4" height="2"/>
                  <rect x="9" y="7" width="6" height="2"/>
                  <rect x="8" y="9" width="8" height="2"/>
                </svg>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });
        };

        clinics.forEach((clinic) => {
          const marker = L.marker([clinic.coordinates.lat, clinic.coordinates.lng], {
            icon: createCustomIcon(clinic.category)
          })
            .addTo(map)
            .on("click", (e) => {
              const rect = mapRef.current!.getBoundingClientRect();
              const point = map.latLngToContainerPoint(e.latlng);
              setPopupPosition({
                x: point.x,
                y: point.y - 10, // Offset above the marker
              });
              setSelectedClinicData(clinic);
              onClinicSelect(clinic);
            });

          newMarkers.push(marker);
        });

        setMarkers(newMarkers);

        // Fit map to show all markers
        if (clinics.length > 0) {
          const group = L.featureGroup(newMarkers);
          map.fitBounds(group.getBounds().pad(0.1));
        }
      });
    }
  }, [map, onClinicSelect]);

  // Handle selected clinic change
  useEffect(() => {
    if (map && selectedClinic) {
      map.setView([selectedClinic.coordinates.lat, selectedClinic.coordinates.lng], 15);
    }
  }, [map, selectedClinic]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setPopupPosition(null);
        setSelectedClinicData(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMarkerColor = (category: string) => {
    switch (category) {
      case "University": return "#4BB5B9";
      case "Public": return "#02A0A6"; 
      case "Private": return "#315E5B";
      default: return "#666";
    }
  };

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <div className="relative" data-map-container>
        <div
          ref={mapRef}
          className="w-full h-[500px] md:h-[600px] rounded-2xl border-2 border-gray-300 overflow-hidden shadow-xl"
          style={{ minHeight: "500px" }}
        />

        {/* Custom popup */}
        {popupPosition && selectedClinicData && (
          <div
            className="absolute z-[1000] w-80 max-w-[90vw] bg-white shadow-2xl border border-gray-200 rounded-xl p-4"
            style={{
              left: `${Math.min(popupPosition.x, (typeof window !== 'undefined' ? window.innerWidth : 800) - 320)}px`,
              top: `${Math.max(popupPosition.y - 250, 10)}px`,
            }}
          >
            <button
              onClick={() => {
                setPopupPosition(null);
                setSelectedClinicData(null);
              }}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={16} className="text-gray-600" />
            </button>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getMarkerColor(selectedClinicData.category) }}
                  ></div>
                  <span className="text-sm font-medium text-gray-600">{selectedClinicData.category}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 leading-tight">
                  {selectedClinicData.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{selectedClinicData.address}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-800">{selectedClinicData.phone}</span>
                </div>
                {selectedClinicData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-800">{selectedClinicData.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-800">{selectedClinicData.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-800">{selectedClinicData.cost}</span>
                </div>
              </div>

              {selectedClinicData.description && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedClinicData.description}</p>
                </div>
              )}

              <div className="space-y-2">
                {selectedClinicData.website && (
                  <a 
                    href={selectedClinicData.website.startsWith('http') ? selectedClinicData.website : `https://${selectedClinicData.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                <a
                  href={`https://maps.google.com/?q=${selectedClinicData.coordinates.lat},${selectedClinicData.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mt-4 sm:mt-6 justify-center">
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-health-light/50 rounded-2xl">
          <div className="w-3 h-3 bg-[#4BB5B9] rounded-full"></div>
          <span className="text-xs text-health-dark">University</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-health-light/50 rounded-2xl">
          <div className="w-3 h-3 bg-[#02A0A6] rounded-full"></div>
          <span className="text-xs text-health-dark">Public</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-health-light/50 rounded-2xl">
          <div className="w-3 h-3 bg-[#315E5B] rounded-full"></div>
          <span className="text-xs text-health-dark">Private</span>
        </div>
      </div>

      {/* NGO Information */}
      <div className="mt-6 p-4 bg-health-lighter/30 rounded-2xl">
        <h4 className="font-semibold text-health-dark mb-3">Non-Governmental Organizations (NGOs)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="p-3 bg-white rounded-lg shadow-sm border border-health-light/20">
              <h5 className="font-medium text-sm text-health-dark mb-1">{ngo.name}</h5>
              <p className="text-xs text-health-text mb-2">{ngo.description}</p>
              <div className="flex gap-2">
                {ngo.website && (
                  <a
                    href={ngo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-health-primary hover:text-health-secondary transition-colors"
                  >
                    <ExternalLink size={12} />
                    Website
                  </a>
                )}
                {ngo.whatsapp && (
                  <a
                    href={`https://wa.me/${ngo.whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                  >
                    <MessageCircle size={12} />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClinicMap;