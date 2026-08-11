import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib";
import { useAuthStore } from "@/store";
import type { Role } from "@/constants";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
};

async function fetchMe(): Promise<Profile> {
  const { data, error } = await supabase.from("me").select("*").single();

  if (error) throw error;
  return data;
}

export const useGetMe = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setProfile = useAuthStore((state) => state.setProfile);

  const query = useQuery({
    queryKey: ["me", userId],
    queryFn: fetchMe,
    enabled: isLoggedIn && !!userId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) setProfile(query.data);
  }, [query.data, setProfile]);

  return {
    ...query,
    profile: query.data,
    isGettingMe: query.isFetching,
  };
};
