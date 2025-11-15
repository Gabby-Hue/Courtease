"use client";

import { useCallback, useState } from "react";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (error: unknown) => void;
        },
      ) => void;
    };
  }
}

type MidtransBookingButtonProps = {
  courtId: string;
  isConfigured: boolean;
  midtransClientKey: string | null;
  snapScriptUrl: string;
  isBookingAllowed: boolean;
  disallowedMessage?: string | null;
  selectedSlot: { start: Date; end: Date } | null;
  notes?: string;
};

export function MidtransBookingButton({
  courtId,
  isConfigured,
  midtransClientKey,
  snapScriptUrl,
  isBookingAllowed,
  disallowedMessage,
  selectedSlot,
  notes,
}: MidtransBookingButtonProps) {
  const { pushToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  const handleClick = useCallback(async () => {
    if (!isConfigured) {
      pushToast({
        title: "Midtrans belum siap",
        description: "Hubungi admin untuk mengaktifkan pembayaran online.",
        variant: "info",
      });
      return;
    }

    if (!isBookingAllowed) {
      pushToast({
        title: "Akses booking dibatasi",
        description:
          disallowedMessage ??
          "Akun kamu tidak memiliki akses untuk melakukan booking dari halaman ini.",
        variant: "info",
      });
      return;
    }

    if (!selectedSlot) {
      pushToast({
        title: "Atur jadwal booking",
        description:
          "Pilih tanggal, jam mulai, dan durasi sebelum melanjutkan pembayaran.",
        variant: "info",
      });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        pushToast({
          title: "Perlu login",
          description: "Masuk sebagai pemain untuk melanjutkan proses booking.",
          variant: "info",
        });
        return;
      }

      const response = await fetch("/api/bookings/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId,
          startTime: selectedSlot.start.toISOString(),
          endTime: selectedSlot.end.toISOString(),
          notes: notes?.trim() ? notes.trim() : undefined,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Tidak dapat membuat booking baru.");
      }

      const {
        data: {
          bookingId,
          payment: { token, redirectUrl },
        },
      } = payload as {
        data: {
          bookingId: string;
          payment: { token: string; redirectUrl: string | null };
        };
      };

      const successRedirectUrl = `${window.location.origin}/dashboard/user/bookings/${bookingId}`;

      if (window.snap && typeof window.snap.pay === "function" && snapReady) {
        window.snap.pay(token, {
          onSuccess: () => {
            pushToast({
              title: "Pembayaran berhasil",
              description: "Transaksi kamu tercatat di Midtrans.",
              variant: "success",
            });
            window.location.assign(successRedirectUrl);
          },
          onPending: () => {
            pushToast({
              title: "Menunggu pembayaran",
              description:
                "Kamu bisa melanjutkan pembayaran kapan pun dari dashboard.",
              variant: "info",
            });
          },
          onError: (error) => {
            console.error("Midtrans Snap error", error);
            pushToast({
              title: "Pembayaran dibatalkan",
              description: "Coba ulangi proses transaksi dari dashboard.",
              variant: "error",
            });
          },
        });
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        pushToast({
          title: "Token Midtrans siap",
          description: token,
          variant: "info",
        });
      }
    } catch (error) {
      console.error("Failed to start Midtrans payment", error);
      pushToast({
        title: "Gagal memulai pembayaran",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tak terduga.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    courtId,
    disallowedMessage,
    isBookingAllowed,
    isConfigured,
    notes,
    pushToast,
    selectedSlot,
    snapReady,
  ]);

  return (
    <>
      {midtransClientKey && (
        <Script
          src={snapScriptUrl}
          data-client-key={midtransClientKey}
          onLoad={() => setSnapReady(true)}
          strategy="lazyOnload"
        />
      )}
      <Button
        type="button"
        onClick={handleClick}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand"
        disabled={
          isLoading || !isConfigured || !isBookingAllowed || !selectedSlot
        }
      >
        {isLoading ? "Menghubungkan Midtrans..." : "Bayar via Midtrans"}
      </Button>
      {!isConfigured && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Tombol akan aktif setelah MIDTRANS_SERVER_KEY dan
          NEXT_PUBLIC_MIDTRANS_CLIENT_KEY diisi.
        </p>
      )}
      {!isBookingAllowed && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {disallowedMessage ?? "Akun ini tidak dapat melakukan booking."}
        </p>
      )}
    </>
  );
}
