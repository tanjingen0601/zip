'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockAnalysisResults } from '@/lib/analyse-data';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // CORRECT: Use browser-safe client
import { 
  FileText, UserPlus, Upload, BarChart, AlertCircle, 
  AlertTriangle, ThumbsUp, Check, Target, ArrowUpRight, 
  Sparkles, CheckCircle2, Loader2, X, Target as TargetIcon
} from 'lucide-react';

export default function AnalysePage() {
  const router = useRouter();
  const supabase = createClient(); // Initialize client for future database saves
  
  const [jobFile, setJobFile] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyse = () => {
    if (!jobFile || !resumeFile) return;
    
    setIsAnalyzing(true);
    // This is where you would eventually call your AI API Route
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

  const resetAnalysis = () => {
    setJobFile(null);
    setResumeFile(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6] font-sans text-gray-900">
      <Navbar isLoggedIn={true} />

      <main className="flex-grow relative flex flex-col items-center py-12 px-4">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(#FDE68A_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        <div className="w-full max-w-5xl mb-12 z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">Analyse Your Skill Gap</h1>
            <p className="text-gray-600 text-lg">Upload your target job description and your resume to find what you're missing.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Job Ad Upload */}
            <UploadCard 
              fileName={jobFile} 
              title="Job Advertisement" 
              desc="Upload description or paste text."
              icon={FileText}
              onRemove={() => { setJobFile(null); setShowResults(false); }}
              onUpload={(name) => setJobFile(name)}
            />

            {/* Resume Upload */}
            <UploadCard 
              fileName={resumeFile} 
              title="Your Resume" 
              desc="Upload CV to compare requirements."
              icon={UserPlus}
              onRemove={() => { setResumeFile(null); setShowResults(false); }}
              onUpload={(name) => setResumeFile(name)}
            />
          </div>

          <AnimatePresence>
            {!showResults && (
              <div className="flex justify-center mb-12">
                <button 
                  onClick={handleAnalyse}
                  disabled={!jobFile || !resumeFile || isAnalyzing}
                  className={`flex items-center gap-3 px-12 py-4 rounded-2xl font-display font-bold text-xl transition-all shadow-xl
                    ${(!jobFile || !resumeFile) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#18181B] hover:bg-gray-800 text-white active:scale-95'}`}
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /> Analyzing...</>
                  ) : (
                    <><Sparkles className={`w-6 h-6 ${jobFile && resumeFile ? 'text-[#FFD700]' : 'text-gray-400'}`} /> Analyse Skills</>
                  )}
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Section (AI-Ready View) */}
        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl z-10">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFD700] to-[#E6C200]" />
                
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <BarChart className="w-7 h-7 text-[#CA8A04]" /> 
                    Gap Analysis Results
                  </h2>
                  <button onClick={resetAnalysis} className="text-sm font-bold text-gray-500 hover:text-gray-900 underline">
                    New Analysis
                  </button>
                </div>

                {/* Match Score */}
                <div className="mb-10 bg-gray-50/80 rounded-3xl p-6 border border-gray-100">
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-display font-bold text-xl">Resume Match Score</span>
                    <span className="font-display font-bold text-4xl text-[#A16207]">{mockAnalysisResults.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <motion.div 
                      className="bg-[#FFD700] h-4"
                      initial={{ width: 0 }} animate={{ width: `${mockAnalysisResults.matchPercentage}%` }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <ResultColumn 
                    title="Skill Must" 
                    icon={AlertCircle} 
                    color="red" 
                    items={mockAnalysisResults.mustHave} 
                    onAction={() => router.push('/setup')} 
                  />
                  <ResultColumn 
                    title="Useful" 
                    icon={ThumbsUp} 
                    color="blue" 
                    items={mockAnalysisResults.useful} 
                    onAction={() => router.push('/setup')} 
                  />
                  <ResultColumn 
                    title="Might Need" 
                    icon={Target} 
                    color="yellow" 
                    items={mockAnalysisResults.mightNeed} 
                    onAction={() => router.push('/setup')} 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

// Sub-components for cleaner structure
function UploadCard({ fileName, title, desc, icon: Icon, onRemove, onUpload }: any) {
  return (
    <div className={`bg-white rounded-3xl p-8 border-2 transition-all h-[320px] relative flex flex-col items-center justify-center text-center ${fileName ? 'border-green-400' : 'border-dashed border-gray-300 hover:border-[#FFD700]'}`}>
      {fileName && (
        <button onClick={onRemove} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      )}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${fileName ? 'bg-green-100 text-green-600' : 'bg-[#FEF9C3] text-[#CA8A04]'}`}>
        {fileName ? <CheckCircle2 className="w-10 h-10" /> : <Icon className="w-10 h-10" />}
      </div>
      <h2 className="font-display text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{fileName || desc}</p>
      {!fileName && (
        <label className="bg-[#FFD700] hover:bg-[#E6C200] text-gray-900 font-bold py-3 px-8 rounded-xl cursor-pointer">
          <Upload className="w-5 h-5 inline mr-2" /> Browse
          <input type="file" className="hidden" onChange={(e) => onUpload(e.target.files?.[0]?.name)} />
        </label>
      )}
    </div>
  );
}

function ResultColumn({ title, icon: Icon, color, items, onAction }: any) {
  const colorMap: any = {
    red: 'bg-red-50/50 border-red-100 text-red-600',
    blue: 'bg-blue-50/50 border-blue-100 text-blue-600',
    yellow: 'bg-yellow-50/50 border-yellow-100 text-[#B45309]'
  };

  return (
    <div className={`rounded-3xl p-6 border ${colorMap[color]}`}>
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6 stroke-[2.5]" />
        <h3 className="font-display font-bold text-xl text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-4">
        {items.map((skill: any) => (
          <li key={skill.id} onClick={onAction} className="bg-white p-4 rounded-2xl shadow-sm border hover:border-yellow-400 cursor-pointer flex justify-between items-center transition-all">
            <span className="font-bold text-gray-800">{skill.name}</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </li>
        ))}
      </ul>
    </div>
  );
}