'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

export default function AuthDebugPage() {
  const [redirectUrl, setRedirectUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(`${window.location.origin}/auth/callback`);
    }
  }, []);

  const handleCopy = () => {
    if (redirectUrl) {
      navigator.clipboard.writeText(redirectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />
      <section className="py-16 px-4 pt-28">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border-2 border-amber-200 shadow-lg bg-white">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Google OAuth Setup Guide</h1>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h2 className="font-bold text-blue-900 mb-3">Your Redirect URL:</h2>
                <div className="flex items-center gap-2 bg-white p-3 rounded border border-blue-200">
                  <code className="text-sm font-mono text-blue-800 flex-1 break-all">{redirectUrl}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="text-blue-600 hover:bg-blue-100"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {copied && <p className="text-xs text-green-600 mt-2">✓ Copied to clipboard!</p>}
              </div>

              <div className="space-y-4">
                <h2 className="font-bold text-amber-900">Setup Steps:</h2>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">1. Go to Supabase Dashboard</h3>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Open your Supabase project</li>
                    <li>Click on <strong>Authentication</strong> in the left menu</li>
                    <li>Click on <strong>Providers</strong></li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">2. Configure Google Provider</h3>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Find <strong>Google</strong> in the providers list</li>
                    <li>Enable it by toggling the switch</li>
                    <li>Add your Google OAuth credentials (Client ID and Client Secret)</li>
                    <li>In the <strong>Redirect URLs</strong> section, add the URL above</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">3. Get Google Credentials</h3>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Go to <strong>Google Cloud Console</strong></li>
                    <li>Create or select a project</li>
                    <li>Enable <strong>Google+ API</strong></li>
                    <li>Create <strong>OAuth 2.0 Credentials</strong> (Web Application)</li>
                    <li>Add authorized redirect URI: <code className="bg-white px-2 py-1 rounded text-xs">{redirectUrl}</code></li>
                    <li>Copy the Client ID and Client Secret</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">✓ Done!</h3>
                  <p className="text-sm text-green-800">Once you&apos;ve added the redirect URL in both Supabase and Google Cloud Console, go back to the <a href="/auth" className="underline font-semibold">Sign In page</a> and try again.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
