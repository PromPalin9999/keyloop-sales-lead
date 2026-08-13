// Mirrors the `user_role` enum on public.profiles in Supabase.
export const Role = {
  Admin: 'ADMIN',
  Salesperson: 'SALESPERSON',
} as const;
export type Role = (typeof Role)[keyof typeof Role];
