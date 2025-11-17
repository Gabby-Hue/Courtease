"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { ForumCategory, ForumThreadSummary } from "@/lib/supabase/queries";
import { CheckCircle2, ChevronDown, PenSquare } from "lucide-react";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 60);
}

type ForumThreadComposerProps = {
  categories: ForumCategory[];
  onThreadCreated?: (thread: ForumThreadSummary) => void;
};

export function ForumThreadComposer({ categories, onThreadCreated }: ForumThreadComposerProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | "">("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(Boolean(data.user));
    };

    checkAuth();
  }, []);

  const categoryOptions = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.info("Judul diperlukan", {
        description: "Tulis judul yang jelas untuk memulai diskusi.",
      });
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.info("Perlu login", {
        description: "Masuk dulu sebelum membuat thread baru.",
      });
      return;
    }
    setShowConfirm(true);
  };

  if (isAuthenticated === null) {
    return (
      <div className="space-y-3">
        <span className="block h-14 w-full animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/60" />
        <span className="block h-24 w-full animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200/80 bg-white/80 p-6 text-sm text-slate-600 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300">
        <p className="font-semibold text-slate-800 dark:text-slate-100">Mulai diskusi baru</p>
        <p className="mt-1">
          Masuk sebagai member untuk membuat thread baru, menandai favorit, dan mengikuti topik komunitas.
        </p>
        <Link
          href="/auth/login"
          className="mt-4 inline-flex items-center rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand"
        >
          Login & mulai diskusi
        </Link>
      </div>
    );
  }

  const guidelinesItems = [
    {
      title: "Mulai dengan konteks jelas",
      description: "Tulis satu kalimat pembuka yang menjelaskan situasi tim atau pertanyaan utama kamu.",
    },
    {
      title: "Gunakan kategori & tag",
      description: "Pilih kategori paling relevan dan tambahkan 2-3 tag agar diskusi mudah ditemukan.",
    },
    {
      title: "Beri detail actionable",
      description: "Ceritakan pengalaman, jadwal latihan, atau hambatan supaya komunitas bisa memberi jawaban spesifik.",
    },
  ];

  const guidelinesPanel = (
    <div className="space-y-5 rounded-3xl border border-brand/20 bg-gradient-to-br from-white via-white/90 to-[hsl(var(--brand-soft))]/25 p-6 shadow-sm backdrop-blur-sm transition dark:border-brand/30 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900/40">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-strong shadow-sm shadow-brand/10 dark:bg-slate-800/80 dark:text-brand">
          <PenSquare className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-strong dark:text-brand">Panduan thread cepat</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Buat diskusi yang langsung menarik respon</h3>
        </div>
      </div>
      <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {guidelinesItems.map((item) => (
          <li key={item.title} className="flex gap-3 rounded-2xl bg-white/70 p-3 shadow-inner shadow-slate-200/40 dark:bg-slate-900/60 dark:shadow-none">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-strong dark:text-brand" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Setelah dipublikasikan, thread akan dipantau oleh moderator. Revisi bisa dilakukan melalui komentar lanjutan.
      </p>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {showConfirm && (
        <PublishConfirmDialog
          title={title}
          body={body}
          tags={tags}
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            setIsSubmitting(true);
            const supabase = createClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
              toast.info("Sesi habis", {
                description: "Masuk kembali sebelum menerbitkan thread.",
              });
              setIsSubmitting(false);
              setShowConfirm(false);
              setIsAuthenticated(false);
              return;
            }

            const normalizedTags = tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag) => tag.replace(/^#/g, ""));

            const slugBase = slugify(title);
            const slug = `${slugBase}-${Math.random().toString(36).slice(2, 8)}`;
            const trimmedBody = body.trim();
            const excerpt = trimmedBody.slice(0, 160) || null;

            type InsertedThreadRow = {
              id: string;
              slug: string;
              title: string;
              excerpt: string | null;
              created_at: string;
              reply_count: number | null;
              tags: string[] | null;
              category: { id: string; slug: string; name: string } | null;
              author: { full_name: string | null } | null;
            };

            const { data, error } = await supabase
              .from("forum_threads")
              .insert({
                slug,
                title: title.trim(),
                body: trimmedBody || null,
                excerpt,
                category_id: categoryId || null,
                author_profile_id: user.id,
                tags: normalizedTags,
              })
              .select(
                `id, slug, title, excerpt, created_at, reply_count, tags,
                 category:forum_categories(id, slug, name),
                 author:profiles(full_name)`
              )
              .maybeSingle();

            const threadRow = (data ?? null) as InsertedThreadRow | null;

            if (error || !threadRow) {
              console.error("Failed to create forum thread", error?.message);
              toast.error("Gagal membuat thread", {
                description: error?.message ?? "Terjadi kesalahan tak terduga.",
              });
              setIsSubmitting(false);
              setShowConfirm(false);
              return;
            }

            const newThread: ForumThreadSummary = {
              id: threadRow.id,
              slug: threadRow.slug,
              title: threadRow.title,
              excerpt: threadRow.excerpt ?? null,
              reply_count: Number(threadRow.reply_count ?? 0),
              created_at: threadRow.created_at,
              tags: Array.isArray(threadRow.tags) ? threadRow.tags : [],
              category: threadRow.category
                ? { id: threadRow.category.id, slug: threadRow.category.slug, name: threadRow.category.name }
                : null,
              author_name: threadRow.author?.full_name ?? null,
              latestReplyBody: null,
              latestReplyAt: null,
              reviewCourt: null,
            };

            setTitle("");
            setBody("");
            setTags("");
            setCategoryId("");

            onThreadCreated?.(newThread);
            toast.success("Thread baru ditayangkan", {
              description: "Diskusi kamu sudah bisa dilihat komunitas.",
            });
            setIsSubmitting(false);
            setExpanded(false);
            setShowConfirm(false);
            router.push(`/forum/${newThread.slug}`);
          }}
          isLoading={isSubmitting}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-[#E5E7EB] bg-white/95 p-5 shadow-sm backdrop-blur transition dark:border-slate-700/70 dark:bg-slate-900/70 sm:p-8"
        >
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-strong">Mulai diskusi</p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Bagikan pertanyaan atau tips kamu</h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="self-start rounded-full border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Sembunyikan detail" : "Atur detail lanjutan"}
            </Button>
          </header>

          <div className="space-y-5">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Judul thread
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onFocus={() => setExpanded(true)}
                placeholder="Contoh: Strategi conditioning futsal menjelang turnamen"
                className="w-full rounded-2xl border border-[#E5E7EB] bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </label>

            {expanded && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      Kategori
                    </span>
                    <select
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      className="w-full rounded-2xl border border-[#E5E7EB] bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100"
                    >
                      <option value="">Pilih kategori</option>
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      Tag (pisahkan dengan koma)
                    </span>
                    <input
                      type="text"
                      value={tags}
                      onChange={(event) => setTags(event.target.value)}
                      placeholder="futsal, conditioning, latihan"
                      className="w-full rounded-2xl border border-[#E5E7EB] bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Ceritakan detailnya
                  </span>
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Tulis penjelasan lengkap supaya komunitas bisa membantu dengan maksimal..."
                    className="min-h-[140px] w-full rounded-2xl border border-[#E5E7EB] bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {expanded
                ? `${body.trim().length} karakter`
                : "Judul yang jelas membantu diskusi lebih fokus."}
            </span>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-brand-strong px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand disabled:opacity-60"
            >
              {isSubmitting ? "Menerbitkan..." : "Terbitkan thread"}
            </Button>
          </div>
        </form>
        <div className="hidden lg:block">{guidelinesPanel}</div>
      </div>
      <div className="lg:hidden">
        <details className="group overflow-hidden rounded-3xl border border-brand/20 bg-white/90 shadow-sm transition dark:border-brand/40 dark:bg-slate-900/70">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-slate-700 marker:hidden dark:text-slate-200">
            <span>Panduan menulis thread</span>
            <ChevronDown className="h-4 w-4 text-brand-strong transition group-open:rotate-180" />
          </summary>
          <div className="border-t border-brand/10 px-6 py-5 dark:border-brand/20">
            {guidelinesPanel}
          </div>
        </details>
      </div>
    </div>
  );
}

function PublishConfirmDialog({
  title,
  body,
  tags,
  onConfirm,
  onCancel,
  isLoading,
}: {
  title: string;
  body: string;
  tags: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const previewBody = body.trim() || "Bagikan detail lengkapmu agar komunitas dapat merespons dengan tepat.";
  const normalizedTags = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/^#/g, ""));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-lg space-y-6 rounded-3xl border border-brand/30 bg-white/95 p-6 shadow-2xl transition dark:border-brand/40 dark:bg-slate-950/90">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-strong))] to-[hsl(var(--brand))] text-white shadow-lg shadow-brand/30">
            <PenSquare className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Terbitkan thread sekarang?</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thread yang diterbitkan tidak bisa dihapus, tetapi kamu dapat menambahkan klarifikasi lewat balasan lanjutan.
            </p>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-300">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-strong dark:text-brand">Judul</p>
            <p className="font-semibold text-slate-900 dark:text-white">{title.trim() || "Tanpa judul"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-strong dark:text-brand">Ringkasan</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{previewBody.slice(0, 200)}</p>
          </div>
          {normalizedTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-strong dark:text-brand">Tag</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {normalizedTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-strong/10 px-3 py-1 font-semibold text-brand-strong dark:bg-brand/20 dark:text-brand">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-300"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="rounded-full bg-brand-strong px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand disabled:opacity-60"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menerbitkan..." : "Ya, terbitkan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
