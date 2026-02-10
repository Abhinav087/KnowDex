import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiArrowRight, HiTrash, HiSearch } from 'react-icons/hi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

interface Workspace {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export default function Dashboard() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchWorkspaces = async () => {
        try {
            const res = await api.get('/workspaces/');
            setWorkspaces(res.data);
        } catch {
            toast.error('Failed to load workspaces');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorkspaces(); }, []);

    const createWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/workspaces/', { name, description: desc });
            toast.success('Workspace created!');
            setName(''); setDesc(''); setShowCreate(false);
            fetchWorkspaces();
        } catch {
            toast.error('Failed to create workspace');
        }
    };

    const deleteWorkspace = async (id: number) => {
        if (!confirm('Delete this workspace?')) return;
        try {
            await api.delete(`/workspaces/${id}`);
            toast.success('Workspace deleted');
            fetchWorkspaces();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-surface-400">Research Hub</h1>
                    <p className="text-surface-200/50 mt-2 text-lg">Manage your research projects and AI interactions</p>
                </div>
                <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2 shadow-xl shadow-primary-900/20">
                    <HiPlus className="text-lg" /> New Workspace
                </button>
            </div>

            {showCreate && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card mb-8 border-primary-500/30 ring-4 ring-primary-500/10">
                    <h3 className="text-xl font-semibold mb-4">Create New Workspace</h3>
                    <form onSubmit={createWorkspace} className="space-y-4">
                        <input value={name} onChange={(e) => setName(e.target.value)} required className="input-field" placeholder="E.g., Quantum Physics Research" />
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="input-field" placeholder="Description (optional)" rows={2} />
                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary">Create Workspace</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-48 rounded-2xl bg-surface-800/50 animate-pulse" />
                    ))}
                </div>
            ) : workspaces.length === 0 ? (
                <div className="text-center py-32 bg-surface-900/30 rounded-3xl border border-white/5 border-dashed">
                    <div className="w-20 h-20 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-6">
                        <HiPlus className="text-4xl text-primary-400" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">No workspaces yet</h3>
                    <p className="text-surface-200/50 max-w-md mx-auto mb-8">Create your first workspace to start organizing papers and chatting with AI.</p>
                    <button onClick={() => setShowCreate(true)} className="btn-secondary">Create Workspace</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces.map((ws, i) => (
                        <motion.div
                            key={ws.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => navigate(`/workspace/${ws.id}`)}
                            className="card group hover:border-primary-500/50 hover:bg-surface-800/80 transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={(e) => { e.stopPropagation(); deleteWorkspace(ws.id); }} className="text-surface-400 hover:text-red-400 bg-surface-900/50 rounded-lg p-2 hover:bg-red-900/20 transition-all">
                                    <HiTrash />
                                </button>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-primary-400">{ws.name.charAt(0).toUpperCase()}</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">{ws.name}</h3>
                            <p className="text-surface-200/50 mb-6 line-clamp-2 h-10">{ws.description || 'No description provided.'}</p>

                            <div className="flex items-center text-primary-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                                Open Workspace <HiArrowRight className="ml-2" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Layout>
    );
}
