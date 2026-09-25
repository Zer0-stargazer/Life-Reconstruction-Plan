import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local if available
try {
  config({ path: resolve(process.cwd(), ".env.local") });
} catch {
  // dotenv not available or file not found
}
try {
  config({ path: resolve(process.cwd(), ".env") });
} catch {
  // .env not found
}

// Support both legacy COZE_ prefixed vars and new SUPABASE_ vars
function getEnv(key: string, legacyKey?: string): string | undefined {
  return process.env[key] || (legacyKey ? process.env[legacyKey] : undefined);
}

function getSupabaseCredentials(): { url: string; anonKey: string } {
  const url = getEnv("SUPABASE_URL", "COZE_SUPABASE_URL");
  const anonKey = getEnv("SUPABASE_ANON_KEY", "COZE_SUPABASE_ANON_KEY");

  if (!url) {
    throw new Error(
      "SUPABASE_URL is not set. Please add it to .env.local"
    );
  }
  if (!anonKey) {
    throw new Error(
      "SUPABASE_ANON_KEY is not set. Please add it to .env.local"
    );
  }

  return { url, anonKey };
}

function getSupabaseServiceRoleKey(): string | undefined {
  return getEnv("SUPABASE_SERVICE_ROLE_KEY", "COZE_SUPABASE_SERVICE_ROLE_KEY");
}

function getSupabaseClient(token?: string): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  let key: string;
  if (token) {
    key = anonKey;
  } else {
    const serviceRoleKey = getSupabaseServiceRoleKey();
    key = serviceRoleKey ?? anonKey;
  }

  const options: Record<string, unknown> = {
    db: { timeout: 60000 },
    auth: { autoRefreshToken: false, persistSession: false },
  };

  if (token) {
    (options as Record<string, unknown>).global = {
      headers: { Authorization: `Bearer ${token}` },
    };
  }

  return createClient(url, key, options);
}

export { getSupabaseCredentials, getSupabaseServiceRoleKey, getSupabaseClient };