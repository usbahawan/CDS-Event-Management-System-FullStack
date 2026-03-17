import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/OrganizerDashboard';
import UserDashboard from './pages/UserDashboard';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-bg text-gray-100 font-sans selection:bg-primary-500 selection:text-white">
          <Navbar />
          <div className="pt-24 px-4 md:px-8 pb-20 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/events/:id" element={<EventDetails />} />
            </Routes>
          </div>
          <footer className="bg-dark-surface text-gray-400 text-center py-6 border-t border-white/5">
            <p>&copy; 2025 CDS Event Management System. Created with &hearts; by Muhammad Huzaifa.</p>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
