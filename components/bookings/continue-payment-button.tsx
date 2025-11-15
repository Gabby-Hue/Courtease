"use client";

import { useCallback, useState } from "react";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

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
  const { pushToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  const handleClick = useCallback(() => {
    if (!snapToken && !redirectUrl) {
      pushToast({
        title: "Pembayaran belum tersedia",
        description: "Hubungi admin apabila transaksi belum dibuat.",
        variant: "info",
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

      pushToast({
        title: "Midtrans belum siap",
        description: "Muat ulang halaman atau hubungi admin.",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      window.snap.pay(snapToken, {
        onSuccess: () => {
          pushToast({
            title: "Pembayaran berhasil",
            description: "Transaksi kamu telah dikonfirmasi oleh Midtrans.",
            variant: "success",
          });
          window.location.reload();
        },
        onPending: () => {
          pushToast({
            title: "Masih menunggu",
            description:
              "Kamu bisa kembali ke halaman ini kapan saja untuk menyelesaikan pembayaran.",
            variant: "info",
          });
        },
        onError: (error) => {
          console.error("Midtrans Snap error", error);
          pushToast({
            title: "Pembayaran dibatalkan",
            description: "Coba ulangi proses pembayaran.",
            variant: "error",
          });
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [pushToast, redirectUrl, snapReady, snapToken]);

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
