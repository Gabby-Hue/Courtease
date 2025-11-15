import Link from "next/link";

import { PartnerApplicationForm } from "@/components/partner-application-form";

const milestones = [
  {
    title: "1. Kirim aplikasi",
    description:
      "Lengkapi form kemitraan untuk memberi gambaran kebutuhan operasional dan jenis olahraga yang tersedia.",
  },
  {
    title: "2. Verifikasi & aktivasi",
    description:
      "Tim admin akan melakukan verifikasi data, mengaktifkan integrasi Midtrans, dan menyiapkan akun partner.",
  },
  {
    title: "3. Go-live",
    description:
      "Venue tampil di halaman Explore, jadwal otomatis sinkron dengan dashboard pemain, dan kamu siap menerima booking.",
  },
];

export default function VenuePartnerPage() {
  return (
    <main className="space-y-20 pb-24">
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-24 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Kemitraan venue CourtEase
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Onboard venue kamu dan nikmati automasi booking, pembayaran, dan
              komunitas.
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Kami menyiapkan Midtrans, dashboard multi-cabang, dan akses ke
              komunitas olahraga. Isi form di bawah untuk memulai proses kurasi.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                Integrasi Midtrans Snap
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                Dashboard realtime
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                Eksposur komunitas
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Timeline onboarding
            </h2>
            <ul className="space-y-4">
              {milestones.map((milestone) => (
                <li
                  key={milestone.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-semibold text-white">{milestone.title}</p>
                  <p className="text-xs text-slate-300">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400">
              Sudah memiliki akun?{" "}
              <Link
                href="/auth/login"
                className="text-brand-muted underline underline-offset-4"
              >
                Masuk sebagai partner
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PartnerApplicationForm />
      </section>
    </main>
  );
}
