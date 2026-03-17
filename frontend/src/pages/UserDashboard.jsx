import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { api, user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/');
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (!confirm("Cancel this booking?")) return;
        try {
            await api.delete(`/bookings/${id}`);
            setBookings(bookings.filter(b => b.id !== id));
        } catch (error) {
            alert("Failed to cancel");
        }
    };

    return (
        <div className="py-8">
            <h1 className="text-3xl font-display font-bold text-white mb-8">My Tickets</h1>

            {loading ? <div className="text-gray-400">Loading tickets...</div> : (
                <div className="space-y-6">
                    {bookings.length === 0 ? (
                        <div className="text-center py-20 bg-dark-surface/50 rounded-2xl border border-white/5">
                            <p className="text-gray-400 mb-4">You haven't booked any events yet.</p>
                            <Link to="/" className="text-primary-400 font-bold hover:text-primary-300">Browse Events</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map(booking => (
                                <div key={booking.id} className="relative bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                                    {/* Ticket Header (Stub) */}
                                    <div className="h-4 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

                                    <div className="p-6 flex-grow flex flex-col pt-8">
                                        <div className="absolute top-6 right-6 opacity-20">
                                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>

                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wide mb-2">
                                                {booking.status}
                                            </span>
                                            <h3 className="text-2xl font-bold text-gray-900 leading-none">Booking #{booking.id}</h3>
                                        </div>

                                        <div className="space-y-3 mb-6 flex-grow">
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500 text-sm">Event ID</span>
                                                <span className="font-mono font-bold text-gray-800">{booking.event_id}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500 text-sm">Seats</span>
                                                <span className="font-mono font-bold text-gray-800">{booking.seats_booked}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500 text-sm">Date</span>
                                                <span className="font-mono font-bold text-gray-800">{new Date(booking.booking_time).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Barcode Stub */}
                                        <div className="h-12 bg-gray-100 rounded mb-4 flex items-center justify-center opacity-70">
                                            <div className="font-mono text-xs tracking-[0.5em] text-gray-400">||| |||| || |||</div>
                                        </div>

                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="w-full border border-red-200 text-red-500 py-2 rounded-lg font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>

                                    {/* Perforation Circles */}
                                    <div className="absolute left-0 top-1/2 -translate-x-1/2 w-8 h-8 bg-dark-bg rounded-full"></div>
                                    <div className="absolute right-0 top-1/2 translate-x-1/2 w-8 h-8 bg-dark-bg rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
