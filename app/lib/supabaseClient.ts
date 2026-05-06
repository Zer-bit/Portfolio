// Required environment variables (add to .env.local — never commit actual values):
// NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
if (!key) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase: SupabaseClient = createClient(url, key);
