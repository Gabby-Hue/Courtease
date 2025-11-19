export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function validateSupabaseConfig() {
  if (!supabaseConfig.url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }

  if (!supabaseConfig.anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
  }

  if (!supabaseConfig.url.startsWith("https://")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must start with https://");
  }

  if (supabaseConfig.anonKey.length < 100) {
    console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short");
  }
}