import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, FileText, Save, Calendar, Users, Crown, Camera, Scale, Ruler, Lock, Trophy, Activity, UtensilsCrossed, Brain, Info, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export function UserProfile() {
  const { user, updateProfile, stats } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'physical', 'security'
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

  // Stats from Context
  const totalWorkouts = stats?.workouts || 0;
  const totalStudy = stats?.studySessions || 0;
  const totalRecipes = stats?.recipesTried || 0;

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setDateOfBirth(user.dateOfBirth || '');
      setGender(user.gender || '');
      setWeight(user.weight || '');
      setHeight(user.height || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName || !email) {
      alert('Full Name and Email are required.');
      return;
    }

    // Password Validation (only if trying to change)
    if (activeTab === 'security') {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (newPassword.length < 6) {
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
      // Only send password if it was changed
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

  // --- BMI CALCULATOR LOGIC ---
  const calculateBMI = () => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return parseFloat(bmi);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (bmi >= 18.5 && bmi < 24.9) return { label: 'Healthy Weight', color: 'text-green-600 bg-green-50 border-green-200' };
    if (bmi >= 25 && bmi < 29.9) return { label: 'Overweight', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { label: 'Obese', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const bmiValue = calculateBMI();
  const bmiData = getBMICategory(bmiValue);
  const hasPhysicalData = weight && height && dateOfBirth;

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-slate-900 text-white pb-32 pt-10 px-6 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-24 -left-24 w-72 h-72 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 font-medium bg-white/10 px-4 py-2 rounded-full w-fit backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row items-end gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 p-1 shadow-2xl">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-white border-4 border-slate-900">
                            {getInitials(user?.fullName)}
                        </div>
                    </div>
                    <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-500 transition-colors border-2 border-slate-900">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 mb-2">
                    <h1 className="text-4xl font-bold text-white mb-2">{user?.fullName}</h1>
                    <div className="flex flex-wrap gap-3 text-sm">
                         <span className="text-slate-300 flex items-center gap-1.5 bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">
                            <Mail className="w-3 h-3" /> {user?.email}
                         </span>
                         {user?.isPremium ? (
                            <span className="text-amber-300 flex items-center gap-1.5 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/30 font-bold">
                                <Crown className="w-3 h-3 fill-current" /> Premium Member
                            </span>
                         ) : (
                            <span className="text-slate-300 flex items-center gap-1.5 bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">
                                Free Plan
                            </span>
                         )}
                    </div>
                </div>
                <div className="flex gap-3 mb-2">
                     {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                            Edit Profile
                        </button>
                     ) : (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={isLoading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg flex items-center gap-2">
                                {isLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </>
                     )}
                </div>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Col: Stats & Menu */}
            <div className="space-y-6">
                {/* Lifetime Stats Card */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Lifetime Activity
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Trophy className="w-5 h-5" /></div>
                                <span className="font-semibold text-slate-700">Workouts</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">{totalWorkouts}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-violet-100 p-2 rounded-lg text-violet-600"><Brain className="w-5 h-5" /></div>
                                <span className="font-semibold text-slate-700">Study</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">{totalStudy}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><UtensilsCrossed className="w-5 h-5" /></div>
                                <span className="font-semibold text-slate-700">Recipes</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">{totalRecipes}</span>
                        </div>
                    </div>
                </div>

                {/* Menu Tabs */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <button 
                        onClick={() => setActiveTab('personal')}
                        className={`w-full flex items-center gap-3 p-4 font-semibold transition-colors ${activeTab === 'personal' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <User className="w-5 h-5" /> Personal Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('physical')}
                        className={`w-full flex items-center gap-3 p-4 font-semibold transition-colors ${activeTab === 'physical' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Activity className="w-5 h-5" /> Physical Stats
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 p-4 font-semibold transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Lock className="w-5 h-5" /> Security
                    </button>
                </div>
            </div>

            {/* Right Col: Forms */}
            <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[500px]">
                    
                    {/* PERSONAL TAB */}
                    {activeTab === 'personal' && (
                        <div className="animate-fade-in space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Personal Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                    {isEditing ? (
                                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    ) : (
                                        <p className="text-lg font-medium text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-100">{user?.fullName}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Email</label>
                                    {isEditing ? (
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    ) : (
                                        <p className="text-lg font-medium text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-100">{user?.email}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Date of Birth</label>
                                    {isEditing ? (
                                        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    ) : (
                                        <p className="text-lg font-medium text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-100">{user?.dateOfBirth || 'Not Set'}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                                    {isEditing ? (
                                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="text-lg font-medium text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-100">{user?.gender || 'Not Set'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Bio</label>
                                {isEditing ? (
                                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                ) : (
                                    <p className="text-lg font-medium text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-100 min-h-[100px]">{user?.bio || 'No bio added.'}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PHYSICAL TAB */}
                    {activeTab === 'physical' && (
                        <div className="animate-fade-in space-y-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Physical Statistics</h2>
                            
                            {/* BMI Section */}
                            <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-600" /> Your BMI Analysis
                                </h3>
                                
                                {hasPhysicalData ? (
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Your Body Mass Index</p>
                                            <p className="text-4xl font-black text-slate-900">{bmiValue}</p>
                                        </div>
                                        <div className={`px-5 py-3 rounded-xl border ${bmiData?.color} flex flex-col items-center`}>
                                            <span className="text-xs font-bold uppercase tracking-wide opacity-80">Category</span>
                                            <span className="text-lg font-bold">{bmiData?.label}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                                        <Info className="w-6 h-6 shrink-0" />
                                        <p className="text-sm font-medium">
                                            Please add your <b>Age (Date of Birth)</b>, <b>Weight</b>, and <b>Height</b> below to unlock your automated BMI analysis.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><Scale className="w-24 h-24 text-blue-600" /></div>
                                    <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mb-4 relative z-10">
                                        <Scale className="w-6 h-6" />
                                    </div>
                                    <label className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2 relative z-10">Weight (kg)</label>
                                    {isEditing ? (
                                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-24 text-center px-2 py-2 rounded-lg border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold relative z-10" placeholder="0" />
                                    ) : (
                                        <p className="text-4xl font-black text-blue-900 relative z-10">{user?.weight || '--'}<span className="text-lg font-medium text-blue-500 ml-1">kg</span></p>
                                    )}
                                </div>
                                <div className="p-6 bg-cyan-50 rounded-2xl border border-cyan-100 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><Ruler className="w-24 h-24 text-cyan-600" /></div>
                                    <div className="w-12 h-12 bg-cyan-200 text-cyan-700 rounded-full flex items-center justify-center mb-4 relative z-10">
                                        <Ruler className="w-6 h-6" />
                                    </div>
                                    <label className="text-sm font-bold text-cyan-800 uppercase tracking-wide mb-2 relative z-10">Height (cm)</label>
                                    {isEditing ? (
                                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-24 text-center px-2 py-2 rounded-lg border border-cyan-200 outline-none focus:ring-2 focus:ring-cyan-500 text-xl font-bold relative z-10" placeholder="0" />
                                    ) : (
                                        <p className="text-4xl font-black text-cyan-900 relative z-10">{user?.height || '--'}<span className="text-lg font-medium text-cyan-500 ml-1">cm</span></p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="animate-fade-in space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Security Settings</h2>
                            {!isEditing ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 mb-4">To change your password, click <b>Edit Profile</b> above.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 max-w-md mx-auto">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)} 
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-12" 
                                                placeholder="••••••••" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Confirm Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                value={confirmPassword} 
                                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-12" 
                                                placeholder="••••••••" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3">
                                        <Info className="w-5 h-5 text-yellow-600 shrink-0" />
                                        <p className="text-sm text-yellow-800">Leave these fields blank if you don't want to change your password.</p>
                                    </div>
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