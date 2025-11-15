"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sonner } from "@/components/ui/sonner";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

type BookingReviewFormProps = {
  bookingId: string;
  courtName: string;
  initialReview: {
    rating: number;
    comment: string | null;
  } | null;
};

export function BookingReviewForm({
  bookingId,
  courtName,
  initialReview,
}: BookingReviewFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [rating, setRating] = useState<number>(initialReview?.rating ?? 5);
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating) {
      pushToast({
        title: "Pilih rating",
        description: "Tentukan jumlah bintang sebelum mengirim review.",
        variant: "info",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? "Gagal menyimpan review.");
      }

      pushToast({
        title: "Review tersimpan",
        description: "Pengalamanmu telah dibagikan ke forum komunitas.",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to submit review", error);
      pushToast({
        title: "Tidak dapat mengirim review",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tak terduga.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Bagikan pengalaman
        </p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {initialReview ? "Perbarui review kamu" : "Tulis review pertama"}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Nilai sesi di {courtName}. Review kamu otomatis tampil di forum
          komunitas setelah terkirim.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Rating
        </label>
        <div className="flex items-center gap-2">
          {RATING_OPTIONS.map((value) => {
            const isActive = value <= rating;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-brand hover:text-brand-strong dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand dark:hover:text-brand"
                aria-label={`Pilih ${value} bintang`}
              >
                <Star
                  className="h-5 w-5"
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 0 : 1.5}
                />
              </button>
            );
          })}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {rating.toFixed(1)} ★
          </span>
        </div>
      </div>

      <label className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold uppercase tracking-[0.3em]">
          Komentar
        </span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Ceritakan highlight sesi, pelayanan venue, atau tips untuk pemain lain."
          className="min-h-[120px] w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <Button
          type="submit"
          className="rounded-full bg-brand-strong px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengirim review..." : "Kirim review"}
        </Button>
        <span>
          Review akan muncul di forum beserta tautan menuju lapangan ini.
        </span>
      </div>
    </form>
  );
}
