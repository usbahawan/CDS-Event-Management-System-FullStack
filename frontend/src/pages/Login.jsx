import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import authBg from '../assets/auth_bg.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative top-0 left-0 w-full -mt-4">
            <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                <img src={authBg} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 glass rounded-2xl shadow-2xl animate-slide-up border border-white/10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-display font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to access your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-dark-surface/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg bg-dark-surface/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-primary-600/30 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-700 pt-6">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
