import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const createSuccessResponse = <T = any>(
  data: T,
  statusCode: number = 200
) => {
  return NextResponse.json({ data }, { status: statusCode });
};

export const createErrorResponse = (
  error: string | ApiError,
  statusCode: number = 500
) => {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  return NextResponse.json({ error }, { status: statusCode });
};

export const handleApiError = (error: unknown, context?: string) => {
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error);

  if (error instanceof ApiError) {
    return createErrorResponse(error);
  }

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500);
  }

  return createErrorResponse("Terjadi kesalahan yang tidak diketahui", 500);
};

export const validateAuth = async (supabase: any) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ApiError(401, "Silakan login untuk mengakses fitur ini.", "UNAUTHORIZED");
  }

  return user;
};

export const validateRequired = (
  value: unknown,
  fieldName: string,
  options?: { minLength?: number; maxLength?: number }
) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${fieldName} tidak boleh kosong`, "REQUIRED_FIELD");
  }

  const trimmed = value.trim();

  if (options?.minLength && trimmed.length < options.minLength) {
    throw new ApiError(
      400,
      `${fieldName} minimal ${options.minLength} karakter`,
      "MIN_LENGTH"
    );
  }

  if (options?.maxLength && trimmed.length > options.maxLength) {
    throw new ApiError(
      400,
      `${fieldName} maksimal ${options.maxLength} karakter`,
      "MAX_LENGTH"
    );
  }

  return trimmed;
};

export const parseIsoDate = (value: unknown): Date => {
  if (typeof value !== "string") {
    throw new ApiError(400, "Format tanggal tidak valid", "INVALID_DATE");
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, "Format tanggal tidak valid", "INVALID_DATE");
  }

  return parsed;
};

export const validateDateRange = (startDate: Date, endDate: Date) => {
  const now = new Date();
  const maxBookingDate = new Date(now);
  maxBookingDate.setMonth(maxBookingDate.getMonth() + 3);
  const maxBookingDeadline = new Date(maxBookingDate);
  maxBookingDeadline.setHours(23, 59, 59, 999);

  if (startDate.getTime() < now.getTime()) {
    throw new ApiError(
      400,
      "Tanggal booking sudah lewat. Pilih jadwal lain.",
      "PAST_DATE"
    );
  }

  if (startDate.getTime() > maxBookingDeadline.getTime()) {
    throw new ApiError(
      400,
      "Booking hanya dapat dijadwalkan maksimal 3 bulan ke depan.",
      "FUTURE_DATE_LIMIT"
    );
  }

  if (endDate.getTime() <= startDate.getTime()) {
    throw new ApiError(
      400,
      "Waktu selesai harus setelah waktu mulai.",
      "INVALID_DATE_RANGE"
    );
  }

  if (endDate.getTime() > maxBookingDeadline.getTime()) {
    throw new ApiError(
      400,
      "Durasi booking melebihi batas jadwal yang diizinkan.",
      "DURATION_LIMIT"
    );
  }

  return { startDate, endDate, maxBookingDeadline };
};