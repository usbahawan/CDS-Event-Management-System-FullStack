import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import event1 from '../assets/event_1.png';

const EventDetails = () => {
    const { id } = useParams();
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seats, setSeats] = useState(1);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`/api/events/${id}`);
                setEvent(res.data);
            } catch (error) {
                console.error("Error fetching event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingError('');
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post('/bookings/', { event_id: event.id, seats: parseInt(seats) });
            alert("Booking Confirmed!");
            navigate('/dashboard');
        } catch (error) {
            setBookingError(error.response?.data?.detail || "Booking failed");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!event) return <div className="text-center text-white mt-20">Event not found</div>;

    const bgImage = event1; // Default for now

    return (
        <div className="-mt-4">
            {/* Hero Header */}
            <div className="relative h-[400px] w-full mb-8">
                <div className="absolute inset-0">
                    <img src={bgImage} alt={event.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-8 container mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block bg-primary-600/80 backdrop-blur text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-white/20">
                                {event.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 animate-slide-up">{event.title}</h1>
                            <div className="flex items-center text-gray-300 space-x-6 text-lg">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {new Date(event.date_time).toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {event.venue}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center min-w-[140px]">
                            <div className="text-3xl font-bold text-white mb-1">PKR {event.price}</div>
                            <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">Per Ticket</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 animate-fade-in delay-100">
                {/* Details Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-2xl border-t border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">About This Event</h3>
                        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">{event.description}</p>
                    </div>

                    <div className="glass p-8 rounded-2xl border-t border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Venue Information</h3>
                        <div className="bg-dark-surface/50 p-6 rounded-xl border border-white/5 flex items-center space-x-4">
                            <div className="bg-primary-600/20 p-3 rounded-full">
                                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <div>
                                <div className="text-white font-bold text-lg">{event.venue}</div>
                                <div className="text-gray-400">Total Capacity: {event.total_seats} seats</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 glass p-6 rounded-2xl border-t border-white/10 border-l border-white/5 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Secure your spot</h3>

                        <div className="mb-6">
                            <div className="flex justify-between text-gray-400 mb-2">
                                <span>Seats Available</span>
                                <span>{event.available_seats} / {event.total_seats}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-secondary-500" style={{ width: `${(event.available_seats / event.total_seats) * 100}%` }}></div>
                            </div>
                        </div>

                        {bookingError && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">{bookingError}</div>}

                        {user?.role === 'organizer' ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-yellow-200 text-center">
                                Logged in as Organizer. <br /> Switch to attendee account to book.
                            </div>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-6">
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Number of Tickets</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            max={event.available_seats}
                                            className="w-full bg-dark-surface border border-gray-600 rounded-xl p-4 text-white font-bold text-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={seats}
                                            onChange={(e) => setSeats(e.target.value)}
                                            required
                                        />
                                        <div className="absolute right-4 top-4 text-gray-500">tickets</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-4 border-t border-gray-700">
                                    <span className="text-gray-400">Total Price</span>
                                    <span className="text-2xl font-bold text-white">PKR {(event.price * seats).toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-600/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={event.available_seats === 0}
                                >
                                    {event.available_seats === 0 ? 'Sold Out' : 'Confirm Booking'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
