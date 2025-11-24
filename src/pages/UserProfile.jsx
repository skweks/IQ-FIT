import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, FileText, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export function UserProfile() {
  // Pull user and updateProfile function from the global context
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Initialize local form state whenever the user object changes (e.g., after login)
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);


  const handleSave = () => {
    // 1. Validate data (simple validation)
    if (!fullName || !email) {
      alert('Full Name and Email are required.'); // Using simple alert for brevity, recommend custom modal.
      return;
    }

    // 2. Prepare the data to send to the context/backend
    const newProfileData = {
      fullName,
      email,
      bio,
    };

    // 3. Update the global context state and localStorage
    updateProfile(newProfileData);

    // 4. Exit editing mode
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
                {getInitials(user?.fullName || '')}
              </div>
              <div>
                {/* Displaying directly from context user to ensure immediate reflection */}
                <h1 className="text-3xl font-bold mb-2">{user?.fullName}</h1> 
                <p className="text-blue-100">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Reset local state back to current context user data on Cancel
                      setFullName(user.fullName || '');
                      setEmail(user.email || '');
                      setBio(user.bio || '');
                      setIsEditing(false);
                    }}
                    className="px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                ) : (
                  <p className="text-lg text-slate-900 bg-slate-50 px-4 py-3 rounded-lg">{user?.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                ) : (
                  <p className="text-lg text-slate-900 bg-slate-50 px-4 py-3 rounded-lg">{user?.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-lg text-slate-900 bg-slate-50 px-4 py-3 rounded-lg min-h-[100px]">
                    {user?.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account Statistics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Member Since</p>
                  <p className="text-xl font-bold text-blue-600">Jan 2025</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Total Activities</p>
                  <p className="text-xl font-bold text-cyan-600">54</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Streak</p>
                  <p className="text-xl font-bold text-green-600">7 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}