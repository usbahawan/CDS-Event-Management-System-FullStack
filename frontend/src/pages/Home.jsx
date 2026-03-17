import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_bg.png';
import event1 from '../assets/event_1.png';
import event2 from '../assets/event_2.png';
import event3 from '../assets/event_3.png';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const eventImages = [event1, event2, event3];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('/api/events/');
                setEvents(res.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="-mt-4">
            {/* Hero Section */}
            <div className="relative min-h-[500px] h-[60vh] md:h-[70vh] max-h-[700px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0">
                    <img src={heroBg} alt="Concert" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-90"></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 animate-slide-up leading-tight">
                        Experience the <span className="gradient-text">Extraordinary</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl animate-fade-in delay-100">
                        Discover and book the most exclusive events, concerts, and conferences in your city using our premium platform.
                    </p>

                    <div className="w-full max-w-lg relative animate-fade-in delay-200 group">
                        <input
                            type="text"
                            placeholder="Search events, categories, or venues..."
                            className="w-full py-4 px-6 md:px-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-lg text-sm md:text-base group-hover:bg-white/15"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-4 mb-20">
                <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Upcoming Events</h2>
                    <span className="text-gray-400 text-sm md:text-base">{filteredEvents.length} events found</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 rounded-2xl bg-dark-surface animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {filteredEvents.map((event, index) => (
                            <div key={event.id} className="group relative rounded-2xl overflow-hidden glass hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                                <div className="h-48 md:h-56 relative overflow-hidden flex-shrink-0">
                                    <img
                                        src={eventImages[index % eventImages.length]}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <span className="text-[10px] md:text-xs font-bold text-primary-300 uppercase tracking-widest">{event.category}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark-surface to-transparent"></div>
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">{event.title}</h3>
                                        <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                            <span className="text-xl md:text-2xl font-bold text-white">PKR {event.price}</span>
                                            <span className="text-[10px] text-gray-500 uppercase">/ ticket</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">{event.description}</p>

                                    <div className="flex flex-col space-y-2 text-sm text-gray-400 mb-6">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate">{new Date(event.date_time).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/events/${event.id}`}
                                        className="block w-full text-center py-2.5 rounded-lg bg-white/5 hover:bg-primary-600 border border-white/10 hover:border-transparent text-white text-sm font-semibold transition-all duration-300 mt-auto"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
