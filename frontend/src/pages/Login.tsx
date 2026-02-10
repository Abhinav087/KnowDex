import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new URLSearchParams();
            form.append('username', email);
            form.append('password', password);
            const res = await api.post('/auth/login', form, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            login(res.data.access_token);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch {
            toast.error('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-surface-200/60">Sign in to your research workspace</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-200/80 mb-1.5">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-200/80 mb-1.5">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-surface-200/50">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
