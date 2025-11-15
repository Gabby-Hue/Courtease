"use client";

import type { Coordinates } from "@/lib/geo";

import { LeafletMap } from "./leaflet-map";
import { Button } from "@/components/ui/button";

type VenueLocationPickerProps = {
  value: Coordinates | null;
  onChange: (coords: Coordinates | null) => void;
};

export function VenueLocationPicker({ value, onChange }: VenueLocationPickerProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
        <LeafletMap
          value={value}
          onSelect={(coords) => onChange(coords)}
          interactive
          className="h-72"
        />
      </div>
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Klik pada peta untuk menetapkan pin lokasi venue. Gunakan zoom untuk memastikan akurasi.</p>
        {value ? (
          <Button type="button" variant="outline" size="sm" onClick={() => onChange(null)}>
            Hapus pin
          </Button>
        ) : null}
      </div>
    </div>
  );
}
