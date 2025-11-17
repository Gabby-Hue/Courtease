import Link from "next/link";
import { fetchVenueSummaries } from "@/lib/supabase/queries";
import { VenuesDirectory } from "@/components/venues/venues-directory";

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const params = await searchParams;
  const focusSlug = typeof params.focus === "string" ? params.focus : null;
  const venues = await fetchVenueSummaries();

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          Venues
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Daftar lapangan terkurasi
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Semua data lapangan, rating, dan review terhubung langsung dengan
          Supabase sehingga kamu bisa melihat detail fasilitas, jadwal, hingga
          kontak venue dalam satu halaman.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <VenuesDirectory venues={venues} initialFocusSlug={focusSlug} />
        <aside className="space-y-6 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Tips booking instan
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Supabase menyimpan jadwal real-time sehingga kamu bisa memilih
              slot kosong, memastikan pembayaran, dan mengundang tim langsung
              dari dashboard.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>
              • Gunakan filter Explore untuk mencari lapangan sesuai rating
              komunitas.
            </li>
            <li>
              • Booking minimal 3 jam sekaligus untuk otomatis mendapat potongan
              harga venue partner.
            </li>
            <li>
              • Setelah bermain, kirim review agar dashboard venue menghitung
              rating terbaru.
            </li>
          </ul>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 text-sm dark:border-slate-700/70 dark:bg-slate-900/60">
            <p className="font-semibold text-slate-900 dark:text-white">
              Punya venue sendiri?
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Ajukan akun venue partner untuk memantau okupansi, pembayaran, dan
              review langsung dari Supabase dashboard.
            </p>
            <Link
              href="/dashboard/venue"
              className="mt-4 inline-flex items-center rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand"
            >
              Buka dashboard venue
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
