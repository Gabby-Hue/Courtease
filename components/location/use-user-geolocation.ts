"use client";

import { useEffect, useState } from "react";

import type { Coordinates } from "@/lib/geo";

export type LocationState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "success"; coords: Coordinates }
  | { status: "error"; error: string };

let cachedCoords: Coordinates | null = null;
let cachedError: string | null = null;
let locationRequest: Promise<Coordinates | null> | null = null;

export function useUserGeolocation(): LocationState {
  const [state, setState] = useState<LocationState>(() => {
    if (cachedCoords) {
      return { status: "success", coords: cachedCoords };
    }
    if (cachedError) {
      return { status: "error", error: cachedError };
    }
    return { status: "idle" };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("geolocation" in navigator)) {
      cachedError = "Peramban tidak mendukung geolokasi.";
      setState({ status: "error", error: cachedError });
      return;
    }

    if (cachedCoords) {
      setState({ status: "success", coords: cachedCoords });
      return;
    }

    if (cachedError) {
      setState({ status: "error", error: cachedError });
      return;
    }

    setState((prev) =>
      prev.status === "success" ? prev : { status: "locating" },
    );

    if (!locationRequest) {
      locationRequest = new Promise<Coordinates | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            cachedCoords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(cachedCoords);
          },
          (error) => {
            cachedError =
              error.message || "Tidak dapat mengakses lokasi perangkat.";
            resolve(null);
          },
          { enableHighAccuracy: false, maximumAge: 300_000, timeout: 10_000 },
        );
      });
    }

    let isSubscribed = true;
    locationRequest.then((coords) => {
      if (!isSubscribed) {
        return;
      }
      if (coords) {
        setState({ status: "success", coords });
      } else {
        setState({
          status: "error",
          error: cachedError ?? "Tidak dapat menentukan lokasi kamu.",
        });
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  return state;
}
