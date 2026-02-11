import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    HiSun, HiMoon, HiUserCircle, HiPaperClip, HiArrowUp, 
    HiBookmark, HiShare, HiX, HiChevronDown
} from 'react-icons/hi';
import Layout from '../components/Layout';
import clsx from 'clsx';
// import api from '../services/api'; // Commented out for UI demo

// Types
interface SearchResult {
    id: number;
    title: string;
    summary: string;
    date: string;
    author: string;
    tags: string[];
    content: string; // Full content for detail view
}

const MODELS = [
    { id: 'gemini-3.0', name: 'Gemini 3.0' },
    { id: 'gemini-3.0-flash', name: 'Gemini 3.0 Flash' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'groq', name: 'Llama 3 (Groq)' },
];

export default function Dashboard() {
    // Theme State
    const [darkMode, setDarkMode] = useState(true);
    
    // UI State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [showModelMenu, setShowModelMenu] = useState(false);

    // Initial Theme Effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Mock Search Handler
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setIsSearching(true);
        // Simulate API call delay
        setTimeout(() => {
            const mockResults: SearchResult[] = [
                {
                    id: 1,
                    title: "Advances in Quantum Computing 2024",
                    summary: "A comprehensive review of the latest breakthroughs in superconducting qubits and error correction codes.",
                    date: "Oct 12, 2025",
                    author: "Dr. Sarah Chen",
                    tags: ["Quantum Physics", "Computing", "Review"],
                    content: "Full content regarding quantum computing advances... This paper discusses the implementation of surface codes in recent experiments."
                },
                {
                    id: 2,
                    title: "Generative AI in Healthcare Guidelines",
                    summary: "Analyzing the impact of LLMs on diagnostic accuracy and patient interaction protocols.",
                    date: "Jan 15, 2026",
                    author: "J. Smith & A. Doe",
                    tags: ["AI", "Healthcare", "Ethics"],
                    content: "Full content about AI in healthcare... Ethical considerations for autonomous systems in clinical settings are evaluated."
                },
                {
                    id: 3,
                    title: "Gemini 3.0 Architecture Overview",
                    summary: "Technical report on the multimodal capabilities of the new Gemini 3.0 architecture.",
                    date: "Feb 10, 2026",
                    author: "Google DeepMind",
                    tags: ["LLM", "Multimodal", "Gemini"],
                    content: "This report details the sparse mixture-of-experts architecture used in Gemini 3.0, providing lower latency and higher throughput."
                }
            ];
            setResults(mockResults);
            setIsSearching(false);
        }, 800);
    };

    return (
        <Layout>
            <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-surface-950 text-slate-900 dark:text-white transition-colors duration-300">
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col h-full relative z-0">
                    
                    {/* Top Bar */}
                    <header className="h-16 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="relative">
                            <button 
                                onClick={() => setShowModelMenu(!showModelMenu)}
                                className="flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
                            >
                                <span className="font-semibold text-lg">KnowDex</span>
                                <span className="text-slate-400 dark:text-surface-400 text-sm font-medium flex items-center gap-1">
                                    {selectedModel.name} <HiChevronDown size={14} />
                                </span>
                            </button>
                            
                            {showModelMenu && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowModelMenu(false)} />
                                    <motion.div 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-black/10 dark:border-white/10 overflow-hidden z-20"
                                    >
                                        <div className="p-1">
                                            {MODELS.map(model => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                                                    className={clsx(
                                                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                                                        selectedModel.id === model.id 
                                                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" 
                                                            : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-surface-200"
                                                    )}
                                                >
                                                    {model.name}
                                                    {model.id.includes('flash') && <span className="text-[10px] ml-auto uppercase tracking-wide opacity-70">Flash</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-slate-400"
                            >
                                {darkMode ? <HiSun className="text-xl" /> : <HiMoon className="text-xl" />}
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-transparent hover:ring-offset-2 hover:ring-primary-500 transition-all cursor-pointer">
                                AB
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="max-w-3xl mx-auto w-full px-4 pt-10 pb-48">
                            
                            {/* Empty State */}
                            {results.length === 0 && !isSearching && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center mt-20"
                                >
                                    <div className="w-16 h-16 bg-white dark:bg-surface-800 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                                        <HiUserCircle className="text-4xl text-primary-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 dark:text-white">How can I help you research?</h2>
                                    <p className="text-slate-500 dark:text-surface-400">Search for papers, summaries, or ask questions.</p>
                                </motion.div>
                            )}

                            {/* Search Results */}
                            <div className="flex flex-col gap-4">
                                {results.map((result, i) => (
                                    <motion.div
                                        key={result.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setSelectedResult(result)}
                                        className={clsx(
                                            "group p-5 rounded-2xl border cursor-pointer transition-all duration-200 text-left",
                                            "bg-white dark:bg-surface-900",
                                            selectedResult?.id === result.id 
                                                ? "ring-2 ring-primary-500 border-transparent bg-primary-50/50 dark:bg-primary-900/10 shadow-lg shadow-primary-500/10" 
                                                : "border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:shadow-md"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-base font-bold dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {result.title}
                                            </h3>
                                            <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{result.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-surface-300 leading-relaxed mb-4 line-clamp-2">
                                            {result.summary}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {result.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-surface-800 text-slate-600 dark:text-surface-300 uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {isSearching && (
                                <div className="space-y-4 mt-8">
                                    {[1, 2].map(n => (
                                        <div key={n} className="h-32 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Input Area */}
                    <div className="p-4 absolute bottom-0 left-0 right-0 z-10">
                         {/* Gradient Fade */}
                         <div className="absolute bottom-full left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-surface-950 to-transparent pointer-events-none" />
                         
                         <div className="max-w-3xl mx-auto w-full relative bg-white dark:bg-surface-950 pb-2">
                            <form onSubmit={handleSearch} className="relative group">
                                <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-[#212121] border border-black/5 dark:border-white/5 rounded-[26px] p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-black/10 dark:focus-within:border-white/10 transition-all">
                                    <button type="button" className="p-2 mb-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-black/5 dark:bg-white/5 rounded-full">
                                        <HiPaperClip className="text-lg" />
                                    </button>
                                    <textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSearch(e);
                                            }
                                        }}
                                        placeholder={`Ask ${selectedModel.name}...`}
                                        rows={1}
                                        className="flex-1 max-h-48 py-3 bg-transparent border-none focus:ring-0 resize-none outline-none dark:text-white placeholder:text-slate-400 custom-scrollbar text-base"
                                        style={{ minHeight: '48px' }}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!query.trim()}
                                        className={clsx(
                                            "p-2 mb-0.5 rounded-full transition-all duration-200 flex items-center justify-center w-10 h-10",
                                            query.trim() 
                                                ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-80" 
                                                : "bg-transparent text-slate-300 dark:text-surface-600 cursor-not-allowed"
                                        )}
                                    >
                                        <HiArrowUp className="text-lg" />
                                    </button>
                                </div>
                            </form>
                            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                KnowDex can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Detailed Panel */}
                <AnimatePresence>
                    {selectedResult && (
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 50, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-[400px] border-l border-black/5 dark:border-white/5 bg-white dark:bg-surface-950 absolute right-0 top-0 bottom-0 z-30 shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/90 dark:bg-surface-950/90 backdrop-blur-sm py-2 z-10">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Result Details</span>
                                    <button 
                                        onClick={() => setSelectedResult(null)}
                                        className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 transition-colors"
                                    >
                                        <HiX className="text-lg" />
                                    </button>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h2 className="text-2xl font-bold mb-3 dark:text-white leading-tight">
                                        {selectedResult.title}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-6 text-sm">
                                        <span className="font-semibold text-slate-900 dark:text-white">{selectedResult.author}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-500">{selectedResult.date}</span>
                                    </div>

                                    <div className="flex gap-2 mb-8">
                                        <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2 text-sm rounded-lg border border-black/10 dark:border-white/10 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                                            <HiBookmark className="text-lg" /> Save
                                        </button>
                                        <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2 text-sm rounded-lg border border-black/10 dark:border-white/10 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                                            <HiShare className="text-lg" /> Share
                                        </button>
                                    </div>

                                    <div className="prose dark:prose-invert max-w-none">
                                        <div className="bg-slate-50 dark:bg-surface-900 p-4 rounded-xl mb-6">
                                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Summary</h3>
                                            <p className="text-sm leading-relaxed text-slate-700 dark:text-surface-200">
                                                {selectedResult.summary}
                                            </p>
                                        </div>
                                        
                                        <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 ml-1">Full Content</h3>
                                        <div className="text-sm leading-relaxed text-slate-600 dark:text-surface-300">
                                            {selectedResult.content}
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-black/5 dark:border-white/5 pt-6">
                                        <h3 className="text-xs font-bold uppercase text-slate-500 mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedResult.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-surface-900 text-slate-700 dark:text-surface-300 border border-transparent hover:border-black/5 dark:hover:border-white/10 transition-colors cursor-pointer">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}
