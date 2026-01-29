import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('[v0] Auth exchange error:', error);
      return NextResponse.redirect(new URL('/auth?error=auth_failed', request.url));
    }

    // Create or update user profile
    if (data.user) {
      const { id: userId, email, user_metadata } = data.user;
      
      try {
        // Check if user profile exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (!existingProfile) {
          // New account - create user profile
          await supabase
            .from('user_profiles')
            .insert({
              user_id: userId,
              email: email,
              full_name: user_metadata?.full_name || '',
              avatar_url: user_metadata?.avatar_url || '',
              is_new_account: true,
              created_at: new Date().toISOString(),
            });
          
          console.log('[v0] New user account created:', email);
        } else {
          // Existing account - just update last login
          await supabase
            .from('user_profiles')
            .update({ last_login_at: new Date().toISOString() })
            .eq('user_id', userId);
          
          console.log('[v0] User logged in:', email);
        }
      } catch (profileError) {
        console.error('[v0] Error creating/updating user profile:', profileError);
      }
    }
  }

  return NextResponse.redirect(new URL('/kala-yatra/dashboard', request.url));
}
