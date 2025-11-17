"use client";

import type { Coordinates } from "@/lib/geo";

import { LeafletMap } from "@/components/location/leaflet-map";

type VenueLocationMapProps = {
  venueName: string;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  address?: string | null;
};

export function VenueLocationMap({
  venueName,
  latitude,
  longitude,
  address,
}: VenueLocationMapProps) {
  const hasCoords =
    typeof latitude === "number" &&
    !Number.isNaN(latitude) &&
    typeof longitude === "number" &&
    !Number.isNaN(longitude);
  const coords: Coordinates | null = hasCoords
    ? {
        latitude,
        longitude,
      }
    : null;

  if (!coords) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200/70 bg-white/80 p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-300">
        Venue belum menetapkan lokasi di peta. Mintalah pengelola venue untuk
        memperbarui koordinat melalui dashboard.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="border-b border-slate-200/60 bg-slate-50/80 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/60">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Peta lokasi
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pin lokasi {venueName}
          {address ? ` • ${address}` : ""}
        </p>
      </div>
      <LeafletMap value={coords} interactive={false} className="h-72" />
    </div>
  );
}
