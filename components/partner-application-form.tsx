"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  submitPartnerApplication,
  type PartnerApplicationState,
} from "@/app/venue-partner/actions";
import { Button } from "@/components/ui/button";

const initialState: PartnerApplicationState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-strong px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand"
    >
      {pending ? "Mengirim aplikasi..." : "Kirim aplikasi"}
    </Button>
  );
}

export function PartnerApplicationForm() {
  const [state, formAction] = useActionState(
    submitPartnerApplication,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
    >
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Formulir kemitraan venue
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Isi detail operasional utama agar tim CourtEase dapat menyiapkan akun
          partner yang sesuai kebutuhan kamu.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Nama brand venue *
          </span>
          <input
            required
            name="organizationName"
            type="text"
            placeholder="Contoh: Arena Nusantara"
            className="w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Nama penanggung jawab *
          </span>
          <input
            required
            name="contactName"
            type="text"
            placeholder="Nama lengkap"
            className="w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Email bisnis *
          </span>
          <input
            required
            name="contactEmail"
            type="email"
            placeholder="partner@contoh.id"
            className="w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Nomor telepon
          </span>
          <input
            name="contactPhone"
            type="tel"
            placeholder="0812-0000-0000"
            className="w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Kota operasional
          </span>
          <input
            name="city"
            type="text"
            placeholder="Jakarta, Surabaya, Bandung"
            className="w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Jumlah lapangan
          </span>
          <input
            name="facilityCount"
            type="number"
            min={0}
            placeholder="Misal 4"
            className="w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Jenis olahraga utama
        </span>
        <textarea
          name="facilityTypes"
          placeholder="Contoh: Futsal, Basket, Badminton"
          className="min-h-[80px] w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Sistem booking saat ini
        </span>
        <textarea
          name="existingSystem"
          placeholder="Tuliskan alur operasional sekarang, misalnya pakai spreadsheet, WhatsApp, atau aplikasi tertentu."
          className="min-h-[80px] w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Catatan tambahan
        </span>
        <textarea
          name="notes"
          placeholder="Cerita singkat mengenai kebutuhan kerjasama, target komunitas, atau ekspektasi integrasi."
          className="min-h-[100px] w-full rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
        />
      </label>

      {state.status === "error" && state.message && (
        <p className="text-sm text-brand-strong">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}
