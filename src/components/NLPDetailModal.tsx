import React from 'react';
import { X, Cpu, CheckCircle2, AlertCircle, ArrowRight, Binary, Code, Zap } from 'lucide-react';
import { NLPMatchDetails } from '../types';

interface NLPDetailModalProps {
  nlpData: NLPMatchDetails | null;
  onClose: () => void;
}

export const NLPDetailModal: React.FC<NLPDetailModalProps> = ({ nlpData, onClose }) => {
  if (!nlpData) return null;

  const threshold = 0.38;
  const isFaqMatch = nlpData.matchingSource === 'FAQ_DATABASE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                NLP Pipeline & Cosine Similarity Inspector
              </h3>
              <p className="text-xs text-slate-400">
                Execution time: <span className="text-indigo-300 font-mono">{nlpData.processingTimeMs}ms</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Visual Architecture Decision Path */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Pipeline Flow Decision
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">1. Question Tokens</span>
                <span className="font-mono text-blue-400 font-semibold">{nlpData.stopwordsRemoved.length} terms</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">2. TF-IDF Matrix</span>
                <span className="font-mono text-emerald-400 font-semibold">{nlpData.docVectors.length} FAQs Vectorized</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">3. Top Cosine Score</span>
                <span className="font-mono text-amber-300 font-bold text-sm">
                  {(nlpData.topMatchScore * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Threshold: {(threshold * 100)}%</span>
              </div>

              <div className={`p-3 rounded-lg border text-xs flex flex-col items-center justify-center ${
                isFaqMatch 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  {isFaqMatch ? '4. Match Found' : '4. AI Fallback'}
                </span>
                <span className="font-semibold text-xs flex items-center gap-1">
                  {isFaqMatch ? (
                    <> <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> FAQ DB Match </>
                  ) : (
                    <> <AlertCircle className="w-3.5 h-3.5 text-indigo-400" /> Gemini GenAI </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Tokens & Stopwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-xs font-medium text-slate-400 block mb-2">Raw Query Tokenization</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {nlpData.queryTokens.map((t, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-xs font-medium text-slate-400 block mb-2">After Stopword Filtering & Stemming</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {nlpData.stopwordsRemoved.map((t, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cosine Similarity Vector Scores Table */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Binary className="w-4 h-4 text-indigo-400" /> Cosine Similarity Vector Rankings (Top Candidates)
            </h4>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">FAQ Target Question</th>
                      <th className="p-3">Matching Terms</th>
                      <th className="p-3 text-right">Cosine Similarity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {nlpData.docVectors.slice(0, 6).map((item, idx) => {
                      const isTop = idx === 0;
                      const passesThreshold = item.cosineSimilarity >= threshold;

                      return (
                        <tr 
                          key={item.faqId} 
                          className={isTop ? 'bg-blue-950/30 font-semibold' : 'hover:bg-slate-900/50'}
                        >
                          <td className="p-3 text-slate-400">#{idx + 1}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3 text-slate-200 font-sans max-w-xs truncate">
                            {item.question}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {item.matchingTerms.length > 0 ? (
                                item.matchingTerms.map((term, tIdx) => (
                                  <span key={tIdx} className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    {term}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-500 font-sans italic text-[11px]">None</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`text-xs ${
                                passesThreshold ? 'text-emerald-400 font-bold' : 'text-slate-400'
                              }`}>
                                {(item.cosineSimilarity * 100).toFixed(1)}%
                              </span>
                              <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${passesThreshold ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                  style={{ width: `${Math.min(100, item.cosineSimilarity * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mathematical Cosine Formula Reminder */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <Code className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">
                Vector Formula: CosineSimilarity = (A · B) / (||A|| * ||B||)
              </span>
              Calculates the dot product of query term weights against FAQ target document vector normalized by Euclidean vector length. If score ≥ 38%, the exact FAQ answer is returned instantly; otherwise the query routes to Gemini GenAI for dynamic contextual generation.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
