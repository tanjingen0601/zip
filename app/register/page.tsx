'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // CORRECT: Use the client utility

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient(); // Initialize the browser-safe client

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // 1. Supabase Auth Sign Up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      // 2. On success, route to onboarding
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6] relative overflow-hidden font-sans text-gray-900">
      {/* Background and Glows */}
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
            <h1 className="text-2xl font-bold mb-2">Join CariSkill</h1>
            <p className="text-gray-500 text-sm">Start your AI-driven learning journey today.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tan Jing En" 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters" 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 text-gray-900 font-bold py-3 rounded-lg mt-2 transition-colors active:scale-95"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account? <Link href="/login" className="text-yellow-600 font-semibold hover:underline">Log in</Link>
          </p>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-100 z-10 bg-[#FFFDF6]">
        © 2026 CariSkill Inc. All rights reserved.
      </footer>
    </div>
  );
}