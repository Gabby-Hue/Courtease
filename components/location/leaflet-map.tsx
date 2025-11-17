"use client";

import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { cn } from "@/lib/utils";
import type { Coordinates } from "@/lib/geo";

const DEFAULT_CENTER: LatLngExpression = [-2.548926, 118.0148634];
const DEFAULT_ZOOM = 5;
const FOCUSED_ZOOM = 15;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type MapClickHandlerProps = {
  onSelect: (coords: Coordinates) => void;
};

function MapClickHandler({ onSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });
  return null;
}

type RecenterOnValueProps = {
  coords: Coordinates | null;
};

function RecenterOnValue({ coords }: RecenterOnValueProps) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(
        [coords.latitude, coords.longitude],
        Math.max(map.getZoom(), FOCUSED_ZOOM),
        { duration: 0.5 },
      );
      return;
    }
    map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.5 });
  }, [coords, map]);

  return null;
}

type LeafletMapProps = {
  value: Coordinates | null;
  onSelect?: (coords: Coordinates) => void;
  interactive?: boolean;
  className?: string;
  fallbackZoom?: number;
};

export function LeafletMap({
  value,
  onSelect,
  interactive = false,
  className,
  fallbackZoom = DEFAULT_ZOOM,
}: LeafletMapProps) {
  const center: LatLngExpression = value
    ? [value.latitude, value.longitude]
    : DEFAULT_CENTER;
  const zoom = value ? FOCUSED_ZOOM : fallbackZoom;
  const isInteractive = Boolean(interactive);
  const enableSelection = Boolean(interactive && onSelect);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={isInteractive}
      scrollWheelZoom={isInteractive}
      doubleClickZoom={isInteractive}
      dragging={isInteractive}
      touchZoom={isInteractive}
      className={cn("h-64 w-full", className)}
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterOnValue coords={value} />
      {value ? <Marker position={[value.latitude, value.longitude]} /> : null}
      {enableSelection && onSelect ? (
        <MapClickHandler onSelect={onSelect} />
      ) : null}
    </MapContainer>
  );
}
