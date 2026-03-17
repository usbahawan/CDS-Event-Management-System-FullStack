import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 glass">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-display font-bold tracking-wider gradient-text hover:opacity-80 transition-opacity">
                        CDS EVENTS
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all">Home</Link>
                        {user ? (
                            <>
                                {user.role === 'organizer' && (
                                    <Link to="/organizer" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all">Dashboard</Link>
                                )}
                                {user.role === 'attendee' && (
                                    <Link to="/dashboard" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all">My Tickets</Link>
                                )}
                                <div className="flex items-center space-x-4 pl-4 border-l border-gray-700">
                                    <span className="text-gray-400 text-sm">Hi, {user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-primary-500/30">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white focus:outline-none bg-white/10 p-2 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 animate-fade-in glass rounded-xl p-4">
                        <div className="flex flex-col space-y-4">
                            <Link to="/" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                            {user ? (
                                <>
                                    {user.role === 'organizer' && (
                                        <Link to="/organizer" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                    )}
                                    {user.role === 'attendee' && (
                                        <Link to="/dashboard" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>My Tickets</Link>
                                    )}
                                    <div className="border-t border-gray-700 pt-4 mt-2">
                                        <div className="text-gray-500 mb-2">Signed in as {user.name}</div>
                                        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 w-full text-left">Logout</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                    <Link to="/register" className="text-primary-400 font-bold py-2" onClick={() => setIsMenuOpen(false)}>Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
