import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Sparkles, 
  MessageSquare, 
  ArrowDown, 
  ArrowRight, 
  Binary, 
  Sliders, 
  Play, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { FAQItem, NLPMatchDetails } from '../types';
import { processNLPMatching } from '../utils/nlpEngine';
import { INITIAL_FAQS } from '../data/initialFaqs';

export const NLPVisualizer: React.FC = () => {
  const [testQuery, setTestQuery] = useState('What are the tuition fees per term for full time students?');
  const [threshold, setThreshold] = useState<number>(0.38);
  const [nlpResult, setNlpResult] = useState<NLPMatchDetails | null>(() => 
    processNLPMatching('What are the tuition fees per term for full time students?', INITIAL_FAQS, 0.38)
  );

  const handleRunPipeline = () => {
    if (!testQuery.trim()) return;
    const result = processNLPMatching(testQuery, INITIAL_FAQS, threshold);
    setNlpResult(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-zinc-100">
      
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-transparent to-blue-500/50 opacity-20 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-600/10 text-blue-400 border border-blue-500/30 mb-2">
              <Cpu className="w-3.5 h-3.5" /> NLP Processing Pipeline & Matching Engine
            </div>
            <h2 className="text-2xl font-extrabold text-white">University AI Chatbot System Architecture</h2>
            <p className="text-xs text-zinc-400 max-w-2xl mt-1">
              Interactive visualization of the NLP pipeline: query tokenization, stopword removal, TF-IDF vectorization, Cosine Similarity matching, and AI generation fallback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#121212] p-3 rounded-xl border border-[#222222] text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block tracking-widest">Current Threshold</span>
              <span className="text-lg font-bold font-mono text-blue-400">{(threshold * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagram Canvas directly depicting data flow */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-6">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-blue-400" /> Architectural Data Flow Diagram
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center items-center">
          
          {/* Node 1: Student Asks Question */}
          <div className="bg-zinc-900 border border-blue-500/30 rounded-xl p-4 shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">1. Student Query</span>
            <span className="text-[11px] text-zinc-400 mt-1">Natural language text input</span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center text-zinc-600">
            <ArrowRight className="w-6 h-6 animate-pulse text-blue-500" />
          </div>

          {/* Node 2: Flask/Express Backend */}
          <div className="bg-zinc-900 border border-indigo-500/30 rounded-xl p-4 shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-2">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">2. Express/Node Backend</span>
            <span className="text-[11px] text-zinc-400 mt-1">Route handler & API controller</span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center text-zinc-600">
            <ArrowRight className="w-6 h-6 animate-pulse text-indigo-500" />
          </div>

          {/* Node 3: NLP Processing Engine */}
          <div className="bg-zinc-900 border border-purple-500/30 rounded-xl p-4 shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-2">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">3. NLP Vector Engine</span>
            <span className="text-[11px] text-zinc-400 mt-1">Tokenize → TF-IDF → Cosine Sim</span>
          </div>

        </div>

        {/* Branching decision node */}
        <div className="pt-4 border-t border-[#222222]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Branch A: FAQ Match */}
            <div className={`p-4 rounded-xl border transition-all ${
              nlpResult?.matchingSource === 'FAQ_DATABASE' 
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-xl' 
                : 'bg-zinc-900/60 border-zinc-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Branch A: FAQ Database Match
                </span>
                <span className="text-[11px] font-mono text-emerald-300 font-bold">
                  Score ≥ {(threshold * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Matches pre-indexed university FAQs in SQLite/In-Memory database with high cosine vector similarity. Returns instantly without external model API call.
              </p>
            </div>

            {/* Branch B: AI Matching / Gemini Fallback */}
            <div className={`p-4 rounded-xl border transition-all ${
              nlpResult?.matchingSource === 'GEMINI_AI' 
                ? 'bg-indigo-950/30 border-indigo-500/50 shadow-xl' 
                : 'bg-zinc-900/60 border-zinc-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Branch B: Gemini AI Generation
                </span>
                <span className="text-[11px] font-mono text-indigo-300 font-bold">
                  Score &lt; {(threshold * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Routes query to Gemini 3.6 Flash model with relevant campus context for smart, personalized answer synthesis.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive Testing Sandbox */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" /> Interactive NLP Testing Workbench
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Type any query and adjust the Cosine Similarity Threshold to observe mathematical vector matching live.
            </p>
          </div>
        </div>

        {/* Input & Slider controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">Test Question Input:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunPipeline()}
                placeholder="Type a test question..."
                className="flex-1 bg-[#121212] border border-[#222222] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              />
              <button
                onClick={handleRunPipeline}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <Play className="w-4 h-4" /> Run Vector Math
              </button>
            </div>
          </div>

          {/* Threshold Slider */}
          <div className="space-y-2 bg-[#121212] p-4 rounded-xl border border-[#222222]">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-300">Similarity Threshold:</span>
              <span className="text-blue-400 font-mono font-bold">{(threshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.02"
              value={threshold}
              onChange={(e) => {
                const newT = parseFloat(e.target.value);
                setThreshold(newT);
                if (testQuery) setNlpResult(processNLPMatching(testQuery, INITIAL_FAQS, newT));
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>10% (Permissive)</span>
              <span>80% (Strict)</span>
            </div>
          </div>

        </div>

        {/* Inspection Output Results */}
        {nlpResult && (
          <div className="space-y-6 pt-4 border-t border-[#222222]">
            
            {/* Step 1 & 2: Tokenization & TF-IDF Vectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-[#121212] p-4 rounded-xl border border-[#222222] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">Tokenization & Stopwords Removal</span>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {nlpResult.stopwordsRemoved.map((term, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-blue-950/80 text-blue-300 border border-blue-800">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#121212] p-4 rounded-xl border border-[#222222] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">Pipeline Decision Summary</span>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex-1">
                    <span className="text-zinc-500 block text-[11px]">Top Candidate Cosine Score</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {(nlpResult.topMatchScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-zinc-500 block text-[11px]">Matched Pipeline Destination</span>
                    <span className={`font-semibold ${
                      nlpResult.matchingSource === 'FAQ_DATABASE' ? 'text-emerald-400' : 'text-indigo-400'
                    }`}>
                      {nlpResult.matchingSource === 'FAQ_DATABASE' ? 'FAQ Database Entry' : 'Gemini AI Fallback'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Cosine Vector Scores Bar Visualizer */}
            <div className="bg-[#121212] p-5 rounded-xl border border-[#222222] space-y-4">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>FAQ Corpus Vector Cosine Similarity Rankings</span>
                <span className="text-zinc-500 font-normal text-[11px]">Dashed line = {(threshold * 100).toFixed(0)}% threshold</span>
              </h4>

              <div className="space-y-3">
                {nlpResult.docVectors.slice(0, 5).map((doc, idx) => {
                  const scorePct = doc.cosineSimilarity * 100;
                  const passes = doc.cosineSimilarity >= threshold;

                  return (
                    <div key={doc.faqId} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300 truncate max-w-md">
                          <strong className="text-zinc-500 mr-2">#{idx + 1}</strong>
                          {doc.question}
                        </span>
                        <span className={`font-mono font-bold ${passes ? 'text-emerald-400' : 'text-zinc-400'}`}>
                          {scorePct.toFixed(1)}%
                        </span>
                      </div>

                      <div className="w-full bg-[#050505] h-3 rounded-full overflow-hidden relative border border-[#222222]">
                        {/* Threshold Marker line */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                          style={{ left: `${threshold * 100}%` }}
                          title={`Threshold: ${(threshold * 100).toFixed(0)}%`}
                        />
                        <div 
                          className={`h-full transition-all duration-500 ${
                            passes ? 'bg-gradient-to-r from-emerald-600 to-teal-400' : 'bg-zinc-700'
                          }`}
                          style={{ width: `${Math.min(100, scorePct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
