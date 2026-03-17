import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrganizerDashboard = () => {
    const { api, user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [selectedEventBookings, setSelectedEventBookings] = useState([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '', description: '', category: '', date_time: '', venue: '', total_seats: 0, price: 0
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events/');
            setEvents(res.data);
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg('Creating event...');
        try {
            const payload = {
                ...formData,
                total_seats: parseInt(formData.total_seats),
                price: parseFloat(formData.price),
                date_time: new Date(formData.date_time).toISOString()
            };
            await api.post('/events/', payload);
            setStatusMsg('Success: Event Created!');
            setShowModal(false);
            fetchEvents();
            setFormData({ title: '', description: '', category: '', date_time: '', venue: '', total_seats: 0, price: 0 });
            setTimeout(() => setStatusMsg(''), 3000);
        } catch (error) {
            console.error("Create Error:", error);
            setStatusMsg(`Error: ${error.response?.data?.detail || error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (error) {
            alert("Failed to delete (You might not be the owner)");
        }
    };

    const handleViewBookings = async (event) => {
        setSelectedEventTitle(event.title);
        try {
            const res = await api.get(`/events/${event.id}/bookings`);
            setSelectedEventBookings(res.data);
            setShowBookingsModal(true);
        } catch (error) {
            console.error("Fetch bookings error", error);
            alert("Failed to fetch bookings. You may not be authorized.");
        }
    };

    // Calculate Stats
    const totalEvents = events.length;
    const totalSeats = events.reduce((acc, curr) => acc + curr.total_seats, 0);
    // filter by user.id for "My Events"
    const myEvents = events.filter(e => e.organizer_id === user?.id || user?.email === 'huzaifa.cds@gmail.com');

    return (
        <div>
            {/* Header Stats */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Organizer Dashboard</h1>
                    <p className="text-gray-400">Manage your events and track performance</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-1"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Event
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border-t border-white/10">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Events</div>
                    <div className="text-4xl font-bold text-white">{totalEvents}</div>
                </div>
                <div className="glass p-6 rounded-2xl border-t border-white/10">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">My Events</div>
                    <div className="text-4xl font-bold text-primary-400">{myEvents.length}</div>
                </div>
                <div className="glass p-6 rounded-2xl border-t border-white/10">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Capacity</div>
                    <div className="text-4xl font-bold text-secondary-400">{totalSeats}</div>
                </div>
            </div>

            {statusMsg && (
                <div className={`p-4 mb-6 rounded-xl border ${statusMsg.startsWith('Error') ? 'bg-red-500/10 border-red-500/50 text-red-200' : 'bg-green-500/10 border-green-500/50 text-green-200'}`}>
                    {statusMsg}
                </div>
            )}

            {/* Events Table */}
            <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white">All Events</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-dark-surface/50 text-left">
                                <th className="py-4 px-6 text-gray-400 font-medium text-sm uppercase">Title</th>
                                <th className="py-4 px-6 text-gray-400 font-medium text-sm uppercase">Date</th>
                                <th className="py-4 px-6 text-gray-400 font-medium text-sm uppercase">Venue</th>
                                <th className="py-4 px-6 text-gray-400 font-medium text-sm uppercase">Availability</th>
                                <th className="py-4 px-6 text-gray-400 font-medium text-sm uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map(event => (
                                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-white">{event.title}</div>
                                        <div className="text-xs text-gray-500">{event.category}</div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-300">{new Date(event.date_time).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-gray-300">{event.venue}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="w-24 h-2 bg-gray-700 rounded-full mr-3 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-500"
                                                    style={{ width: `${(event.available_seats / event.total_seats) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-400">{event.available_seats}/{event.total_seats}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => handleViewBookings(event)}
                                                className="text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-1.5 rounded-lg text-sm transition-colors border border-primary-500/20"
                                            >
                                                Bookings
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm transition-colors border border-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative z-10 w-full max-w-2xl bg-dark-bg border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Event Title</label>
                                <input name="title" className="w-full bg-dark-surface border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" onChange={handleChange} value={formData.title} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Category</label>
                                <input name="category" className="w-full bg-dark-surface border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" onChange={handleChange} value={formData.category} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Date & Time</label>
                                <input name="date_time" type="datetime-local" className="w-full bg-dark-surface border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" onChange={handleChange} value={formData.date_time} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Venue</label>
                                <input name="venue" className="w-full bg-dark-surface border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" onChange={handleChange} value={formData.venue} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Total Seats</label>
                                <input name="total_seats" type="number" className="w-full bg-dark-surface border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" onChange={handleChange} value={formData.total_seats} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Price (PKR)</label>
                                <input name="price" type="number" step="0.01" className="w-full bg-dark-surface border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" onChange={handleChange} value={formData.price} required />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm text-gray-400">Description</label>
                                <textarea name="description" rows="4" className="w-full bg-dark-surface border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" onChange={handleChange} value={formData.description} required />
                            </div>

                            <div className="md:col-span-2 flex justify-end space-x-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-dark-surface">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Bookings Modal */}
            {showBookingsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBookingsModal(false)}></div>
                    <div className="relative z-10 w-full max-w-3xl bg-dark-bg border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Event Bookings</h2>
                                <p className="text-gray-400 text-sm mt-1">For: <span className="text-primary-400">{selectedEventTitle}</span></p>
                            </div>
                            <button onClick={() => setShowBookingsModal(false)} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {selectedEventBookings.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No bookings found for this event yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-dark-surface/50 text-left">
                                            <th className="py-3 px-4 text-gray-400 font-medium text-sm uppercase">Customer Name</th>
                                            <th className="py-3 px-4 text-gray-400 font-medium text-sm uppercase">Email</th>
                                            <th className="py-3 px-4 text-gray-400 font-medium text-sm uppercase text-center">Tickets</th>
                                            <th className="py-3 px-4 text-gray-400 font-medium text-sm uppercase">Booking Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {selectedEventBookings.map(booking => (
                                            <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-3 px-4 text-white font-medium">{booking.user_name}</td>
                                                <td className="py-3 px-4 text-gray-300">{booking.user_email}</td>
                                                <td className="py-3 px-4 text-white text-center font-bold">{booking.seats_booked}</td>
                                                <td className="py-3 px-4 text-gray-400 text-sm">{new Date(booking.booking_time).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setShowBookingsModal(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;
