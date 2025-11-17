import type { Database } from "@/types/supabase";

export type CreateBookingRequest = {
  courtId: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export type CreateBookingResponse = {
  bookingId: string;
  payment: {
    token: string;
    redirectUrl: string | null;
    expiresAt: string;
  };
};

export type ApiSuccess<T = any> = {
  data: T;
};

export type ApiError = {
  error: string;
  code?: string;
};

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

export type Database = Database;

// Database row types
export type CourtRow = Database["public"]["Tables"]["courts"]["Row"];
export type VenueRow = Database["public"]["Tables"]["venues"]["Row"];
export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CourtSummaryRow = Database["public"]["Views"]["court_summaries"]["Row"];
export type CourtBlackoutRow = Database["public"]["Tables"]["court_blackouts"]["Row"];

// Helper types for Supabase queries
export type CourtWithVenue = CourtRow & {
  venue: {
    name: string;
    city: string | null;
  } | null;
};

export type BookingWithCourt = BookingRow & {
  court: {
    name: string;
    sport: string;
  } | null;
};