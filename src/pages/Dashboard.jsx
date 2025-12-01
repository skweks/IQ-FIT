import { useState } from 'react';
import { Dumbbell, Home, Sparkles, Info, Mail, User, LogOut, Menu, X, Brain, UtensilsCrossed, ArrowRight, Crown } from 'lucide-react';
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
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  // Default to zero for new users
  const workouts = stats?.workouts || 0;
  const studySessions = stats?.studySessions || 0;
  const recipesTried = stats?.recipesTried || 0;
  
  // --- ACTIVE ROUTINE CHECK ---
  const activeRoute = window.location.pathname.substring(1);
  let activeActivity = null;
  let activeTitle = null;
  let activePath = null;

  if (activeRoute === 'workouts') {
      activeActivity = <Dumbbell className="w-8 h-8" />;
      activeTitle = "Workout Routine";
      activePath = "/workouts";
  } else if (activeRoute === 'study-tips') {
      activeActivity = <Brain className="w-8 h-8" />;
      activeTitle = "Study Session";
      activePath = "/study-tips";
  } else if (activeRoute === 'recipes') {
      activeActivity = <UtensilsCrossed className="w-8 h-8" />;
      activeTitle = "Recipe Cookthrough";
      activePath = "/recipes";
  }

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
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-5 text-white flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold mb-3">
                      {getInitials(user?.fullName || 'User')}
                    </div>
                    <h3 className="font-semibold text-lg text-center">{user?.fullName}</h3>
                    <p className="text-blue-100 text-sm text-center mb-3">{user?.email}</p>
                    
                    {/* NEW: Plan Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${
                        user?.isPremium 
                        ? 'bg-amber-400 text-amber-950' 
                        : 'bg-white/20 text-white border border-white/30'
                    }`}>
                        {user?.isPremium ? (
                            <>
                                <Crown className="w-3 h-3 fill-current" />
                                PREMIUM MEMBER
                            </>
                        ) : (
                            "FREE PLAN"
                        )}
                    </div>
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
                      <Brain className="w-5 h-5 text-slate-500" />
                      <span className="font-medium">Study Tips</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/recipes');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                    >
                      <UtensilsCrossed className="w-5 h-5 text-slate-500" />
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
          
          {/* Active Routine Card */}
          {activePath && (
              <div className="max-w-5xl mx-auto mb-12">
                  <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-100 rounded-lg text-red-600">
                              {activeActivity}
                          </div>
                          <div>
                              <p className="text-lg font-semibold text-slate-900">Activity in Progress</p>
                              <p className="text-sm text-slate-600">You are currently in the middle of a {activeTitle}.</p>
                          </div>
                      </div>
                      <button 
                          onClick={() => navigate(activePath)}
                          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                          Resume <ArrowRight className="w-4 h-4"/>
                      </button>
                  </div>
              </div>
          )}
          {/* End Active Routine Card */}
          
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
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Study Tips</h3>
              <p className="text-slate-600">Enhance your learning with proven techniques</p>
            </button>
            <button
              onClick={() => navigate('/recipes')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-8 h-8 text-white" />
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
              <p className="text-sm text-slate-600 mt-2">Total tracked completions</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-2xl">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Study Sessions</h3>
              <p className="text-4xl font-bold text-cyan-600">{studySessions}</p>
              <p className="text-sm text-slate-600 mt-2">Total tracked completions</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Recipes Tried</h3>
              <p className="text-4xl font-bold text-green-600">{recipesTried}</p>
              <p className="text-sm text-slate-600 mt-2">Total tracked completions</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase">Our Mission</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Balance Your Body and Mind with IQ-FIT</h2>
            <p className="text-slate-600 mb-6">
              IQ-FIT is a holistic web application built by a 3-member development team to help users cultivate <b>balanced habits</b>. We believe true progress comes from nurturing both your physical strength (workouts, nutrition) and intellectual acuity (study tips, productivity).
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Key Technologies</h3>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-blue-200 text-blue-800 font-medium rounded-full">React (Frontend)</span>
              <span className="px-3 py-1 bg-cyan-200 text-cyan-800 font-medium rounded-full">Spring Boot (Backend)</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 font-medium rounded-full">MySQL / PostgreSQL</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">The Team</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Kent Rato</span> (Frontend)
              </li>
              <li className="flex items-center gap-3">
                <User className="w-5 h-5 text-cyan-500" />
                <span className="font-medium">John Lloyd Maluto</span> (Frontend / Backend) 
              </li>
              <li className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-500" />
                <span className="font-medium">Christian Jay Basinilio</span> (Backend) 
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">Get in Touch</h2>
          <p className="text-lg text-slate-600 mb-12 text-center">We'd love to hear your feedback, support requests, or partnership inquiries.</p>
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input type="text" id="name" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input type="email" id="email" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea id="message" rows="4" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..."></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Send Message
              </button>
            </form>
            <div className="mt-6 text-center border-t pt-6 border-slate-100">
              <p className="text-sm text-slate-500">Alternatively, you can email us directly at <span className="font-semibold text-blue-600">support@iq-fit.com</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} IQ-FIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}