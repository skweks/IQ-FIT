import { useState, useEffect } from 'react';
// Added CreditCard, AlertTriangle, and CheckCircle to imports
import { ArrowLeft, User, Mail, FileText, Save, Calendar, Users, Crown, Camera, Scale, Ruler, Lock, Trophy, Activity, UtensilsCrossed, Brain, Info, Eye, EyeOff, ChevronRight, ShieldCheck, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export function UserProfile() {
  const { user, updateProfile, stats } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'physical', 'security', 'subscription'
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [height, setHeight] = useState(user?.height || '');
  
  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- REAL DB STATS STATE ---
  const [dbStats, setDbStats] = useState({ workouts: 0, studySessions: 0, recipesTried: 0 });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setDateOfBirth(user.dateOfBirth || '');
      setGender(user.gender || '');
      setWeight(user.weight || '');
      setHeight(user.height || '');

      // FETCH REAL LIFETIME STATS FROM DATABASE
      fetch(`http://localhost:8080/api/users/${user.id}/stats`)
        .then(res => res.json())
        .then(data => setDbStats(data))
        .catch(err => console.error("Failed to load stats", err));
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName || !email) {
      alert('Full Name and Email are required.');
      return;
    }

    // Password Validation
    if (activeTab === 'security') {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (newPassword.length > 0 && newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
    }

    setIsLoading(true);

    const updatedData = {
      fullName,
      email,
      bio,
      dateOfBirth,
      gender,
      weight: parseFloat(weight),
      height: parseFloat(height),
      ...(newPassword ? { password: newPassword } : {})
    };

    try {
        const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const savedUser = await response.json();
            updateProfile(savedUser);
            alert("Profile updated successfully!");
            setIsEditing(false);
            setNewPassword('');
            setConfirmPassword('');
        } else {
            alert("Failed to update profile. Please try again.");
        }
    } catch (error) {
        console.error("Update Error:", error);
        alert("Network error. Is the backend running?");
    } finally {
        setIsLoading(false);
    }
  };

  // --- SUBSCRIPTION LOGIC ---
  const handleCancelSubscription = async () => {
      if(!window.confirm("Are you sure? You will lose access to Premium features immediately.")) return;
      
      setIsLoading(true);
      try {
          // Call the backend endpoint to update subscription status
          const response = await fetch(`http://localhost:8080/api/users/${user.id}/subscription?isPremium=false`, {
              method: 'PUT'
          });

          if (response.ok) {
              const updatedUser = await response.json();
              updateProfile(updatedUser); // Update local context
              alert("Subscription cancelled. You are now on the Free plan.");
          } else {
              alert("Failed to cancel subscription.");
          }
      } catch (error) {
          console.error(error);
          alert("Network error.");
      } finally {
          setIsLoading(false);
      }
  };

  // --- BMI CALCULATOR LOGIC ---
  const calculateBMI = () => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return parseFloat(bmi);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 bg-blue-50 border-blue-200 ring-blue-100' };
    if (bmi >= 18.5 && bmi < 24.9) return { label: 'Healthy Weight', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 ring-emerald-100' };
    if (bmi >= 25 && bmi < 29.9) return { label: 'Overweight', color: 'text-orange-600 bg-orange-50 border-orange-200 ring-orange-100' };
    return { label: 'Obese', color: 'text-red-600 bg-red-50 border-red-200 ring-red-100' };
  };

  const bmiValue = calculateBMI();
  const bmiData = getBMICategory(bmiValue);
  const hasPhysicalData = weight && height;

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  // --- REUSABLE COMPONENTS ---
  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-200 group ${
            activeTab === id 
            ? 'bg-slate-900 text-white shadow-lg ring-1 ring-slate-700' 
            : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${activeTab === id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
            {label}
        </div>
        {activeTab === id && <ChevronRight className="w-4 h-4 text-slate-500" />}
    </button>
  );

  // FIXED: Removed dynamic class construction to ensure Tailwind detects colors
  const StatBox = ({ label, value, icon: Icon, iconColor, bgColor }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
        <div className={`p-3 rounded-full ${bgColor} mb-3 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-slate-900 text-white pb-32 pt-8 px-6 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-24 -left-24 w-72 h-72 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 font-medium px-4 py-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row items-end gap-8">
                <div className="relative group">
                    <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-br from-blue-400 via-cyan-400 to-emerald-400 shadow-2xl">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-5xl font-black text-white border-4 border-slate-900 relative overflow-hidden">
                            {getInitials(user?.fullName)}
                        </div>
                    </div>
                    {/* Mock Profile Picture Edit Button */}
                    <button onClick={() => alert("Profile picture upload feature coming soon!")} className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-500 transition-all hover:scale-110 border-4 border-slate-900 cursor-pointer">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-sm">{user?.fullName}</h1>
                    <div className="flex flex-wrap gap-3 text-sm font-medium">
                         <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-1.5 rounded-full border border-white/10 text-slate-300 backdrop-blur-md">
                            <Mail className="w-4 h-4 text-blue-400" /> {user?.email}
                         </div>
                         {user?.isPremium ? (
                            <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-md animate-pulse">
                                <Crown className="w-4 h-4 fill-amber-400 text-amber-400" /> Premium Member
                            </div>
                         ) : (
                            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-1.5 rounded-full border border-white/10 text-slate-400 backdrop-blur-md">
                                Free Plan
                            </div>
                         )}
                    </div>
                </div>
                <div className="flex gap-3 mb-2">
                     {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                        >
                            Edit Profile
                        </button>
                     ) : (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">Cancel</button>
                            <button 
                                onClick={handleSave} 
                                // Add validation checks here:
                                disabled={isLoading || !weight || weight <= 0 || !height || height <= 0} 
                                className={`px-6 py-3 font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all ${
                                    // Optional: Change styling when disabled to look "grayed out"
                                    (isLoading || !weight || weight <= 0) 
                                        ? 'bg-slate-400 text-slate-200 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-500'
                                }`}>
                                {isLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </>
                     )}
                </div>
            </div>
        </div>
      </div>

      {/* --- LIFETIME STATS GRID --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* FIXED: Passed explicit Tailwind classes to avoid purge issues */}
            <StatBox 
                label="Total Workouts" 
                value={dbStats.workouts} 
                icon={Trophy} 
                iconColor="text-blue-600" 
                bgColor="bg-blue-50" 
            />
            <StatBox 
                label="Study Sessions" 
                value={dbStats.studySessions} 
                icon={Brain} 
                iconColor="text-violet-600" 
                bgColor="bg-violet-50" 
            />
            <StatBox 
                label="Recipes Tried" 
                value={dbStats.recipesTried} 
                icon={UtensilsCrossed} 
                iconColor="text-orange-600" 
                bgColor="bg-orange-50" 
            />
        </div>
      </div>

      {/* --- SETTINGS CONTENT --- */}
      <div className="max-w-6xl mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Nav */}
            <div className="lg:col-span-3 space-y-3">
                <TabButton id="personal" label="Personal Details" icon={User} />
                <TabButton id="physical" label="Physical Stats" icon={Activity} />
                <TabButton id="subscription" label="Subscription" icon={CreditCard} />
                <TabButton id="security" label="Security" icon={ShieldCheck} />
            </div>

            {/* Right Content */}
            <div className="lg:col-span-9">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[500px] relative">
                    
                    {/* PERSONAL */}
                    {activeTab === 'personal' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div><h2 className="text-2xl font-bold text-slate-900">Personal Information</h2><p className="text-slate-500 text-sm mt-1">Manage your identity details.</p></div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input label="Full Name" val={fullName} set={setFullName} edit={isEditing} icon={User} />
                                <Input label="Email Address" val={email} set={setEmail} edit={isEditing} icon={Mail} />
                                <Input label="Date of Birth" val={dateOfBirth} set={setDateOfBirth} edit={isEditing} type="date" icon={Calendar} />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 flex items-center gap-2"><Users className="w-3 h-3"/> Gender</label>
                                    <select disabled={!isEditing} value={gender} onChange={(e) => setGender(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all appearance-none ${isEditing ? 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500' : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'}`}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 flex items-center gap-2"><FileText className="w-3 h-3"/> Bio</label>
                                <textarea disabled={!isEditing} value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={`w-full px-4 py-3 rounded-xl border outline-none resize-none transition-all ${isEditing ? 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500' : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'}`} placeholder={isEditing ? "Tell us about yourself..." : "No bio added yet."} />
                            </div>
                        </div>
                    )}

                    {/* PHYSICAL */}
                    {activeTab === 'physical' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div><h2 className="text-2xl font-bold text-slate-900">Physical Statistics</h2><p className="text-slate-500 text-sm mt-1">Track metrics for personalized insights.</p></div>
                            
                            <div className="bg-gradient-to-r from-slate-50 to-white p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> BMI Analysis</h3>
                                {bmiValue ? (
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
                                        <div><p className="text-sm text-slate-500 font-medium mb-1">Your Body Mass Index</p><p className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{bmiValue}</p></div>
                                        <div className={`px-6 py-3 rounded-2xl border-2 ${bmiData?.color} bg-white shadow-sm`}><span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-1">Category</span><span className="text-xl font-black">{bmiData?.label}</span></div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 p-5 bg-amber-50 text-amber-900 rounded-2xl border border-amber-100/50 relative z-10">
                                        <Info className="w-6 h-6 text-amber-600 shrink-0" />
                                        <p className="text-sm font-medium">Enter your <b>Weight</b> and <b>Height</b> below to unlock insights.</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                      <Input label="Weight (kg)" val={weight} set={setWeight} edit={isEditing} icon={Scale} type="number" placeholder="0" disabled={weight === 0} />
                                <Input label="Height (cm)" val={height} set={setHeight} edit={isEditing} icon={Ruler} type="number" placeholder="0" />
                            </div>
                        </div>
                    )}

                    {/* SUBSCRIPTION */}
                    {activeTab === 'subscription' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div><h2 className="text-2xl font-bold text-slate-900">Subscription Plan</h2><p className="text-slate-500 text-sm mt-1">Manage your membership tier.</p></div>
                            
                            {user?.isPremium ? (
                                <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-100 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-white text-amber-500 rounded-2xl shadow-sm"><Crown className="w-8 h-8 fill-current" /></div>
                                            <div><p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Current Plan</p><h3 className="text-2xl font-black text-slate-900">Premium Membership</h3></div>
                                        </div>
                                        <div className="space-y-3 mb-8 bg-white/50 p-6 rounded-2xl border border-amber-100/50">
                                            {['Unlimited Workouts', 'Advanced Stats', 'Priority Support'].map(f => (
                                                <div key={f} className="flex items-center gap-3 text-sm text-slate-700 font-medium"><CheckCircle className="w-4 h-4 text-green-500" /> {f}</div>
                                            ))}
                                        </div>
                                        <button onClick={handleCancelSubscription} disabled={isLoading} className="w-full py-4 bg-white border border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 hover:border-red-100 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                                            {isLoading ? 'Processing...' : <><AlertTriangle className="w-4 h-4" /> Cancel Subscription</>}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 relative overflow-hidden text-center">
                                    <div className="inline-block p-4 bg-slate-200 rounded-full mb-4"><User className="w-8 h-8 text-slate-500" /></div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Free Plan</h3>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">You are missing out on premium features. Upgrade now to unlock your full potential.</p>
                                    <button onClick={() => navigate('/plans')} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                                        <Crown className="w-5 h-5" /> Upgrade to Premium
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECURITY */}
                    {activeTab === 'security' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div><h2 className="text-2xl font-bold text-slate-900">Security Settings</h2><p className="text-slate-500 text-sm mt-1">Update your password and account security.</p></div>
                            {!isEditing ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                                    <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 border border-slate-100"><Lock className="w-8 h-8 text-slate-400" /></div>
                                    <p className="text-slate-500 font-medium mb-6">To change your password, enable editing mode.</p>
                                    <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Enable Editing</button>
                                </div>
                            ) : (
                                <div className="max-w-md space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)} 
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none pr-12 transition-all" 
                                                placeholder="••••••••" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                value={confirmPassword} 
                                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none pr-12 transition-all" 
                                                placeholder="••••••••" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100"><Info className="w-5 h-5 shrink-0 mt-0.5"/><p className="text-sm font-medium">Leave blank if you don't want to change password.</p></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, val, set, edit, icon: Icon, type="text", placeholder="", disabled }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 flex items-center gap-2">
            <Icon className="w-3 h-3"/> {label}
        </label>
        {edit ? (
            <input 
                type={type} 
                value={val} 
                onChange={(e) => set(e.target.value)}
                // 2. Pass it to the actual HTML input here vvv
                disabled={disabled}
                className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                placeholder={placeholder} 
            />
        ) : (
            <p className="text-lg font-medium text-slate-900 p-3.5 bg-slate-50 rounded-xl border border-slate-100/50">
                {val || <span className="text-slate-400 italic">Not set</span>}
            </p>
        )}
    </div>
);