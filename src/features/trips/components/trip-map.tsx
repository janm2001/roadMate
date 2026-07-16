"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { MapPinned } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MapPoint = {
  latitude: number;
  longitude: number;
  label: string;
};

type TripMapProps = {
  apiKey: string | null;
  encodedPolyline: string | null;
  points: MapPoint[];
};

export function TripMap({ apiKey, encodedPolyline, points }: TripMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!apiKey || !encodedPolyline || !containerRef.current) {
      return;
    }

    let cancelled = false;
    const initialize = async () => {
      try {
        setOptions({ key: apiKey, v: "weekly" });
        const [{ Map, Polyline }, { LatLngBounds }, { encoding }] = await Promise.all([
          importLibrary("maps") as Promise<google.maps.MapsLibrary>,
          importLibrary("core") as Promise<google.maps.CoreLibrary>,
          importLibrary("geometry") as Promise<google.maps.GeometryLibrary>,
        ]);

        if (cancelled || !containerRef.current) {
          return;
        }

        const path = encoding.decodePath(encodedPolyline);
        const bounds = new LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        const map = new Map(containerRef.current, {
          center: path[0],
          zoom: 7,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        new Polyline({
          map,
          path,
          strokeColor: "#315c44",
          strokeOpacity: 1,
          strokeWeight: 5,
        });
        points.forEach((point) => {
          const position = { lat: point.latitude, lng: point.longitude };
          bounds.extend(position);
          new google.maps.Marker({ map, position, title: point.label });
        });
        map.fitBounds(bounds, 36);
      } catch {
        setFailed(true);
      }
    };

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [apiKey, encodedPolyline, points]);

  if (!apiKey || !encodedPolyline || failed) {
    return (
      <div className="flex aspect-[16/9] min-h-64 items-center justify-center border-y bg-muted/50 px-6 text-center">
        <div>
          <MapPinned className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold">Map unavailable</p>
          <p className="mt-1 text-xs text-muted-foreground">
            The ordered stop list remains available below.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="aspect-[16/9] min-h-64 w-full" />;
}
