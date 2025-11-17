"use server";

import { revalidatePath } from "next/cache";

export type PartnerApplicationState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitPartnerApplication(
  prevState: PartnerApplicationState,
  formData: FormData,
): Promise<PartnerApplicationState> {
  const organizationName = (formData.get("organizationName") ?? "")
    .toString()
    .trim();
  const contactName = (formData.get("contactName") ?? "").toString().trim();
  const contactEmail = (formData.get("contactEmail") ?? "")
    .toString()
    .trim()
    .toLowerCase();
  const contactPhone = (formData.get("contactPhone") ?? "").toString().trim();
  const city = (formData.get("city") ?? "").toString().trim();
  const facilityTypesRaw = (formData.get("facilityTypes") ?? "").toString();
  const facilityCountRaw = (formData.get("facilityCount") ?? "").toString();
  const existingSystem = (formData.get("existingSystem") ?? "")
    .toString()
    .trim();
  const notes = (formData.get("notes") ?? "").toString().trim();

  if (!organizationName) {
    return { status: "error", message: "Nama brand venue harus diisi." };
  }

  if (!contactName) {
    return { status: "error", message: "Nama penanggung jawab wajib diisi." };
  }

  if (!contactEmail || !contactEmail.includes("@")) {
    return { status: "error", message: "Masukkan email yang valid." };
  }

  const facilityTypes = facilityTypesRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const facilityCount = Number.parseInt(facilityCountRaw, 10);
  const parsedFacilityCount = Number.isFinite(facilityCount)
    ? facilityCount
    : null;

  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("venue_partner_applications").insert({
      organization_name: organizationName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone || null,
      city: city || null,
      facility_types: facilityTypes.length ? facilityTypes : null,
      facility_count: parsedFacilityCount,
      existing_system: existingSystem || null,
      notes: notes || null,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/dashboard/admin");
    return {
      status: "success",
      message:
        "Aplikasi kamu sudah kami terima. Tim CourtEase akan menghubungi dalam 1x24 jam kerja.",
    };
  } catch (error) {
    console.error("Failed to submit partner application", error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim aplikasi. Coba lagi nanti.",
    };
  }
}
