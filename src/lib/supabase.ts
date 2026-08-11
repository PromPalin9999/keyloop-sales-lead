import { createClient } from "@supabase/supabase-js";
import localforage from "localforage";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants";
import { decryptData, encryptData } from "@/utils";

// Supabase persists the session itself - we only swap *where* it persists
// to (encrypted localforage) instead of the default window.localStorage.
const supabaseAuthStorage = {
  getItem: async (key: string) => {
    const raw = await localforage.getItem<string>(key);
    return raw ? decryptData<string>(raw) : null;
  },
  setItem: async (key: string, value: string) => {
    await localforage.setItem(key, encryptData<string>(value));
  },
  removeItem: async (key: string) => {
    await localforage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: supabaseAuthStorage,
    storageKey: "supabaseAuthToken",
  },
});
