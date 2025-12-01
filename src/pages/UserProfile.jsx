import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, FileText, Save, Calendar, Users, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export function UserProfile() {
  // 1. Added 'stats' here to fetch real data
  const { user, updateProfile, stats } = useAuth(); 
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.gender || '');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setDateOfBirth(user.dateOfBirth || '');
      setGender(user.gender || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName || !email) {
      alert('Full Name and Email are required.');
      return;
    }

    setIsLoading(true);

    const updatedData = {
      fullName,
      email,
      bio,
      dateOfBirth,
      gender
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

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold shrink-0 border-4 border-white/10">
                {getInitials(user?.fullName)}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">{user?.fullName}</h1> 
                <p className="text-blue-100 mb-3">{user?.email}</p>
                
                {/* STATUS BADGES */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${
                        user?.isPremium 
                        ? 'bg-amber-400 text-amber-950 border border-amber-300' 
                        : 'bg-slate-800/30 text-white border border-white/20'
                    }`}>
                        {user?.isPremium ? (
                            <> <Crown className="w-3 h-3 fill-current" /> PREMIUM MEMBER </>
                        ) : (
                            "FREE PLAN"
                        )}
                   </span>

                   {user?.role === 'ADMIN' && (
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold shadow-sm">Admin</span>
                   )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFullName(user.fullName || '');
                      setEmail(user.email || '');
                      setBio(user.bio || '');
                      setDateOfBirth(user.dateOfBirth || '');
                      setGender(user.gender || '');
                      setIsEditing(false);
                    }}
                    className="px-6 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200"
                  >
                    {isLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>
              )}
            </div>
            
            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" /> Full Name
                  </label>
                  {isEditing ? (
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  ) : (
                    <p className="text-lg text-slate-800 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">{user?.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" /> Email Address
                  </label>
                  {isEditing ? (
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  ) : (
                    <p className="text-lg text-slate-800 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">{user?.email}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" /> Date of Birth
                  </label>
                  {isEditing ? (
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  ) : (
                    <p className="text-lg text-slate-800 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">{user?.dateOfBirth || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" /> Gender
                  </label>
                  {isEditing ? (
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-lg text-slate-800 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">{user?.gender || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Bio
              </label>
              {isEditing ? (
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Tell us about yourself..." />
              ) : (
                <p className="text-lg text-slate-800 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 min-h-[100px] whitespace-pre-wrap">
                  {user?.bio || 'No bio added yet.'}
                </p>
              )}
            </div>

            {/* Account Stats Section (Restored & Dynamic) */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account Statistics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Workouts</p>
                  <p className="text-xl font-bold text-blue-600">{stats?.workouts || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Study Sessions</p>
                  <p className="text-xl font-bold text-cyan-600">{stats?.studySessions || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Recipes Tried</p>
                  <p className="text-xl font-bold text-green-600">{stats?.recipesTried || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}