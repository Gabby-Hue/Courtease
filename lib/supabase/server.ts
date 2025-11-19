import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig, validateSupabaseConfig } from "./config";

validateSupabaseConfig();

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseConfig.url!,
    supabaseConfig.anonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function createAdminClient() {
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured for admin operations");
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseConfig.url!,
    supabaseConfig.serviceRoleKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
