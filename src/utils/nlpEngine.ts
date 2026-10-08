import { FAQItem, NLPMatchDetails, TFIDFVector } from '../types';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
  'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
  'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t',
  'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
  'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why',
  'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours',
  'yourself', 'yourselves', 'please', 'tell', 'know', 'want', 'need', 'find', 'university', 'college', 'student'
]);

/**
 * Tokenize text into normalized lower-case terms
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.trim().length > 1);
}

/**
 * Remove stopwords from tokens
 */
export function filterStopwords(tokens: string[]): string[] {
  return tokens.filter(token => !STOP_WORDS.has(token));
}

/**
 * Calculate Term Frequency (TF) for a set of tokens
 */
export function calculateTF(tokens: string[]): Map<string, number> {
  const tfMap = new Map<string, number>();
  if (tokens.length === 0) return tfMap;

  for (const token of tokens) {
    tfMap.set(token, (tfMap.get(token) || 0) + 1);
  }

  // Normalize by total tokens
  for (const [token, count] of tfMap.entries()) {
    tfMap.set(token, count / tokens.length);
  }

  return tfMap;
}

/**
 * Calculate Inverse Document Frequency (IDF) matrix across FAQ corpus
 */
export function calculateCorpusIDF(faqs: FAQItem[]): Map<string, number> {
  const docCount = faqs.length;
  const docFreqMap = new Map<string, number>();

  for (const faq of faqs) {
    const combinedText = `${faq.question} ${faq.answer} ${faq.keywords.join(' ')}`;
    const uniqueTokens = new Set(filterStopwords(tokenize(combinedText)));

    for (const token of uniqueTokens) {
      docFreqMap.set(token, (docFreqMap.get(token) || 0) + 1);
    }
  }

  const idfMap = new Map<string, number>();
  for (const [token, freq] of docFreqMap.entries()) {
    // Smoothed IDF: log(N / df) + 1
    const idf = Math.log((docCount + 1) / (freq + 1)) + 1;
    idfMap.set(token, idf);
  }

  return idfMap;
}

/**
 * Compute TF-IDF vector weights for a document or query
 */
export function buildTFIDFVector(
  tokens: string[],
  idfMap: Map<string, number>
): Map<string, number> {
  const tfMap = calculateTF(tokens);
  const tfidfMap = new Map<string, number>();

  for (const [token, tf] of tfMap.entries()) {
    const idf = idfMap.get(token) || (Math.log(100) + 1); // fallback idf for rare words
    tfidfMap.set(token, tf * idf);
  }

  return tfidfMap;
}

/**
 * Calculate Cosine Similarity between two TF-IDF weight vectors
 * Formula: CosineSimilarity = (A · B) / (||A|| * ||B||)
 */
export function calculateCosineSimilarity(
  vecA: Map<string, number>,
  vecB: Map<string, number>
): { score: number; matchingTerms: string[] } {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const matchingTerms: string[] = [];

  for (const [term, weightA] of vecA.entries()) {
    normA += weightA * weightA;
    if (vecB.has(term)) {
      const weightB = vecB.get(term)!;
      dotProduct += weightA * weightB;
      matchingTerms.push(term);
    }
  }

  for (const [, weightB] of vecB.entries()) {
    normB += weightB * weightB;
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return { score: 0, matchingTerms: [] };
  }

  const score = dotProduct / (normA * normB);
  return { score: Math.min(1.0, Math.max(0.0, score)), matchingTerms };
}

/**
 * Main NLP Matcher engine
 */
export function processNLPMatching(
  userQuery: string,
  faqs: FAQItem[],
  similarityThreshold: number = 0.35
): NLPMatchDetails {
  const startTime = performance.now();

  const rawTokens = tokenize(userQuery);
  const filteredTokens = filterStopwords(rawTokens);
  
  const corpusIDF = calculateCorpusIDF(faqs);
  const queryTFIDF = buildTFIDFVector(filteredTokens, corpusIDF);

  const docResults = faqs.map(faq => {
    // Weight question text higher than body answer
    const questionTokens = filterStopwords(tokenize(`${faq.question} ${faq.question} ${faq.keywords.join(' ')}`));
    const docTFIDF = buildTFIDFVector(questionTokens, corpusIDF);

    const { score, matchingTerms } = calculateCosineSimilarity(queryTFIDF, docTFIDF);

    // Boost score if keyword exact match
    let finalScore = score;
    const lowerQuery = userQuery.toLowerCase();
    for (const kw of faq.keywords) {
      if (lowerQuery.includes(kw.toLowerCase())) {
        finalScore = Math.min(1.0, finalScore + 0.08);
      }
    }

    return {
      faqId: faq.id,
      question: faq.question,
      category: faq.category,
      cosineSimilarity: Number(finalScore.toFixed(4)),
      matchingTerms,
      faq
    };
  });

  // Sort descending by score
  docResults.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);

  const topMatch = docResults[0];
  const isMatchFound = topMatch && topMatch.cosineSimilarity >= similarityThreshold;

  const endTime = performance.now();

  return {
    queryTokens: rawTokens,
    stopwordsRemoved: filteredTokens,
    docVectors: docResults.map(d => ({
      faqId: d.faqId,
      question: d.question,
      category: d.category,
      cosineSimilarity: d.cosineSimilarity,
      matchingTerms: d.matchingTerms
    })),
    topMatchScore: topMatch ? topMatch.cosineSimilarity : 0,
    topMatchFaq: isMatchFound ? topMatch.faq : undefined,
    processingTimeMs: Number((endTime - startTime).toFixed(2)),
    matchingSource: isMatchFound ? 'FAQ_DATABASE' : 'GEMINI_AI'
  };
}
