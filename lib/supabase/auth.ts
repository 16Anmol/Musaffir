import { createBrowserClient } from '@supabase/ssr';

export const getAuthClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const signInWithGoogle = async () => {
  try {
    const supabase = getAuthClient();
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log('[v0] OAuth redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        scopes: 'profile email',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    console.log('[v0] OAuth response:', { data, error });
    
    if (error) {
      console.error('[v0] OAuth error:', error);
      throw error;
    }
  } catch (error) {
    console.error('[v0] Sign in with Google error:', error);
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
