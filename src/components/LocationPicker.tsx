import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface PlaceResult {
  name: string;
  country: string;
  lat: number;
  lng: number;
  placeId: string;
}

interface LocationPickerProps {
  onSelect: (place: PlaceResult) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

// Singleton script loader so we only inject once
let scriptLoaded = false;
let scriptLoading = false;
const pendingCallbacks: Array<() => void> = [];

function loadGoogleMaps(callback: () => void) {
  if (scriptLoaded) {
    callback();
    return;
  }
  pendingCallbacks.push(callback);
  if (scriptLoading) return;
  scriptLoading = true;

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    scriptLoaded = true;
    pendingCallbacks.forEach((cb) => cb());
    pendingCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

export const LocationPicker = ({
  onSelect,
  defaultValue = "",
  placeholder = "Search city or location…",
  className,
}: LocationPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    loadGoogleMaps(() => {
      setLoading(false);
      if (!inputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
        fields: ["name", "address_components", "geometry", "place_id"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const country =
          place.address_components?.find((c) => c.types.includes("country"))
            ?.long_name ?? "";

        const result: PlaceResult = {
          name: place.name ?? "",
          country,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id ?? "",
        };

        onSelect(result);
        setValue(place.name ?? "");
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative ${className ?? ""}`}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
      )}
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10"
        disabled={loading}
      />
    </div>
  );
};
