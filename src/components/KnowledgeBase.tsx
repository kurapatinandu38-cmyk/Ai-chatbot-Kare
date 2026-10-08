import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ThumbsUp, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  Tag,
  Clock
} from 'lucide-react';
import { FAQItem, Department } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';

interface KnowledgeBaseProps {
  faqs: FAQItem[];
  onAskFaq: (question: string) => void;
}

const CATEGORIES: Department[] = [
  'All',
  'Admissions',
  'Academics',
  'Financial Aid & Tuition',
  'Housing & Dining',
  'Campus Life & Facilities',
  'IT Support & Library'
];

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ faqs, onAskFaq }) => {
  const [selectedCategory, setSelectedCategory] = useState<Department>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id || null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      faq.question.toLowerCase().includes(q) || 
      faq.answer.toLowerCase().includes(q) ||
      faq.keywords.some(k => k.toLowerCase().includes(q));
    
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100">
      
      {/* Search & Category Header */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <KalasalingamLogo size="sm" variant="badge" />
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>University Knowledge Base & FAQs</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Search official university policies, deadlines, tuition schedules, and campus guidelines.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-medium">
            Showing <strong className="text-white font-bold">{filteredFaqs.length}</strong> of {faqs.length} FAQs
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by keywords (e.g. tuition, fafsa, add drop, wifi, dorms)..."
            className="w-full bg-[#121212] border border-[#222222] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-[#0a0a0a] border border-[#222222] hover:border-zinc-700 rounded-xl overflow-hidden transition-colors"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="p-4 cursor-pointer flex items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-blue-400 border border-zinc-700 shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="text-sm font-semibold text-white truncate">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-zinc-400">
                    <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
                      <span className="flex items-center gap-1" title="Views">
                        <Eye className="w-3.5 h-3.5" /> {faq.viewsCount}
                      </span>
                      <span className="flex items-center gap-1" title="Helpful votes">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> {faq.helpfulCount}
                      </span>
                    </div>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Answer Body */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#222222] bg-[#121212]/50 space-y-3">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>

                    {/* Keywords & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#222222]">
                      
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Tag className="w-3 h-3 text-zinc-500" />
                        {faq.keywords.map((kw, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Updated {faq.updatedAt}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAskFaq(faq.question);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-600/20"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Ask AI Chatbot
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No matching FAQs found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different department category.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
