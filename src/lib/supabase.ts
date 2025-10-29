import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables inside .env');
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false, // We don't need auth persistence for this app
    },
  });

  return cachedClient;
}

// For backward compatibility with existing code
export async function connectToDatabase() {
  const client = getSupabaseClient();
  return { client };
}

export async function getDatabase() {
  return getSupabaseClient();
}

// Helper function to get the storage client
export function getStorageClient() {
  const client = getSupabaseClient();
  return client.storage;
}
