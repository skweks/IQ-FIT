import { useState } from 'react';
import { Dumbbell, Home, Sparkles, Info, Mail, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export function Dashboard() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout, stats } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Default to zero for new users
  const workouts = stats?.workouts || 0;
  const studySessions = stats?.studySessions || 0;
  const recipesTried = stats?.recipesTried || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                IQ-FIT
              </span>
            </div>
            {/* Page links */}
            <div className="hidden md:flex gap-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Features
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact
              </button>
            </div>
            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex items-center justify-center hover:shadow-lg transition-all"
              >
                {isProfileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-5 text-white">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold mb-3 mx-auto">
                      {getInitials(user?.fullName || 'User')}
                    </div>
                    <h3 className="font-semibold text-lg text-center">{user?.fullName}</h3>
                    <p className="text-blue-100 text-sm text-center">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                    >
                      <User className="w-5 h-5 text-slate-500" />
                      <span className="font-medium">User Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/workouts');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                    >
                      <Dumbbell className="w-5 h-5 text-slate-500" />
                      <span className="font-medium">Workout Routine</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/study-tips');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                    >
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="font-medium">Study Tips</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/recipes');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                    >
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="font-medium">Food Recipes</span>
                    </button>
                    <div className="border-t border-slate-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
              Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0]}</span>
            </h1>
            <p className="text-xl text-slate-600">Ready to continue your transformation journey?</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <button
              onClick={() => navigate('/workouts')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Workout Routines</h3>
              <p className="text-slate-600">Track your fitness progress and discover new exercises</p>
            </button>
            <button
              onClick={() => navigate('/study-tips')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Study Tips</h3>
              <p className="text-slate-600">Enhance your learning with proven techniques</p>
            </button>
            <button
              onClick={() => navigate('/recipes')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Food Recipes</h3>
              <p className="text-slate-600">Discover healthy and delicious meal ideas</p>
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Your Progress Dashboard</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Workouts Completed</h3>
              <p className="text-4xl font-bold text-blue-600">{workouts}</p>
              <p className="text-sm text-slate-600 mt-2">This month</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-2xl">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Study Sessions</h3>
              <p className="text-4xl font-bold text-cyan-600">{studySessions}</p>
              <p className="text-sm text-slate-600 mt-2">This month</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Recipes Tried</h3>
              <p className="text-4xl font-bold text-green-600">{recipesTried}</p>
              <p className="text-sm text-slate-600 mt-2">This month</p>
            </div>
          </div>
        </div>
      </section>
      {/* About and Contact sections unchanged */}
      {/* ... (copy rest from previous for the About and Contact sections) ... */}
    </div>
  );
}
