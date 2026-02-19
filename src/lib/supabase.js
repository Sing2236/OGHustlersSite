import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const hasValidUrl =
  typeof supabaseUrl === "string" &&
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes("your-project-ref") &&
  !supabaseUrl.includes("example");

const hasValidAnonKey =
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.includes("your-anon-key") &&
  !supabaseAnonKey.includes("example");

export const isSupabaseConfigured = hasValidUrl && hasValidAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
