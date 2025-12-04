import { useState } from 'react';
import { Dumbbell, Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
          const userData = await response.json();
          
          localStorage.setItem('iqfit_user', JSON.stringify(userData));
          
          if (!localStorage.getItem('iqfit_stats')) {
             localStorage.setItem('iqfit_stats', JSON.stringify({
                workouts: 0,
                studySessions: 0,
                recipesTried: 0
             }));
          }

          if (userData.role === 'ADMIN') {
              window.location.href = '/admin';
          } else {
              window.location.href = '/dashboard';
          }

      } else {
          setError('Invalid email or password');
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError('Network error. Check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* --- Left Side: Branding / Visuals (Hidden on mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 text-center px-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-900/50">
                <Dumbbell className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Welcome Back!</h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                "Success starts with self-discipline." <br/> Continue building the best version of yourself today.
            </p>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <button 
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 lg:left-auto lg:right-12 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
        >
            <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="w-full max-w-md mx-auto">
            <div className="text-center lg:text-left mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Log In</h2>
                <p className="text-slate-500">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-sm font-bold text-slate-700">Password</label>
                        <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>Sign In <LogIn className="w-5 h-5" /></>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-500">
                    Don't have an account yet?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                    >
                        Create Account
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}