"use client";

import { useCallback, useState } from "react";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ContinuePaymentButtonProps = {
  snapToken: string | null;
  redirectUrl: string | null;
  clientKey: string | null;
  snapScriptUrl: string;
};

export function ContinuePaymentButton({
  snapToken,
  redirectUrl,
  clientKey,
  snapScriptUrl,
}: ContinuePaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  const handleClick = useCallback(() => {
    if (!snapToken && !redirectUrl) {
      toast.info("Pembayaran belum tersedia", {
        description: "Hubungi admin apabila transaksi belum dibuat.",
      });
      return;
    }

    if (!snapToken && redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (
      !snapReady ||
      !window.snap ||
      typeof window.snap.pay !== "function" ||
      !snapToken
    ) {
      if (redirectUrl) {
        window.open(redirectUrl, "_blank", "noopener,noreferrer");
        return;
      }

      toast.error("Midtrans belum siap", {
        description: "Muat ulang halaman atau hubungi admin.",
      });
      return;
    }

    setIsLoading(true);

    try {
      window.snap.pay(snapToken, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil", {
            description: "Transaksi kamu telah dikonfirmasi oleh Midtrans.",
          });
          window.location.reload();
        },
        onPending: () => {
          toast.info("Masih menunggu", {
            description:
              "Kamu bisa kembali ke halaman ini kapan saja untuk menyelesaikan pembayaran.",
          });
        },
        onError: (error) => {
          console.error("Midtrans Snap error", error);
          toast.error("Pembayaran dibatalkan", {
            description: "Coba ulangi proses pembayaran.",
          });
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [redirectUrl, snapReady, snapToken]);

  return (
    <>
      {clientKey && (
        <Script
          src={snapScriptUrl}
          data-client-key={clientKey}
          strategy="lazyOnload"
          onLoad={() => setSnapReady(true)}
        />
      )}
      <Button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-strong px-5 py-2 text-xs font-semibold text-white transition hover:bg-brand"
      >
        {isLoading ? "Menyambungkan ke Midtrans..." : "Lanjutkan pembayaran"}
      </Button>
      {!clientKey && redirectUrl && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Klik tombol di atas untuk membuka halaman pembayaran Midtrans.
        </p>
      )}
    </>
  );
}
