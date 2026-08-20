import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Checks if real Supabase credentials are set (not placeholders)
export function isSupabaseConfigured(): boolean {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey) return false;
  if (rawUrl.includes("your-project-ref") || rawUrl.includes("placeholder-url")) return false;
  if (rawKey.includes("your-anon-public-key") || rawKey.includes("placeholder-anon-key")) return false;

  return true;
}

// Safe singleton — won't throw at build time even without env vars
export const supabase: SupabaseClient = createClient(url, key);
