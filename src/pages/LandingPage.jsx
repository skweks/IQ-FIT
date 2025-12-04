import { useState, useEffect } from 'react';
import { 
  Dumbbell, Book, UtensilsCrossed, Target, Brain, Heart, 
  User, Mail, ArrowRight, Check, Menu, X, Star, Zap, 
  Shield, Activity, ChevronRight, Phone, MapPin, Globe, Send, CheckCircle 
} from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export function LandingPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // New state for notification

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!formData.name || !formData.email || !formData.message) {
          alert("Please fill out all fields.");
          return;
      }

      setIsSending(true);

      try {
          const response = await fetch('http://localhost:8080/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          });

          if (response.ok) {
              setShowSuccess(true); // Show custom notification
              setFormData({ name: '', email: '', message: '' }); // Reset form
          } else {
              alert("Failed to send message. Please try again.");
          }
      } catch (error) {
          console.error("Error sending message:", error);
          alert("Network error.");
      } finally {
          setIsSending(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 relative">
      
      {/* --- SUCCESS NOTIFICATION TOAST --- */}
      {showSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-white border-l-4 border-green-500 shadow-2xl rounded-xl p-4 flex items-start gap-4 max-w-sm animate-in slide-in-from-right-10 duration-300">
            <div className="bg-green-100 p-2 rounded-full shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Message Sent Successfully!</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                    Thanks for reaching out, {formData.name || 'friend'}! Our team will get back to you shortly.
                </p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
            </button>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('home')}>
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                IQ-FIT
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'About', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full rounded-full"></span>
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-5 absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {['Home', 'Features', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 flex flex-col gap-3 px-4 border-t border-slate-100 mt-2">
                <button onClick={() => navigate('/login')} className="w-full py-3 text-center font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Log In</button>
                <button onClick={() => navigate('/register')} className="w-full py-3 text-center font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Sign Up Free</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-100/40 to-transparent rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-cyan-100/40 to-transparent rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <Zap className="w-3 h-3 fill-current" /> The #1 Holistic Fitness Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-tight drop-shadow-sm">
              Master Your Body.<br/>
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">Sharpen Your Mind.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              IQ-FIT combines professional workout routines, cognitive training strategies, and nutritional guidance into one seamless ecosystem designed for high performers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-blue-500/20"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
              >
                Explore Features
              </button>
            </div>
            
            {/* Social Proof Mockup */}
            <div className="pt-8 border-t border-slate-200/60 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-300">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm overflow-hidden">
                        <User className="w-5 h-5 text-slate-400" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">+2k</div>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex flex-col items-start">
                    <div className="flex text-amber-400 gap-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-sm font-semibold text-slate-600">Trusted by 2,000+ members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
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
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full opacity-20 blur-[120px] -mr-40 -mt-40 animate-pulse duration-[4s]"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500 rounded-full opacity-20 blur-[120px] -ml-40 -mb-40"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-blue-300 text-xs font-bold uppercase tracking-wide mb-6 border border-white/10 backdrop-blur-md">
                <Shield className="w-3 h-3" /> Our Mission
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Built by Developers,<br/> For High Performers.
              </h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
                IQ-FIT was born from a simple idea: Physical strength and mental acuity are not separate. They are multipliers of each other.
              </p>
              <div className="flex flex-wrap gap-3">
                {['React 18', 'Spring Boot', 'MySQL', 'Tailwind'].map(tech => (
                  <span key={tech} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              {[
                { name: 'Kent Rato', role: 'Frontend Engineer', color: 'bg-blue-500', icon: Activity },
                { name: 'John Lloyd Maluto', role: 'Full Stack Developer', color: 'bg-cyan-500', icon: Zap },
                { name: 'Christian Jay Basinilio', role: 'Backend Architect', color: 'bg-emerald-500', icon: Shield },
              ].map((dev) => (
                <div key={dev.name} className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 backdrop-blur-sm group cursor-default">
                  <div className={`w-14 h-14 rounded-2xl ${dev.color} flex items-center justify-center font-bold text-lg shadow-lg text-white group-hover:scale-110 transition-transform duration-300`}>
                    {dev.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg mb-1">{dev.name}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wide font-bold">{dev.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Get In Touch</h2>
                <p className="text-slate-500 text-lg">Have questions? We're here to help you on your journey.</p>
            </div>
            
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
                <form className="space-y-6" onSubmit={handleSendMessage}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Name</label>
                            <input 
                                type="text" 
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email</label>
                            <input 
                                type="email" 
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                                placeholder="john@example.com" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Message</label>
                        <textarea 
                            rows="4" 
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none font-medium" 
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
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