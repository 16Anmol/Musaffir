'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { signInWithGoogle, getUser } from '@/lib/supabase/auth';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUser();
      if (user) {
        router.push('/kala-yatra/dashboard');
      } 
    };
    checkAuth();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('[v0] Starting Google sign in...');
      await signInWithGoogle();
    } catch (err) {
      console.error('[v0] Sign in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      setLoading(false);
      
      // Show more helpful error message
      if (errorMessage.includes('blocked') || errorMessage.includes('CORS')) {
        setError('Please make sure you have configured the redirect URL in Supabase Google OAuth settings to: ' + window.location.origin + '/auth/callback');
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />
      <section className="py-32 px-4 pt-28">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-8 border-2 border-amber-200 shadow-lg bg-white">
              <h1 className="text-3xl font-bold text-amber-900 mb-2">Kala Yatra 2.0</h1>
              <p className="text-amber-700 mb-6 font-semibold">Sign in / Create Account</p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                  <p className="mb-2">{error}</p>
                  <a href="/auth/debug" className="underline font-semibold text-red-800 hover:text-red-900">
                    Need help? View setup guide →
                  </a>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 mb-3">
                  <span className="font-semibold">How it works:</span>
                </p>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Click the button below to sign in with your Google account</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span><strong>New Gmail?</strong> A new account will be created automatically</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span><strong>Existing Gmail?</strong> You&apos;ll be logged in to your existing account</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Access your dashboard to register for events or view existing registrations</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold mb-4"
              >
                {loading ? 'Redirecting...' : '🔐 Sign in with Google'}
              </Button>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800">
                  <span className="font-semibold">Important:</span> Only <strong>one registration per email ID</strong> is allowed. If you&apos;ve already registered with this Gmail, you&apos;ll see your registration status in your dashboard.
                </p>
              </div>

              <p className="text-xs text-amber-600 text-center mt-6">
                We use Google for secure authentication. Your email is used to manage your registrations.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
