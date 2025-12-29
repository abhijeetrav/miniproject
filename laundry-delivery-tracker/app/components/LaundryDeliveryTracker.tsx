
// // components/LaundryDeliveryTracker.tsx
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { db } from "../../lib/firebase"; // keep if your alias works; otherwise use relative path
// import { ref, onValue } from "firebase/database";
// import { dbAdmin } from "@/lib/firebaseAdmin";

// type LatLng = { lat: number; lng: number };

// interface Props {
//   orderId: string;
//   destination: LatLng;
// }

// export default function LaundryDeliveryTracker({ orderId, destination }: Props) {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const vehicleMarkerRef = useRef<google.maps.Marker | null>(null);
//   const destMarkerRef = useRef<google.maps.Marker | null>(null);
//   const polylineRef = useRef<google.maps.Polyline | null>(null);
//   const scriptRef = useRef<HTMLScriptElement | null>(null);

//   const [status, setStatus] = useState<string>("Loading...");
//   const [eta, setEta] = useState<number | null>(null);
//   const [progress, setProgress] = useState<number>(0);
//   const [lastUpdate, setLastUpdate] = useState<string>("--");
//   const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);

//   // Load Google Maps script and init map
//   useEffect(() => {
//     const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
//     if (!key) {
//       console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set");
//       return;
//     }

//     let mounted = true;
//     const existing = document.getElementById("google-maps-sdk") as HTMLScriptElement | null;

//     function initMapOnce() {
//       if (!mounted || !mapContainerRef.current) return;
//       if (!mapRef.current) {
//         mapRef.current = new google.maps.Map(mapContainerRef.current, {
//           center: destination,
//           zoom: 13,
//           streetViewControl: false,
//           mapTypeControl: false,
//         });
//       }

//       if (!destMarkerRef.current) {
//         destMarkerRef.current = new google.maps.Marker({
//           position: destination,
//           map: mapRef.current,
//           title: "Destination",
//           label: { text: "🏠" } as any,
//         });
//       } else {
//         destMarkerRef.current.setPosition(destination);
//       }

//       if (!polylineRef.current) {
//         polylineRef.current = new google.maps.Polyline({
//           path: [],
//           geodesic: true,
//           strokeColor: "#0891b2",
//           strokeOpacity: 0.9,
//           strokeWeight: 4,
//           map: mapRef.current,
//         });
//       }
//     }

//     if (!existing) {
//       const s = document.createElement("script");
//       s.id = "google-maps-sdk";
//       s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
//       s.async = true;
//       s.defer = true;
//       s.onload = () => initMapOnce();
//       document.head.appendChild(s);
//       scriptRef.current = s;
//     } else {
//       if ((window as any).google?.maps) initMapOnce();
//       else existing.addEventListener("load", initMapOnce, { once: true });
//     }

//     return () => {
//       mounted = false;
//       // keep global script (do NOT remove) to avoid breaking other components
//     };
//   }, [destination]);

//   // Firebase realtime listeners (client)
//   useEffect(() => {
//     if (!db) return;
//     const locRef = ref(db, `orders/${orderId}/location`);
//     const statusRef = ref(db, `orders/${orderId}/status`);

//     const unsubLoc = onValue(locRef, (snap) => {
//       const val = snap.val();
//       if (!val) return;
//       const { lat, lng, updatedAt } = val;
//       if (typeof lat === "number" && typeof lng === "number") {
//         const loc = { lat, lng };
//         setDriverLocation(loc);
//         setLastUpdate(updatedAt ? new Date(updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString());

//         if (mapRef.current) {
//           if (!vehicleMarkerRef.current) {
//             vehicleMarkerRef.current = new google.maps.Marker({
//               position: loc,
//               map: mapRef.current,
//               title: "Delivery Boy",
//               label: { text: "🚚" } as any,
//             });
//           } else {
//             vehicleMarkerRef.current.setPosition(loc);
//           }

//           // update polyline (driver -> dest)
//           const destPos = destMarkerRef.current?.getPosition();
//           const path: google.maps.LatLngLiteral[] = [{ lat, lng }];
//           if (destPos) path.push({ lat: destPos.lat(), lng: destPos.lng() });
//           if (polylineRef.current) polylineRef.current.setPath(path as any);

//           try {
//             mapRef.current.panTo(loc);
//           } catch {
//             /* ignore pan errors */
//           }
//         }
//       }
//     });

//     const unsubStatus = onValue(statusRef, (snap) => {
//       const val = snap.val();
//       if (!val) return;
//       setStatus(val.status ?? "N/A");
//       setProgress(typeof val.progress === "number" ? val.progress : 0);
//       setEta(typeof val.eta === "number" ? val.eta : null);
//     });

//     return () => {
//       try { unsubLoc(); } catch {}
//       try { unsubStatus(); } catch {}
//       if (vehicleMarkerRef.current) { vehicleMarkerRef.current.setMap(null); vehicleMarkerRef.current = null; }
//       if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }
//       if (destMarkerRef.current) { destMarkerRef.current.setMap(null); destMarkerRef.current = null; }
//     }; 
//   }, [orderId]);

//   const stages = ["Order Placed", "Picked Up", "Washing", "Ironing", "Out for Delivery", "Delivered"];
//   const currentIndex = stages.indexOf(status);

//   return (
//     <div className="w-full h-screen flex flex-col bg-white">
//       <div className="bg-sky-700 text-white p-4 flex justify-between items-center">
//         <div>
//           <h2 className="text-lg font-semibold">Order #{orderId}</h2>
//           <p className="text-sm text-sky-200">Live Laundry Tracker</p>
//         </div>
//         <div className="text-right">
//           <p className="font-semibold text-sm">ETA: {eta ?? "--"} min</p>
//           <p className="text-xs text-sky-200">Last: {lastUpdate}</p>
//         </div>
//       </div>
//     </div>

//   );
// }


//yaha se source code dusra hai
// components/LaundryDeliveryTracker.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";

type LatLng = { lat: number; lng: number };

interface Props {
  orderId: string;
  destination: LatLng;
}

/**
 * Advanced LaundryDeliveryTracker with:
 * - custom SVG marker (rotation + tilt)
 * - smooth marker movement (requestAnimationFrame)
 * - trailing path (last N points) with color gradient per-segment (green->orange->red)
 * - animated highlight moving along trail to simulate motion
 * - smooth flyTo on "center-driver" event
 */

export default function LaundryDeliveryTracker({ orderId, destination }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const vehicleMarkerRef = useRef<google.maps.Marker | null>(null);
  const destMarkerRef = useRef<google.maps.Marker | null>(null);

  // segmented trail polylines
  const trailPolylinesRef = useRef<google.maps.Polyline[]>([]);
  const polylineFullRef = useRef<google.maps.Polyline | null>(null);

  // animation refs
  const markerAnimRef = useRef<number | null>(null);
  const panAnimRef = useRef<number | null>(null);
  const trailAnimRef = useRef<number | null>(null);

  // last-knowns
  const lastPosRef = useRef<LatLng | null>(null);
  const lastAngleRef = useRef<number>(0);
  const lastSpeedRef = useRef<number>(0);

  const trailPointsRef = useRef<LatLng[]>([]);

  const [status, setStatus] = useState<string>("Loading...");
  const [eta, setEta] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>("--");
  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);

  // Trail settings
  const TRAIL_POINTS = 30; // last N points (>=2)
  const TRAIL_MIN_OPACITY = 0.06;
  const TRAIL_MAX_OPACITY = 0.95;

  // animation cycle speed (ms per segment)
  const TRAIL_STEP_MS = 120; // lower = faster moving highlight

  // ---------- helpers ----------
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }
  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }
  function angleDiff(a: number, b: number) {
    let diff = ((b - a + 180) % 360) - 180;
    if (diff < -180) diff += 360;
    return diff;
  }
  function computeHeading(a: LatLng, b: LatLng) {
    const y = b.lng - a.lng;
    const x = b.lat - a.lat;
    const ang = (Math.atan2(y, x) * 180) / Math.PI;
    return ang;
  }

  // color interpolation helpers (RGB)
  function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }
  function rgbToHex(r: number, g: number, b: number) {
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
  }
  // t: 0..1
  function lerpColor(c1: string, c2: string, t: number) {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    const r = Math.round(lerp(a.r, b.r, t));
    const g = Math.round(lerp(a.g, b.g, t));
    const bl = Math.round(lerp(a.b, b.b, t));
    return rgbToHex(r, g, bl);
  }
  // gradient mapping along 0..1: green -> orange -> red
  function gradientColorAt(t: number) {
    t = Math.max(0, Math.min(1, t));
    if (t < 0.5) {
      // green -> orange
      return lerpColor("#34D399", "#FDBA74", t / 0.5);
    } else {
      // orange -> red
      return lerpColor("#FDBA74", "#F97316", (t - 0.5) / 0.5);
    }
  }

  function cancelMarkerAnimation() {
    if (markerAnimRef.current) {
      cancelAnimationFrame(markerAnimRef.current);
      markerAnimRef.current = null;
    }
  }
  function cancelPanAnimation() {
    if (panAnimRef.current) {
      cancelAnimationFrame(panAnimRef.current);
      panAnimRef.current = null;
    }
  }
  function cancelTrailAnimation() {
    if (trailAnimRef.current) {
      cancelAnimationFrame(trailAnimRef.current);
      trailAnimRef.current = null;
    }
  }

  // ---------- SVG marker image ----------
  function vehicleSvgDataUrl(rotationDeg = 0, tilt = 0, color = "#FF6B35") {
    const scaleY = 1 + tilt * 0.18;
    const skew = tilt * 6;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <defs>
          <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.18" />
          </filter>
        </defs>
        <g transform="translate(24,24) rotate(${rotationDeg}) skewY(${skew}) scale(1 ${scaleY}) translate(-24,-24)">
          <rect x="6" y="18" rx="6" ry="6" width="28" height="12" fill="${color}" stroke="#ffffff" stroke-width="1.5" filter="url(#s)"/>
          <circle cx="14" cy="32" r="2.6" fill="#222" />
          <circle cx="34" cy="32" r="2.6" fill="#222" />
          <path d="M36 20 L42 24 L36 28 Z" fill="#fff" opacity="0.95"/>
        </g>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  function setVehicleIcon(marker: google.maps.Marker, angle: number, tilt: number, color = "#FF6B35") {
    const url = vehicleSvgDataUrl(angle, tilt, color);
    marker.setIcon({
      url,
      scaledSize: new google.maps.Size(48, 48),
      anchor: new google.maps.Point(24, 24),
    } as google.maps.Icon);
  }

  // animate marker pos + rotation + tilt
  function animateMarkerTo(marker: google.maps.Marker, to: LatLng, toAngle: number, toTilt: number, duration = 900) {
    cancelMarkerAnimation();
    const startTime = performance.now();
    const startPos = marker.getPosition();
    const from = startPos ? { lat: startPos.lat(), lng: startPos.lng() } : (lastPosRef.current ?? to);
    const startAngle = lastAngleRef.current ?? 0;
    const startTilt = lastSpeedRef.current ? Math.max(-1, Math.min(1, lastSpeedRef.current / 60)) : 0;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const tRaw = Math.min(1, elapsed / duration);
      const t = easeOutCubic(tRaw);

      const lat = lerp(from.lat, to.lat, t);
      const lng = lerp(from.lng, to.lng, t);
      marker.setPosition({ lat, lng });

      const delta = angleDiff(startAngle, toAngle);
      const angle = startAngle + delta * t;

      const tilt = lerp(startTilt, toTilt, t);

      setVehicleIcon(marker, angle, tilt);

      if (t < 1) {
        markerAnimRef.current = requestAnimationFrame(frame);
      } else {
        markerAnimRef.current = null;
        lastPosRef.current = to;
        lastAngleRef.current = toAngle;
        lastSpeedRef.current = toTilt * 60;
      }
    };

    markerAnimRef.current = requestAnimationFrame(frame);
  }

  // flyTo
  function flyToPosition(map: google.maps.Map, to: LatLng, targetZoom?: number, duration = 900) {
    cancelPanAnimation();
    const startTime = performance.now();
    const center = map.getCenter();
    const from = center ? { lat: center.lat(), lng: center.lng() } : to;
    const startZoom = map.getZoom() ?? 13;
    const endZoom = typeof targetZoom === "number" ? targetZoom : startZoom;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const tRaw = Math.min(1, elapsed / duration);
      const t = easeOutCubic(tRaw);

      const lat = lerp(from.lat, to.lat, t);
      const lng = lerp(from.lng, to.lng, t);
      map.setCenter({ lat, lng });

      const zoom = lerp(startZoom, endZoom, t);
      const currentZoom = map.getZoom() ?? startZoom;
      if (Math.abs(currentZoom - zoom) > 0.15) map.setZoom(Math.round(zoom));

      if (t < 1) {
        panAnimRef.current = requestAnimationFrame(frame);
      } else {
        panAnimRef.current = null;
      }
    };

    panAnimRef.current = requestAnimationFrame(frame);
  }

  // update trail: create segments with gradient color
  function updateTrailSegments(points: LatLng[]) {
    // clear old polylines
    trailPolylinesRef.current.forEach((p) => p.setMap(null));
    trailPolylinesRef.current.length = 0;

    if (points.length < 2 || !mapRef.current) return;

    const n = points.length;
    for (let i = 0; i < n - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const t = i / Math.max(1, n - 2); // 0..1 along older->newer
      // we want newer (end) to be t close to 1, so invert or map accordingly:
      const tNorm = i / Math.max(1, n - 2); // older segments have smaller i
      // map to 0..1 where 0 = oldest, 1 = newest
      const mapped = tNorm;
      const color = gradientColorAt(mapped); // green->orange->red
      // opacity scale: newer -> higher opacity
      const opacity = lerp(TRAIL_MIN_OPACITY, TRAIL_MAX_OPACITY, mapped);
      const weight = Math.round(lerp(2, 6, mapped));
      const seg = new google.maps.Polyline({
        path: [a, b] as google.maps.LatLngLiteral[],
        geodesic: true,
        strokeColor: color,
        strokeOpacity: opacity,
        strokeWeight: weight,
        map: mapRef.current,
      });
      trailPolylinesRef.current.push(seg);
    }
  }

  // animate trail highlight: move a bright pulse along segments
  function startTrailAnimation() {
    cancelTrailAnimation();
    const polylines = trailPolylinesRef.current;
    if (!polylines || polylines.length === 0) return;

    let lastTimestamp = performance.now();
    let headIndex = polylines.length - 1; // start at newest
    const stepMs = TRAIL_STEP_MS;

    const loop = (now: number) => {
      const delta = now - lastTimestamp;
      if (delta >= stepMs) {
        // advance head
        headIndex = (headIndex - 1 + polylines.length) % polylines.length;
        lastTimestamp = now;
      }

      // update opacities so that headIndex is brightest and others fade
      for (let i = 0; i < polylines.length; i++) {
        // distance from head (circular)
        let dist = (headIndex - i);
        if (dist < 0) dist += polylines.length;
        const norm = Math.max(0, Math.min(1, 1 - dist / polylines.length)); // 1 at head, 0 far
        // base opacity from when created (we don't store it), approximate by mapping norm
        const baseOp = lerp(TRAIL_MIN_OPACITY, TRAIL_MAX_OPACITY, i / Math.max(1, polylines.length - 1));
        // add pulse (small)
        const pulse = 0.35 * Math.pow(norm, 1.8);
        const newOpacity = Math.min(1, baseOp + pulse);
        try {
          polylines[i].setOptions({ strokeOpacity: newOpacity });
        } catch {
          // ignore if polyline removed mid-animation
        }
      }

      trailAnimRef.current = requestAnimationFrame(loop);
    };

    trailAnimRef.current = requestAnimationFrame(loop);
  }

  // ---------- init map ----------
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set");
      return;
    }

    let mounted = true;
    const existing = document.getElementById("google-maps-sdk") as HTMLScriptElement | null;

    function init() {
      if (!mounted || !mapContainerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: destination,
          zoom: 13,
          streetViewControl: false,
          mapTypeControl: false,
        });
      }

      if (!destMarkerRef.current) {
        destMarkerRef.current = new google.maps.Marker({
          position: destination,
          map: mapRef.current,
          title: "Destination",
          label: { text: "🏠" } as any,
        });
      } else {
        destMarkerRef.current.setPosition(destination);
      }

      if (!polylineFullRef.current) {
        polylineFullRef.current = new google.maps.Polyline({
          path: [],
          geodesic: true,
          strokeColor: "#89CFF0",
          strokeOpacity: 0.12,
          strokeWeight: 3,
          map: mapRef.current,
        });
      }
    }

    if (!existing) {
      const s = document.createElement("script");
      s.id = "google-maps-sdk";
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      s.async = true;
      s.defer = true;
      s.onload = () => init();
      document.head.appendChild(s);
    } else {
      if ((window as any).google?.maps) init();
      else existing.addEventListener("load", init, { once: true });
    }

    return () => {
      mounted = false;
      cancelMarkerAnimation();
      cancelPanAnimation();
      cancelTrailAnimation();
    };
  }, [destination]);

  // ---------- firebase listeners ----------
  useEffect(() => {
    if (!db) return;
    const locRef = ref(db, `orders/${orderId}/location`);
    const statusRef = ref(db, `orders/${orderId}/status`);

    const unsubLoc = onValue(locRef, (snap) => {
      const val = snap.val();
      if (!val) return;
      const { lat, lng, updatedAt, speed: rawSpeed } = val;
      if (typeof lat === "number" && typeof lng === "number") {
        const loc = { lat, lng };
        setDriverLocation(loc);
        setLastUpdate(updatedAt ? new Date(updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString());

        // push to trail buffer
        const buf = trailPointsRef.current;
        buf.push(loc);
        if (buf.length > TRAIL_POINTS) buf.shift();

        // compute heading and tilt
        const prev = lastPosRef.current;
        let heading = lastAngleRef.current || 0;
        if (prev && (prev.lat !== lat || prev.lng !== lng)) {
          heading = computeHeading(prev, loc);
        }

        // compute speed/tilt
        let speed = typeof rawSpeed === "number" ? rawSpeed : 0;
        if (!speed && prev) {
          const dx = loc.lat - prev.lat;
          const dy = loc.lng - prev.lng;
          const dist = Math.sqrt(dx * dx + dy * dy);
          speed = Math.min(60, dist * 40000);
        }
        const tilt = Math.max(-1, Math.min(1, speed / 60));

        lastPosRef.current = loc;
        lastAngleRef.current = heading;
        lastSpeedRef.current = speed;

        if (mapRef.current) {
          if (!vehicleMarkerRef.current) {
            vehicleMarkerRef.current = new google.maps.Marker({
              position: loc,
              map: mapRef.current,
              title: "Delivery Boy",
              optimized: false,
              clickable: true,
              icon: {
                url: vehicleSvgDataUrl(heading, tilt),
                scaledSize: new google.maps.Size(48, 48),
                anchor: new google.maps.Point(24, 24),
              } as google.maps.Icon,
            });
          } else {
            animateMarkerTo(vehicleMarkerRef.current, loc, heading, tilt, 900);
          }

          // update trail segments & full polyline fallback
          updateTrailSegments(buf);
          if (polylineFullRef.current) {
            polylineFullRef.current.setPath(buf as any);
          }

          // start or restart trail animation
          startTrailAnimation();

          // auto-pan/follow (soft)
          const map = mapRef.current;
          const center = map.getCenter();
          if (!center) {
            flyToPosition(map, loc, Math.max(map.getZoom() || 13, 14), 600);
          } else {
            const distLat = Math.abs(center.lat() - lat);
            const distLng = Math.abs(center.lng() - lng);
            if (distLat > 0.01 || distLng > 0.01) {
              flyToPosition(map, loc, undefined, 700);
            } else {
              map.panTo(loc);
            }
          }
        }
      }
    });

    const unsubStatus = onValue(statusRef, (snap) => {
      const val = snap.val();
      if (!val) return;
      setStatus(val.status ?? "N/A");
      setProgress(typeof val.progress === "number" ? val.progress : 0);
      setEta(typeof val.eta === "number" ? val.eta : null);
    });

    return () => {
      try { unsubLoc(); } catch {}
      try { unsubStatus(); } catch {}
      // cleanup
      trailPolylinesRef.current.forEach((p) => p.setMap(null));
      trailPolylinesRef.current.length = 0;
      if (vehicleMarkerRef.current) { vehicleMarkerRef.current.setMap(null); vehicleMarkerRef.current = null; }
      if (destMarkerRef.current) { destMarkerRef.current.setMap(null); destMarkerRef.current = null; }
      if (polylineFullRef.current) { polylineFullRef.current.setMap(null); polylineFullRef.current = null; }
      cancelMarkerAnimation();
      cancelPanAnimation();
      cancelTrailAnimation();
    };
  }, [orderId]);

  // center-driver event
  useEffect(() => {
    function onCenter() {
      if (!mapRef.current) return;
      const pos = vehicleMarkerRef.current?.getPosition();
      const to = pos ? { lat: pos.lat(), lng: pos.lng() } : (driverLocation ?? destination);
      flyToPosition(mapRef.current, to, Math.max(mapRef.current.getZoom() || 12, 15), 1000);
    }
    window.addEventListener("center-driver", onCenter);
    return () => window.removeEventListener("center-driver", onCenter);
  }, [driverLocation, destination]);

  // ---------- render ----------
  const stages = ["Order Placed", "Picked Up", "Washing", "Ironing", "Out for Delivery", "Delivered"];
  const currentIndex = stages.indexOf(status);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* header */}
      <div className="bg-sky-700 text-white p-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Order #{orderId}</div>
          <div className="text-xs text-sky-200">Live Laundry Tracker</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">{eta ?? "--"} min</div>
          <div className="text-xs text-sky-200">Last: {lastUpdate}</div>
        </div>
      </div>

      <div ref={mapContainerRef} className="flex-1 w-full h-full" />

      <div className="bg-gray-50 border-t p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">{status}</div>
            <div className="text-xs text-gray-500">{driverLocation ? `${driverLocation.lat.toFixed(4)}, ${driverLocation.lng.toFixed(4)}` : "—"}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{progress}%</div>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          {stages.map((s, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full mb-1 text-xs font-bold ${done ? "bg-sky-600 text-white" : current ? "bg-sky-100 text-sky-700 border border-sky-300" : "bg-gray-200 text-gray-600"}`}>
                  {done ? "✓" : i + 1}
                </div>
                <div className={`text-[10px] text-center ${current ? "text-sky-600" : "text-gray-500"}`}>{s.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


