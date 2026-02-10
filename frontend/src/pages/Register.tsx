import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { email, password, full_name: fullName });
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch {
            toast.error('Registration failed. Email may already be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-surface-200/60">Start your AI-powered research journey</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-200/80 mb-1.5">Full Name</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="input-field" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-200/80 mb-1.5">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-200/80 mb-1.5">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-field" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-surface-200/50">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
