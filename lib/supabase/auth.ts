import { createBrowserClient } from '@supabase/ssr';

export const getAuthClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const signInWithGoogle = async () => {
  const supabase = getAuthClient();

  const redirectTo =
    process.env.NODE_ENV === "production"
      ? "https://musaffir.vercel.app"
      : "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      scopes: "profile email",
    },
  });

  if (error) {
    console.error("[v0] OAuth error:", error);
    throw error;
  }
};

export const signOut = async () => {
  const supabase = getAuthClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUser = async () => {
  const supabase = getAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
