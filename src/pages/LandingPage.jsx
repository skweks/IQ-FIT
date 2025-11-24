import { Dumbbell, Book, UtensilsCrossed, Target, Brain, Heart, User, Mail, Phone } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export function LandingPage() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

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
            <div className="hidden md:flex gap-8">
              <button onClick={() => scrollToSection('home')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('about')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Home Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6">
            Transform Your
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Mind & Body</span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Your all-in-one platform for workout routines, study tips, and healthy recipes.
            Achieve your fitness and intellectual goals with IQ-FIT.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Get Started Free
          </button>
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Workout Routines</h3>
              <p className="text-slate-600">
                Personalized exercise plans tailored to your fitness level and goals.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Study Tips</h3>
              <p className="text-slate-600">
                Proven strategies to enhance learning, memory, and academic performance.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Healthy Recipes</h3>
              <p className="text-slate-600">
                Nutritious and delicious meals to fuel your body and mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Core Features</h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">Everything you need to balance your intellectual and physical health.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Goal Tracking</h3>
              <p className="text-slate-600 text-sm">Monitor your activity log for workouts and study sessions.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-cyan-500">
              <Brain className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Productivity</h3>
              <p className="text-slate-600 text-sm">Access curated tips like the Pomodoro and Feynman techniques.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
              <Heart className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Nutrition</h3>
              <p className="text-slate-600 text-sm">Discover simple, healthy recipes to fuel your daily life.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
              <Dumbbell className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Custom Routines</h3>
              <p className="text-slate-600 text-sm">Find or create workout plans for any difficulty level.</p>
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
              IQ-FIT is a holistic web application built by a 3-member development team to help users cultivate  <b>balanced habits</b>. We believe true progress comes from nurturing both your physical strength (workouts, nutrition) and intellectual acuity (study tips, productivity).
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