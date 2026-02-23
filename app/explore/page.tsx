'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import exploreData from '@/lib/data/explore-index.json';
import { motion } from 'framer-motion';
import { 
  Upload, Plus, Sparkles, TrendingUp, Users,
  BarChart2, Shield, PenTool, HelpCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Map string icon names to Lucide components
const iconMap: Record<string, any> = {
  BarChart2, Shield, PenTool
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  show: { 
    opacity: 1, x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const FloatingBubble = ({ text, size, top, left, delay, onClick }: any) => {
  const styleVariants: Record<string, string> = {
    sm: 'w-20 h-20 text-sm ring-4 ring-[#FEF9C3] shadow-md shadow-[#FFD700]/20',
    md: 'w-28 h-28 text-base ring-6 ring-[#FEF9C3] shadow-lg shadow-[#FFD700]/30',
    lg: 'w-36 h-36 text-xl ring-8 ring-[#FEF9C3] shadow-xl shadow-[#FFD700]/40'
  };

  return (
    <motion.div
      onClick={onClick}
      className={`absolute rounded-full flex items-center justify-center bg-white font-bold text-gray-800 border border-yellow-100 cursor-pointer hover:scale-105 hover:shadow-2xl hover:ring-[#FFD700]/40 transition-all duration-300 z-20 ${styleVariants[size]}`}
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
      animate={{ y: [0, -15, 0], x: [0, Math.random() * 10 - 5, 0] }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {text}
    </motion.div>
  );
};

export default function ExplorePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6] font-sans text-gray-900 overflow-hidden">
      <Navbar isLoggedIn={true} />

      <main className="flex-grow relative flex flex-col items-center py-12 px-4 h-full w-full">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(#FDE68A_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        <div className="w-full max-w-7xl mx-auto z-10">
          
          {/* Hero Navigation */}
          <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 mb-24 relative">
            <button 
              onClick={() => router.push('/analyse')} 
              className="w-full bg-[#FFD700] hover:bg-[#E6C200] text-gray-900 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-lg border-2 border-[#FFD700] group"
            >
              <div className="text-left">
                <h3 className="font-display font-bold text-xl md:text-2xl mb-1 group-hover:translate-x-1 transition-transform">
                  {exploreData.hero.analyse.title}
                </h3>
                <p className="text-sm font-medium text-gray-800">{exploreData.hero.analyse.description}</p>
              </div>
              <div className="bg-white/90 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-[#A16207] stroke-[2.5]" />
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/setup')} 
              className="bg-white hover:bg-gray-50 text-gray-900 rounded-2xl px-8 py-4 flex items-center justify-center gap-3 border border-gray-200 font-bold group"
            >
              <Plus className="w-4 h-4 text-gray-900 group-hover:rotate-90 transition-transform" />
              {exploreData.hero.newSkill.title}
            </button>
          </div>

          {/* AI-Driven Suggestions */}
          <div className="mb-32 flex flex-col items-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-12">
              <Sparkles className="w-6 h-6 text-[#CA8A04] animate-pulse" />
              Tailored For You
            </h2>

            <div className="relative w-full max-w-4xl h-[400px] md:h-[500px]">
              {exploreData.suggestions.map((bubble: any) => (
                <FloatingBubble 
                  key={bubble.id}
                  text={bubble.text} 
                  size={bubble.size} 
                  top={bubble.top} 
                  left={bubble.left} 
                  delay={bubble.delay} 
                  onClick={() => router.push(`/setup?topic=${encodeURIComponent(bubble.text)}`)} 
                />
              ))}
            </div>
          </div>

          {/* Trending Tracks */}
          <div className="mb-12 w-full">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-[#CA8A04]" />
              Trending Career Tracks
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-8 px-2 no-scrollbar">
              <motion.div variants={containerVariants} initial="hidden" whileInView="show" className="flex gap-6">
                {exploreData.popularSkills.map((skill: any) => {
                  const Icon = iconMap[skill.icon] || HelpCircle;
                  return (
                    <motion.div 
                      key={skill.id} variants={cardVariants}
                      onClick={() => router.push(`/setup?topic=${encodeURIComponent(skill.title)}`)} 
                      className="w-[280px] bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-xl cursor-pointer group transition-all"
                    >
                      <div className="bg-[#FEF9C3] w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-[#A16207]" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{skill.title}</h3>
                      <p className="text-sm text-gray-500 mb-6">{skill.desc}</p>
                      <div className="mt-auto flex items-center gap-2 text-[#B45309] text-xs font-bold bg-[#FFFBEB] px-3 py-1.5 rounded-lg">
                        <Users className="w-3.5 h-3.5" />
                        {skill.learners} Learners
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}