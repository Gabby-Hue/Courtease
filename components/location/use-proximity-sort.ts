"use client";

import { useMemo } from "react";

import { calculateDistanceKm } from "@/lib/geo";
import type { Coordinates } from "@/lib/geo";

import { useUserGeolocation } from "./use-user-geolocation";
import type { LocationState } from "./use-user-geolocation";

type ProximityItem<T> = {
  item: T;
  distanceKm: number | null;
};

type UseProximitySortOptions<T> = {
  getLatitude: (item: T) => number | null | undefined;
  getLongitude: (item: T) => number | null | undefined;
  override?: LocationState | null;
};

export function useProximitySort<T>(
  items: readonly T[],
  options: UseProximitySortOptions<T>,
): {
  status: LocationState["status"];
  error?: string;
  coords: Coordinates | null;
  items: ProximityItem<T>[];
} {
  const location = useUserGeolocation();
  const effectiveLocation = options.override ?? location;
  const coords =
    effectiveLocation.status === "success" ? effectiveLocation.coords : null;

  const sorted = useMemo(() => {
    if (!items.length) {
      return [] as ProximityItem<T>[];
    }

    if (!coords) {
      return items.map((item) => ({ item, distanceKm: null }));
    }

    return [...items]
      .map((item) => {
        const lat = options.getLatitude(item);
        const lng = options.getLongitude(item);
        if (typeof lat !== "number" || typeof lng !== "number") {
          return { item, distanceKm: null };
        }
        const distanceKm = calculateDistanceKm(
          coords.latitude,
          coords.longitude,
          lat,
          lng,
        );
        return { item, distanceKm };
      })
      .sort((a, b) => {
        if (a.distanceKm === null && b.distanceKm === null) {
          return 0;
        }
        if (a.distanceKm === null) {
          return 1;
        }
        if (b.distanceKm === null) {
          return -1;
        }
        return a.distanceKm - b.distanceKm;
      });
  }, [items, coords, options]);

  if (effectiveLocation.status === "error") {
    return {
      status: effectiveLocation.status,
      error: effectiveLocation.error,
      coords: null,
      items: items.map((item) => ({ item, distanceKm: null })),
    };
  }

  return {
    status: effectiveLocation.status,
    coords,
    items: sorted,
  };
}
