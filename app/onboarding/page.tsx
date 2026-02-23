'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronDown, BookOpen, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Use CLIENT utility here!

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient(); // Initialize the client-side Supabase instance

  const [field, setField] = useState('');
  const [level, setLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Logic to save user preferences to Supabase would go here
      // For now, we simulate a successful save
      console.log("Saving preferences to Supabase:", { field, level });
      
      // 2. Redirect to the dynamic explore page based on their field
      router.push(`/explore?interest=${encodeURIComponent(field)}&level=${level}`);
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6] relative overflow-hidden font-sans text-gray-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(#E5E5E5_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      <div className="fixed top-1/3 left-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-0 left-0 w-full p-6 z-20">
        <Link href="/" className="flex items-center space-x-2 w-max">
          <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center font-bold">C</div>
          <span className="text-xl font-bold">CariSkill</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white w-full max-w-[440px] p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-center mb-4 text-gray-900">What is your field?</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="e.g. Data Science, Python..." 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-[17px] font-bold text-center mb-4 text-gray-900">What is your current level?</h2>
              <div className="relative">
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select your level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 text-gray-900 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
            >
              {isSubmitting ? 'Setting up...' : 'Start'}
            </button>
          </form>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-100 z-10 bg-[#FFFDF6]">
        © 2026 CariSkill Inc. All rights reserved.
      </footer>
    </div>
  );
}