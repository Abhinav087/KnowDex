import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPaperAirplane,
    HiUpload,
    HiDocumentText,
    HiTrash,
    HiSparkles,
    HiLightningBolt,
    HiChip,
    HiFolder,
    HiSearch,
    HiMenuAlt2
} from 'react-icons/hi';
import clsx from 'clsx';

interface Paper {
    id: number; title: string; authors: string; abstract: string; created_at: string;
}
interface Message {
    id: number; role: string; content: string;
}

export default function Workspace() {
    const { id } = useParams<{ id: string }>();
    const [tab, setTab] = useState<'papers' | 'chat'>('chat');
    const [papers, setPapers] = useState<Paper[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [model, setModel] = useState('groq');
    const [chatLoading, setChatLoading] = useState(false);
    const [wsName, setWsName] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Upload state
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState('');
    const [abstract, setAbstract] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        fetchWorkspace();
        fetchPapers();
        if (tab === 'chat') {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, chatLoading]);

    const fetchWorkspace = async () => {
        try {
            const res = await api.get(`/workspaces/${id}`);
            setWsName(res.data.name);
        } catch { }
    };

    const fetchPapers = async () => {
        try {
            const res = await api.get(`/papers/${id}`);
            setPapers(res.data);
        } catch { }
    };

    const uploadPaper = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        const form = new FormData();
        form.append('workspace_id', id!);
        form.append('title', title);
        form.append('authors', authors);
        form.append('abstract', abstract);
        form.append('file', file);
        try {
            await api.post('/papers/', form);
            toast.success('Paper uploaded to Knowledge Base');
            setTitle(''); setAuthors(''); setAbstract(''); setFile(null); setShowUpload(false);
            fetchPapers();
        } catch {
            toast.error('Upload failed');
        }
    };

    const deletePaper = async (paperId: number) => {
        try {
            await api.delete(`/papers/${paperId}`);
            toast.success('Paper removed');
            fetchPapers();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const sendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        const userMsgObj = { id: Date.now(), role: 'user', content: userMsg };
        setMessages((prev) => [...prev, userMsgObj]);
        setChatLoading(true);

        try {
            const res = await api.post('/chat/', { message: userMsg, model, workspace_id: Number(id) });

            // Simulate streaming effect for better UX
            const fullContent = res.data.content;
            const aiMsgObj = { id: res.data.id, role: 'assistant', content: '' };
            setMessages(prev => [...prev, aiMsgObj]);

            let currentLength = 0;
            const streamInterval = setInterval(() => {
                currentLength += 5; // speed of "streaming"
                if (currentLength >= fullContent.length) {
                    clearInterval(streamInterval);
                    setMessages(prev => prev.map(m => m.id === res.data.id ? { ...m, content: fullContent } : m));
                    setChatLoading(false);
                } else {
                    setMessages(prev => prev.map(m => m.id === res.data.id ? { ...m, content: fullContent.substring(0, currentLength) } : m));
                }
            }, 10);

        } catch {
            toast.error('AI service unavailable');
            setChatLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col h-[calc(100vh-6rem)] pl-16 md:pl-0">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-surface-400">
                            <HiFolder className="text-xl" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white relative flex items-center gap-2">
                                {wsName || 'Loading...'}
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">PRO</span>
                            </h1>
                            <p className="text-xs text-surface-400 font-medium">{papers.length} sources linked</p>
                        </div>
                    </div>

                    <div className="bg-surface-900/50 backdrop-blur-md p-1 rounded-xl border border-white/5 flex gap-1">
                        <button
                            onClick={() => setTab('chat')}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                tab === 'chat' ? "bg-surface-700 text-white shadow-lg shadow-black/20" : "text-surface-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <HiSparkles /> Chat
                        </button>
                        <button
                            onClick={() => setTab('papers')}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                tab === 'papers' ? "bg-surface-700 text-white shadow-lg shadow-black/20" : "text-surface-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <HiDocumentText /> Sources
                        </button>
                    </div>
                </div>

                {tab === 'papers' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 bg-surface-900/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-900/50 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><HiDocumentText className="text-primary-400" /> Knowledge Base</h2>
                            <button onClick={() => setShowUpload(!showUpload)} className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-primary-900/20">
                                <HiUpload /> Add Source
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <AnimatePresence>
                                {showUpload && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mb-6 overflow-hidden"
                                    >
                                        <div className="bg-surface-800/50 border border-primary-500/30 rounded-xl p-6 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
                                            <h3 className="text-sm font-semibold text-primary-300 mb-4 uppercase tracking-wider">New Source</h3>
                                            <form onSubmit={uploadPaper} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Paper Title" className="input-field bg-surface-900" autoFocus />
                                                    <input value={authors} onChange={e => setAuthors(e.target.value)} placeholder="Authors" className="input-field bg-surface-900" />
                                                </div>
                                                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-surface-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600/10 file:text-primary-400 hover:file:bg-primary-600/20 transition-all cursor-pointer" />
                                                <div className="flex gap-3 justify-end pt-2">
                                                    <button type="button" onClick={() => setShowUpload(false)} className="btn-secondary text-sm">Cancel</button>
                                                    <button type="submit" className="btn-primary text-sm">Upload PDF</button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {papers.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-50">
                                    <HiDocumentText className="text-6xl text-surface-600 mb-4" />
                                    <p className="text-surface-400 text-lg">Knowledge base is empty</p>
                                </div>
                            ) : (
                                papers.map(p => (
                                    <motion.div
                                        layout
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group p-4 bg-surface-800/30 hover:bg-surface-800 border border-white/5 hover:border-white/10 rounded-xl transition-all flex items-start justify-between cursor-default"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-surface-700/50 flex items-center justify-center text-2xl">📄</div>
                                            <div>
                                                <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors">{p.title}</h3>
                                                <p className="text-sm text-surface-400">{p.authors}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deletePaper(p.id)} className="p-2 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                            <HiTrash />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {tab === 'chat' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col overflow-hidden bg-surface-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl relative"
                    >
                        {/* Model Bar */}
                        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-surface-900/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-surface-800 p-1 rounded-lg border border-white/5">
                                    <button
                                        onClick={() => setModel('groq')}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2",
                                            model === 'groq' ? "bg-primary-600 text-white shadow-md" : "text-surface-400 hover:text-white"
                                        )}
                                    >
                                        <HiLightningBolt /> Llama 3 70B
                                    </button>
                                    <button
                                        onClick={() => setModel('gemini')}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2",
                                            model === 'gemini' ? "bg-blue-600 text-white shadow-md" : "text-surface-400 hover:text-white"
                                        )}
                                    >
                                        <HiSparkles /> Gemini 2.0
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="h-full flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center mb-8 shadow-2xl shadow-primary-900/20">
                                        <HiChip className="text-5xl text-primary-400 drop-shadow-lg" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-3">Research Assistant</h2>
                                    <p className="text-surface-400 max-w-sm mb-10 text-lg">What would you like to discover today?</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                        {[
                                            { icon: HiSearch, text: "Summarize the key findings" },
                                            { icon: HiDocumentText, text: "Compare methodologies used" },
                                            { icon: HiLightningBolt, text: "Critique the experimental design" },
                                            { icon: HiSparkles, text: "Draft a literature review" }
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setChatInput(item.text)}
                                                className="p-4 bg-surface-800/40 hover:bg-surface-800 border border-white/5 hover:border-primary-500/30 rounded-xl text-left transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-4 group"
                                            >
                                                <div className="p-2 bg-surface-700/50 rounded-lg text-surface-300 group-hover:text-primary-400 transition-colors">
                                                    <item.icon className="text-lg" />
                                                </div>
                                                <span className="text-surface-300 group-hover:text-white group-hover:font-medium transition-colors font-medium">{item.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={clsx(
                                        "flex gap-6 max-w-4xl mx-auto",
                                        msg.role === 'user' ? "flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={clsx(
                                        "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg",
                                        msg.role === 'user' ? "bg-primary-600" : "bg-gradient-to-br from-indigo-600 to-purple-600"
                                    )}>
                                        {msg.role === 'user' ? <span className="font-bold text-white">You</span> : <HiChip className="text-xl text-white" />}
                                    </div>

                                    <div className={clsx(
                                        "flex-1 min-w-0 rounded-2xl p-6 shadow-xl",
                                        msg.role === 'user' ? "bg-primary-600 text-white rounded-tr-sm" : "bg-surface-800 border border-white/5 text-surface-100 rounded-tl-sm"
                                    )}>
                                        {msg.role === 'assistant' ? (
                                            <div className="markdown-body">
                                                <ReactMarkdown
                                                    components={{
                                                        code({ node, inline, className, children, ...props }: any) {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return !inline && match ? (
                                                                <SyntaxHighlighter
                                                                    style={atomDark}
                                                                    language={match[1]}
                                                                    PreTag="div"
                                                                    {...props}
                                                                >
                                                                    {String(children).replace(/\n$/, '')}
                                                                </SyntaxHighlighter>
                                                            ) : (
                                                                <code className={className} {...props}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                                {chatLoading && idx === messages.length - 1 && msg.content.length === 0 && (
                                                    <div className="flex gap-1.5 mt-2">
                                                        <span className="w-2 h-2 rounded-full bg-surface-500 animate-bounce" />
                                                        <span className="w-2 h-2 rounded-full bg-surface-500 animate-bounce delay-100" />
                                                        <span className="w-2 h-2 rounded-full bg-surface-500 animate-bounce delay-200" />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-surface-900 border-t border-white/5 relative z-20">
                            <div className="max-w-4xl mx-auto relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
                                <input
                                    ref={inputRef}
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    placeholder="Message..."
                                    className="relative w-full bg-surface-800 border border-white/10 rounded-2xl pl-6 pr-16 py-4 text-white placeholder-surface-400 focus:outline-none focus:ring-0 shadow-xl"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={chatLoading || !chatInput.trim()}
                                    className="absolute right-2 top-2 p-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-lg hover:shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 z-10"
                                >
                                    <HiPaperAirplane className="text-lg translate-x-0.5 -translate-y-0.5" />
                                </button>
                            </div>
                            <div className="text-center mt-3 text-xs text-surface-500 font-medium">
                                Powered by Llama 3 & Gemini 2.0 • Knowdex AI Research Engine
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
}
