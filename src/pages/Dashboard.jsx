import { useState, useEffect } from 'react';
import { 
  Dumbbell, Home, Sparkles, Info, Mail, User, LogOut, Menu, X, Brain, 
  UtensilsCrossed, ArrowRight, Crown, Trophy, Calendar, Activity, 
  ChevronRight, Zap, TrendingUp, Award, Heart, Code, Database, Server, 
  Send, CheckCircle, Globe, Phone, Shield, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export function Dashboard() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- DB STATS STATE ---
  const [dbStats, setDbStats] = useState({ workouts: 0, studySessions: 0, recipesTried: 0 });

  // --- CONTACT FORM STATE ---
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Pre-fill form & Fetch Stats
  useEffect(() => {
    if (user) {
        setContactForm(prev => ({
            ...prev,
            name: user.fullName || '',
            email: user.email || ''
        }));

        // FETCH REAL LIFETIME STATS FROM DATABASE
        // Ensure user.id exists before fetching to avoid errors
        if (user.id) {
            fetch(`http://localhost:8080/api/users/${user.id}/stats`)
                .then(res => res.json())
                .then(data => setDbStats(data))
                .catch(err => console.error("Failed to load stats", err));
        }
    }
  }, [user]);

  // Auto-hide notification
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!contactForm.message) {
          alert("Please enter a message.");
          return;
      }

      setIsSending(true);

      try {
          const response = await fetch('http://localhost:8080/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(contactForm)
          });

          if (response.ok) {
              setShowSuccess(true);
              setContactForm(prev => ({ ...prev, message: '' })); 
          } else {
              alert("Failed to send message.");
          }
      } catch (error) {
          console.error("Error sending message:", error);
          alert("Network error.");
      } finally {
          setIsSending(false);
      }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsProfileMenuOpen(false); // Close mobile menu if open
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };
  
  // --- ACTIVE ROUTINE CHECK ---
  const activeRoute = window.location.pathname.substring(1);
  let activeActivity = null;
  let activeTitle = null;
  let activePath = null;
  let activeColor = "";

  if (activeRoute === 'workouts') {
      activeActivity = <Dumbbell className="w-6 h-6 text-white" />;
      activeTitle = "Workout Routine";
      activePath = "/workouts";
      activeColor = "bg-gradient-to-r from-blue-500 to-cyan-500";
  } else if (activeRoute === 'study-tips') {
      activeActivity = <Brain className="w-6 h-6 text-white" />;
      activeTitle = "Study Session";
      activePath = "/study-tips";
      activeColor = "bg-gradient-to-r from-violet-500 to-purple-500";
  } else if (activeRoute === 'recipes') {
      activeActivity = <UtensilsCrossed className="w-6 h-6 text-white" />;
      activeTitle = "Recipe Cookthrough";
      activePath = "/recipes";
      activeColor = "bg-gradient-to-r from-orange-500 to-amber-500";
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 relative">
      
      {/* --- SUCCESS NOTIFICATION TOAST --- */}
      {showSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-white border-l-4 border-green-500 shadow-2xl rounded-xl p-4 flex items-start gap-4 max-w-sm animate-in slide-in-from-right-10 duration-300">
            <div className="bg-green-100 p-2 rounded-full shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Message Sent!</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                    We've received your message, {user?.fullName?.split(' ')[0]}. The team will review it shortly.
                </p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
            </button>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg z-50 border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                IQ-FIT
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Home', icon: Home },
                { name: 'Features', icon: Sparkles },
                { name: 'About', icon: Info },
                { name: 'Contact', icon: Mail }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.name.toLowerCase())}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors relative group"
                >
                  <item.icon className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full rounded-full"></span>
                </button>
              ))}
            </div>

            {/* Profile / Mobile Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {getInitials(user?.fullName)}
                </div>
                <div className="hidden sm:block text-left">
                   <p className="text-xs font-bold text-slate-700 leading-none mb-0.5">{user?.fullName?.split(' ')[0]}</p>
                   <p className="text-[10px] text-slate-400 font-medium leading-none">Account</p>
                </div>
                {isProfileMenuOpen ? <X className="w-4 h-4 text-slate-400" /> : <Menu className="w-4 h-4 text-slate-400" />}
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right z-50">
                  <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-1 shadow-xl mb-3">
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-white">
                                {getInitials(user?.fullName)}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg">{user?.fullName}</h3>
                        <p className="text-slate-400 text-xs mb-4">{user?.email}</p>
                        
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border ${user?.isPremium ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-700 border-slate-600 text-slate-300'}`}>
                            {user?.isPremium ? <><Crown className="w-3 h-3 fill-current" /> Premium Member</> : "Free Plan"}
                        </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    {[
                        { label: 'User Profile', icon: User, path: '/profile', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Workout Routine', icon: Dumbbell, path: '/workouts', color: 'text-cyan-600', bg: 'bg-cyan-50' },
                        { label: 'Study Tips', icon: Brain, path: '/study-tips', color: 'text-violet-600', bg: 'bg-violet-50' },
                        { label: 'Food Recipes', icon: UtensilsCrossed, path: '/recipes', color: 'text-orange-600', bg: 'bg-orange-50' },
                        ...(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? [
                          { label: 'Admin Panel', icon: Crown, path: '/admin', color: 'text-amber-600', bg: 'bg-amber-50' }
                        ] : [])
                    ].map((item) => (
                        <button 
                            key={item.path}
                            onClick={() => { setIsProfileMenuOpen(false); navigate(item.path); }} 
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium group"
                        >
                            <div className={`p-2 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <span className="group-hover:text-slate-900 transition-colors">{item.label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-500" />
                        </button>
                    ))}
                    
                    <div className="h-px bg-slate-100 my-2 mx-4"></div>
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium group">
                      <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4 shadow-sm">
            <Zap className="w-3 h-3 fill-current" /> Your Daily Progress Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0]}</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Track your fitness, sharpen your mind, and fuel your body. Your personalized holistic journey continues here.
          </p>
        </div>

        {/* --- ADMIN DASHBOARD LINK (VISIBLE ONLY TO ADMINS) --- */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <div className="max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="bg-white p-4 rounded-3xl shadow-xl shadow-red-900/5 border border-red-200 hover:shadow-2xl transition-shadow">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-red-600 text-white">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Administrator Access</h3>
                                <p className="text-slate-500 text-sm">You are logged in as an Admin. Click here to manage users and content.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/admin')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600"
                        >
                            Admin Panel <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Active Session Card */}   
        {activePath && (
            <div className="max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="bg-white p-1 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 hover:shadow-2xl transition-shadow">
                    <div className="bg-slate-50 rounded-[20px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${activeColor} text-white`}>
                                {activeActivity}
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                                    <h3 className="text-lg font-bold text-slate-900">Session in Progress</h3>
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm">You have an unfinished <span className="font-semibold text-slate-700">{activeTitle}</span>.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(activePath)}
                            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 ${activeColor}`}
                        >
                            Resume Session <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {[
                { 
                    title: 'Workout Routines', 
                    desc: 'Strength & Cardio plans for all levels.', 
                    icon: Dumbbell, 
                    color: 'text-blue-600', 
                    bg: 'bg-blue-50', 
                    border: 'hover:border-blue-200',
                    path: '/workouts',
                    gradient: 'from-blue-500 to-cyan-500'
                },
                { 
                    title: 'Study Tips', 
                    desc: 'Techniques to boost focus & memory.', 
                    icon: Brain, 
                    color: 'text-violet-600', 
                    bg: 'bg-violet-50', 
                    border: 'hover:border-violet-200',
                    path: '/study-tips',
                    gradient: 'from-violet-500 to-purple-500'
                },
                { 
                    title: 'Healthy Recipes', 
                    desc: 'Nutritious meals to fuel your day.', 
                    icon: UtensilsCrossed, 
                    color: 'text-orange-600', 
                    bg: 'bg-orange-50', 
                    border: 'hover:border-orange-200',
                    path: '/recipes',
                    gradient: 'from-orange-500 to-amber-500'
                },
                ...((user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? [{
                    title: 'Admin Panel',
                    desc: 'Manage users, content, payments, and messages.',
                    icon: Crown,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    border: 'hover:border-amber-200',
                    path: '/admin',
                    gradient: 'from-amber-500 to-yellow-500'
                }] : [])
            ].map((card) => (
                <button 
                    key={card.title}
                    onClick={() => navigate(card.path)}
                    className={`relative bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${card.border} group overflow-hidden`}
                >
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} -mr-10 -mt-10 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className={`w-7 h-7 ${card.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{card.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed relative z-10 pr-4">{card.desc}</p>
                    <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-800 transition-colors relative z-10">
                        Explore <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </button>
            ))}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section id="features" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center mb-16">
             <div className="p-3 bg-blue-50 rounded-2xl mb-4 text-blue-600">
                <Activity className="w-8 h-8" />
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center">Your Lifetime Stats</h2>
             <p className="text-slate-500 mt-4 text-center max-w-lg">Tracking your consistency since Day 1. Every session counts towards your goal.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
                { label: 'Total Workouts', value: dbStats.workouts, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Trophy, sub: 'Sessions Crushed' },
                { label: 'Study Sessions', value: dbStats.studySessions, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', icon: Brain, sub: 'Focus Hours' },
                { label: 'Recipes Cooked', value: dbStats.recipesTried, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: UtensilsCrossed, sub: 'Healthy Meals' },
            ].map((stat, idx) => (
                <div key={idx} className={`flex flex-col items-center p-8 ${stat.bg} rounded-3xl border ${stat.border} relative overflow-hidden group hover:shadow-md transition-shadow`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <stat.icon className={`w-32 h-32 ${stat.color}`} />
                    </div>
                    <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm relative z-10">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <p className={`text-5xl font-black ${stat.color} mb-2 tracking-tight relative z-10`}>{stat.value}</p>
                    <p className="text-lg font-bold text-slate-800 relative z-10">{stat.label}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1 relative z-10">{stat.sub}</p>
                </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-full text-slate-500 text-xs font-bold uppercase tracking-wide">
                <Calendar className="w-3 h-3" />
                Stats synchronized with secure database
             </div>
          </div>
        </div>
      </section>
       <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">We don't just track reps. We help you build a lifestyle that balances physical power with mental clarity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-slate-50 rounded-[2.5rem] p-8 hover:bg-blue-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-blue-100/50 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">Smart Workouts</h3>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Access a library of routines from HIIT to Yoga. Track sets, reps, and rest times with our interactive player.
                </p>
                <ul className="space-y-3">
                  {['Beginner to Advanced', 'Video Guides', 'Progress Tracking'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Check className="w-3 h-3" /></div> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group relative bg-slate-50 rounded-[2.5rem] p-8 hover:bg-cyan-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-cyan-100/50 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-8 text-cyan-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors">Cognitive Performance</h3>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Sharpen your focus with study techniques like Pomodoro. A healthy body needs a sharp mind.
                </p>
                <ul className="space-y-3">
                  {['Focus Timers', 'Memory Hacks', 'Productivity Tips'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600"><Check className="w-3 h-3" /></div> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group relative bg-slate-50 rounded-[2.5rem] p-8 hover:bg-emerald-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-emerald-100/50 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-8 text-emerald-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">Nutritional Fuel</h3>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Discover simple, high-protein recipes designed to fuel your workouts and recovery.
                </p>
                <ul className="space-y-3">
                  {['Macro-friendly', 'Quick Prep', 'Shopping Lists'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Check className="w-3 h-3" /></div> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
                    <TrendingUp className="w-4 h-4" /> Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">Balance Your Body and Mind with IQ-FIT</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                We believe that true health is a balance of body and mind. IQ-FIT was built by a dedicated team to help you nurture physical strength while sharpening your intellectual acuity.
                </p>
            </div>
            
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Award className="w-4 h-4" /> Powered By</h3>
                <div className="flex flex-wrap gap-3">
                    {[
                        { name: 'React 18', icon: Code },
                        { name: 'Spring Boot', icon: Server },
                        { name: 'MySQL', icon: Database },
                        { name: 'Tailwind CSS', icon: Zap }
                    ].map(tech => (
                        <span key={tech.name} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 shadow-sm hover:border-blue-200 transition-colors">
                            <tech.icon className="w-3 h-3 text-slate-400" /> {tech.name}
                        </span>
                    ))}
                </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full opacity-20 blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full opacity-10 blur-3xl -ml-20 -mb-20"></div>
            
            <h3 className="text-2xl font-bold mb-8 relative z-10 flex items-center gap-3">
                <Heart className="w-6 h-6 text-red-500 fill-current" /> Meet The Team
            </h3>
            <div className="space-y-4 relative z-10">
                {[
                    { name: 'Kent Rato', role: 'Frontend Engineer', color: 'bg-blue-500' },
                    { name: 'John Lloyd Maluto', role: 'Full Stack Developer', color: 'bg-cyan-500' },
                    { name: 'Christian Jay Basinilio', role: 'Backend Architect', color: 'bg-emerald-500' },
                ].map((dev) => (
                    <div key={dev.name} className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/5 backdrop-blur-sm">
                        <div className={`w-12 h-12 rounded-full ${dev.color} flex items-center justify-center font-bold text-sm shadow-lg text-white`}>
                            {dev.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-lg">{dev.name}</p>
                            <p className="text-slate-300 text-xs uppercase tracking-wide font-medium">{dev.role}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-slate-500 mb-12">Have questions or suggestions? We'd love to hear from you.</p>
          
          <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 text-left">
            <form className="space-y-6" onSubmit={handleSendMessage}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Name</label>
                    <input 
                        type="text" 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email</label>
                    <input 
                        type="email" 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                        placeholder="john@example.com" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Message</label>
                <textarea 
                    rows="4" 
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none font-medium" 
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                  type="submit" 
                  disabled={isSending}
                  className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                  {isSending ? 'Sending...' : <><Send className="w-5 h-5" /> Send Message</>}
              </button>
            </form>
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-500">Or email us directly at <a href="mailto:support@iq-fit.com" className="text-blue-600 font-bold hover:underline">support@iq-fit.com</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-100">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">IQ-FIT</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} IQ-FIT Team. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <div className="flex gap-3 border-l border-slate-200 pl-6">
                 <Globe className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
                 <Mail className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
                 <Phone className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
