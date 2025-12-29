
"use client";

import React, { useEffect, useRef } from "react";

type LatLng = { lat: number; lng: number };

export type MapViewProps = {
  apiKey?: string;
  currentLocation: LatLng;
  destination: LatLng;
  /** optional 0..100 progress to snap vehicle to a position */
  progress?: number;
  fitBounds?: boolean;
  className?: string;
};

/* global google */
export default function MapView({
  apiKey,
  currentLocation,
  destination,
  progress,
  fitBounds = true,
  className,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const vehicleMarkerRef = useRef<google.maps.Marker | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);
  const animationRef = useRef<number | null>(null);
  const pathRef = useRef<google.maps.LatLngLiteral[]>([]);

  useEffect(() => {
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn("MapView: Google Maps API key missing.");
      return;
    }

    const existing = document.getElementById("google-maps-sdk") as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-maps-sdk";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => init();
    } else {
      if (!(window as any).google) {
        // wait until google is available
        const t = setInterval(() => {
          if ((window as any).google) {
            clearInterval(t);
            init();
          }
        }, 100);
      } else init();
    }

    function init() {
      if (!containerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(containerRef.current, {
          center: currentLocation,
          zoom: 14,
          streetViewControl: false,
          mapTypeControl: false,
        });
      }

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
      });
      directionsRenderer.setMap(mapRef.current);

      directionsService.route(
        {
          origin: currentLocation,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.setDirections(result);

            // Extract overview path
            const overviewPath = result.routes?.[0]?.overview_path ?? [];
            const path = overviewPath.map((p) => ({ lat: p.lat(), lng: p.lng() }));
            pathRef.current = path;
            drawPolyline(path);

            if (fitBounds && path.length && mapRef.current) {
              const bounds = new google.maps.LatLngBounds();
              path.forEach((pt) => bounds.extend(pt));
              mapRef.current.fitBounds(bounds, 80);
            }

            placeDestinationMarker(destination);
            placeVehicleMarker(currentLocation);
            startAnimation();
          } else {
            console.error("Directions failed:", status);
            // fallback markers
            placeDestinationMarker(destination);
            placeVehicleMarker(currentLocation);
          }
        }
      );
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // optionally remove polyline/markers if desired
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, currentLocation, destination]);

  // If external progress comes in, snap vehicle
  useEffect(() => {
    if (!pathRef.current || pathRef.current.length === 0 || progress == null) return;
    const pos = positionAtProgress(pathRef.current, Math.max(0, Math.min(1, progress / 100)));
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setPosition(pos);
      mapRef.current?.panTo(pos);
    }
  }, [progress]);

  function placeDestinationMarker(dest: LatLng) {
    new google.maps.Marker({
      position: dest,
      map: mapRef.current!,
      title: "Destination",
      label: { text: "🏠", fontSize: "14px" } as any,
    });
  }

  function placeVehicleMarker(pos: LatLng) {
    if (!vehicleMarkerRef.current) {
      vehicleMarkerRef.current = new google.maps.Marker({
        position: pos,
        map: mapRef.current!,
        title: "Delivery Partner",
        optimized: false,
        zIndex: 999,
        label: { text: "🚚", fontSize: "16px" } as any,
      });
    } else {
      vehicleMarkerRef.current.setPosition(pos);
    }
  }

  function drawPolyline(path: LatLng[]) {
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }
    routePolylineRef.current = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#0891b2",
      strokeOpacity: 0.95,
      strokeWeight: 4,
      map: mapRef.current!,
    });
  }

  function startAnimation() {
    const path = pathRef.current;
    if (!path || path.length === 0) return;
    const totalSteps = path.length * 60;
    let step = 0;
    const loop = () => {
      const t = step / totalSteps;
      const pos = positionAtProgress(path, t);
      vehicleMarkerRef.current?.setPosition(pos);
      if (mapRef.current && step % 10 === 0) mapRef.current.panTo(pos);
      step = (step + 1) % (totalSteps + 1);
      animationRef.current = requestAnimationFrame(loop);
    };
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(loop);
  }

  function positionAtProgress(path: LatLng[], t: number) {
    if (path.length === 0) return currentLocation;
    if (t <= 0) return path[0];
    if (t >= 1) return path[path.length - 1];

    const total = polylineLength(path);
    const target = total * t;

    let acc = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const seg = distance(a, b);
      if (acc + seg >= target) {
        const remain = target - acc;
        const ratio = seg === 0 ? 0 : remain / seg;
        return { lat: a.lat + (b.lat - a.lat) * ratio, lng: a.lng + (b.lng - a.lng) * ratio };
      }
      acc += seg;
    }
    return path[path.length - 1];
  }

  function polylineLength(path: LatLng[]) {
    let s = 0;
    for (let i = 0; i < path.length - 1; i++) s += distance(path[i], path[i + 1]);
    return s;
  }

  function distance(a: LatLng, b: LatLng) {
    const dx = a.lat - b.lat;
    const dy = a.lng - b.lng;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return <div ref={containerRef} className={className ?? "w-full h-96 rounded-lg overflow-hidden"} />;
}
