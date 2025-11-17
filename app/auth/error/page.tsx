export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  const message = params?.error
    ? `Kode error: ${params.error}`
    : "Terjadi kesalahan yang tidak diketahui.";

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50/60 p-4 dark:bg-slate-950/60">
      <h1 className="font-bold text-gray-900 dark:text-gray-100">
        Maaf, terjadi kesalahan
      </h1>
      <h2 className="font-bold text-gray-900 dark:text-gray-100">
        Kami gagal memproses permintaan autentikasi.
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
}
