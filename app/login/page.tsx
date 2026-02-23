'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // CORRECT: Use the browser-safe client

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient(); // Initialize the client

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Magic Link / Passwordless Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      alert('Check your email for the login link!');
    }
  };

  // Handle Social Login (Google)
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6] relative overflow-hidden font-sans text-gray-900">
      {/* Background Pattern and Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(#E5E5E5_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      <div className="fixed top-1/4 left-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-0 left-0 w-full p-6 z-20">
        <Link href="/" className="flex items-center space-x-2 w-max">
          <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center font-bold">C</div>
          <span className="text-xl font-bold">CariSkill</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-md p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Login to continue your learning journey.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 text-gray-900 font-bold py-3 rounded-lg mt-4 transition-colors"
            >
              {isLoading ? 'Sending Link...' : 'Continue'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="px-3 text-xs text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            {/* ... Other Social Buttons remain the same ... */}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account? <Link href="/register" className="text-yellow-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-100 z-10 bg-[#FFFDF6]">
        © 2026 CariSkill Inc. All rights reserved.
      </footer>
    </div>
  );
}