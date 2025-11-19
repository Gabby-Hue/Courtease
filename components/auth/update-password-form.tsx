"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!password || !confirmPassword) {
      toast.error("Password dan konfirmasi password wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password tidak sama dengan konfirmasi password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success("Password berhasil diperbarui");
      router.push("/dashboard/user");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Gagal memperbarui password", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Perbarui Password</h1>
          <p className="text-muted-foreground text-sm">
            Masukkan password baru untuk akun Anda
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="password">Password Baru</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Masukkan password baru"
            required
            disabled={isLoading}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Konfirmasi Password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Konfirmasi password baru"
            required
            disabled={isLoading}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Memproses..." : "Perbarui Password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}