import React, { useEffect, useState, useCallback } from 'react';
import { Users, Dumbbell, Activity, PlusCircle, Trash2, BookOpen, LogOut, LayoutGrid, Coffee, Search, Ban, CheckCircle, MoreVertical, DollarSign, Mail, MessageSquare, Pencil, X, RotateCcw, Filter, Crown, TrendingUp } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [content, setContent] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('ALL');
    
    // WORKOUT LIST FILTERS
    const [workoutCategoryFilter, setWorkoutCategoryFilter] = useState('ALL');
    const [workoutAccessFilter, setWorkoutAccessFilter] = useState('ALL');

    const navigate = useNavigate();

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [newItem, setNewItem] = useState({
        title: '', description: '', contentType: 'WORKOUT', category: '',
        difficultyLevel: 'BEGINNER', accessLevel: 'FREE', durationMinutes: 15,
        videoUrl: '', sets: 3, reps: '12', restTimeSeconds: 60
    });

    const fetchData = useCallback(() => {
        fetch('http://localhost:8080/api/users').then(res => res.json()).then(setUsers);
        fetch('http://localhost:8080/api/payments').then(res => res.json()).then(setPayments);
        fetch('http://localhost:8080/api/content').then(res => res.json()).then(setContent);
        fetch('http://localhost:8080/api/messages').then(res => res.json()).then(setMessages);
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('iqfit_user'));
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard'); 
            return;
        }
        fetchData();
    }, [navigate, fetchData]);

    // --- HELPER: Reset Form ---
    const resetForm = () => {
        setNewItem({ 
            title: '', description: '', contentType: 'WORKOUT', category: '',
            difficultyLevel: 'BEGINNER', accessLevel: 'FREE', durationMinutes: 15,
            videoUrl: '', sets: 3, reps: '12', restTimeSeconds: 60
        });
        setIsEditing(false);
        setEditingId(null);
    };

    // --- ACTIONS ---
    const handleSave = async (e) => {
        e.preventDefault();
        const type = activeTab === 'workouts' ? 'WORKOUT' : 
                     activeTab === 'recipes' ? 'RECIPE' : 
                     activeTab === 'tips' ? 'STUDY_TIP' : newItem.contentType;
        
        const payload = { ...newItem, contentType: type };

        if (isEditing && editingId) {
            await fetch(`http://localhost:8080/api/content/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert("Updated Successfully!");
        } else {
            await fetch('http://localhost:8080/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert("Added Successfully!");
        }
        
        fetchData();
        resetForm();
    };

    const handleEdit = (item) => {
        setNewItem(item);
        setEditingId(item.id);
        setIsEditing(true);
        if (item.contentType === 'WORKOUT') setActiveTab('workouts');
        else if (item.contentType === 'RECIPE') setActiveTab('recipes');
        else if (item.contentType === 'STUDY_TIP') setActiveTab('tips');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this item?")) {
            await fetch(`http://localhost:8080/api/content/${id}`, { method: 'DELETE' });
            fetchData();
            if (editingId === id) resetForm();
        }
    };

    const handleSuspendUser = async (id) => {
        await fetch(`http://localhost:8080/api/users/${id}/suspend`, { method: 'PUT' });
        fetchData();
    };

    const handleDeleteUser = async (id) => {
        if(window.confirm("Permanently delete this user?")) {
            await fetch(`http://localhost:8080/api/users/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const handleDeleteMessage = async (id) => {
        if(window.confirm("Delete this message?")) {
            await fetch(`http://localhost:8080/api/messages/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const getFilteredContent = (type) => {
        let filtered = content.filter(c => c.contentType === type);
        
        if (type === 'WORKOUT') {
            if (workoutCategoryFilter !== 'ALL') {
                filtered = filtered.filter(c => c.category === workoutCategoryFilter);
            }
            if (workoutAccessFilter !== 'ALL') {
                filtered = filtered.filter(c => c.accessLevel === workoutAccessFilter);
            }
        }
        return filtered;
    };
    
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = userFilter === 'ALL' ? true : userFilter === 'PREMIUM' ? u.isPremium : !u.isPremium;
        return matchesSearch && matchesFilter;
    });

    const WORKOUT_CATEGORIES = ['FULL BODY', 'PUSH', 'PULL', 'LEGS', 'CHEST', 'ARMS', 'CORE', 'CARDIO'];
    const OTHER_CATEGORIES = ['General', 'Nutrition', 'Productivity', 'Mental Health'];

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white min-h-screen p-6 fixed flex flex-col shadow-2xl z-30">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none">IQ-FIT</h1>
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Admin Panel</span>
                    </div>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Main Menu</p>
                        <nav className="space-y-1">
                            <NavBtn id="overview" icon={LayoutGrid} label="Dashboard" active={activeTab} set={setActiveTab} />
                            <NavBtn id="users" icon={Users} label="Users" active={activeTab} set={setActiveTab} />
                            <NavBtn id="messages" icon={MessageSquare} label="Messages" active={activeTab} set={setActiveTab} badge={messages.length} />
                        </nav>
                    </div>
                    
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Content Management</p>
                        <nav className="space-y-1">
                            <NavBtn id="workouts" icon={Dumbbell} label="Workouts" active={activeTab} set={setActiveTab} />
                            <NavBtn id="tips" icon={BookOpen} label="Study Tips" active={activeTab} set={setActiveTab} />
                            <NavBtn id="recipes" icon={Coffee} label="Recipes" active={activeTab} set={setActiveTab} />
                        </nav>
                    </div>
                </div>

                <button onClick={() => navigate('/login')} className="mt-auto flex items-center gap-3 w-full p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium group">
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="ml-72 p-8 lg:p-12 w-full max-w-[1920px] mx-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
                        <p className="text-slate-500 font-medium">Manage your platform efficiently.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                            <Search className="w-5 h-5" />
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200">
                            A
                        </div>
                    </div>
                </header>

                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" trend="+12%" />
                            <StatCard title="Workouts" value={getFilteredContent('WORKOUT').length} icon={Dumbbell} color="bg-purple-500" trend="+5" />
                            <StatCard title="Messages" value={messages.length} icon={MessageSquare} color="bg-orange-500" trend="New" />
                            <StatCard title="Revenue" value={`$${payments.reduce((s, p) => s + p.amount, 0).toFixed(2)}`} icon={DollarSign} color="bg-emerald-500" trend="+8.5%" />
                        </div>
                        
                        {/* Recent Activity & System Stats */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Recent Transactions */}
                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
                                    <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {payments.length === 0 ? (
                                        <p className="text-slate-400 text-sm italic">No recent transactions.</p>
                                    ) : (
                                        payments.slice(0, 5).map(payment => (
                                            <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg shadow-sm">
                                                        $
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">New Subscription</p>
                                                        <p className="text-xs text-slate-500">{payment.user.fullName} bought a plan</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-sm font-bold text-emerald-600">+${payment.amount}</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* System Health Card */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl -mr-16 -mt-16"></div>
                                
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                            <Activity className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <h3 className="font-bold text-lg relative z-10">System Health</h3>
                                    </div>
                                    
                                    <div className="space-y-8 relative z-10">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-300 font-medium">Server Uptime</span>
                                                <span className="font-bold text-emerald-400">99.9%</span>
                                            </div>
                                            <div className="w-full bg-slate-700/50 rounded-full h-2.5 backdrop-blur-sm">
                                                <div className="bg-emerald-500 h-2.5 rounded-full w-[99%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-300 font-medium">Storage Used</span>
                                                <span className="font-bold text-blue-400">45%</span>
                                            </div>
                                            <div className="w-full bg-slate-700/50 rounded-full h-2.5 backdrop-blur-sm">
                                                <div className="bg-blue-500 h-2.5 rounded-full w-[45%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-300 font-medium">Database Load</span>
                                                <span className="font-bold text-purple-400">12%</span>
                                            </div>
                                            <div className="w-full bg-slate-700/50 rounded-full h-2.5 backdrop-blur-sm">
                                                <div className="bg-purple-500 h-2.5 rounded-full w-[12%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 flex justify-between items-center relative z-10">
                                    <span>Last updated: Just now</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-emerald-400 font-bold">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- USERS TAB --- */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">{users.length} Users</span>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <div className="relative">
                                    <select 
                                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                                        value={userFilter}
                                        onChange={(e) => setUserFilter(e.target.value)}
                                    >
                                        <option value="ALL">All Plans</option>
                                        <option value="FREE">Free Only</option>
                                        <option value="PREMIUM">Premium Only</option>
                                    </select>
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                                <div className="relative w-full sm:w-72 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="Search users..." 
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-5 pl-8 border-b border-slate-100">User Profile</th>
                                        <th className="p-5 border-b border-slate-100">Role</th>
                                        <th className="p-5 border-b border-slate-100">Plan</th>
                                        <th className="p-5 border-b border-slate-100">Status</th>
                                        <th className="p-5 pr-8 border-b border-slate-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="p-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${user.role === 'ADMIN' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{user.fullName}</div>
                                                        <div className="text-xs text-slate-500 font-medium">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                {user.isPremium ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                        <Crown className="w-3 h-3 fill-current" /> PREMIUM
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                        FREE
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5">
                                                {user.suspended ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                                                        <Ban className="w-3 h-3" /> Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                        <CheckCircle className="w-3 h-3" /> Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5 pr-8 text-right">
                                                {user.role !== 'ADMIN' && (
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleSuspendUser(user.id)}
                                                            className={`p-2 rounded-lg transition-colors ${user.suspended ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                                            title={user.suspended ? "Activate" : "Suspend"}
                                                        >
                                                            {user.suspended ? <CheckCircle className="w-4 h-4"/> : <Ban className="w-4 h-4"/>}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4"/>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* --- MESSAGES TAB --- */}
                {activeTab === 'messages' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {messages.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="p-4 bg-slate-50 rounded-full mb-4 inline-block">
                                    <Mail className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium text-lg">No new messages</p>
                                <p className="text-slate-400 text-sm">Check back later for inquiries.</p>
                            </div>
                        ) : messages.map(msg => (
                            <div key={msg.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {msg.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base leading-tight">{msg.name}</h4>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">{msg.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 uppercase tracking-wider">
                                            {new Date(msg.dateSent).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 relative">
                                        <div className="absolute top-0 left-4 -mt-2 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 transform rotate-45"></div>
                                        <p className="text-slate-600 text-sm italic leading-relaxed">
                                            "{msg.message}"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end border-t border-slate-100 pt-4">
                                    <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-2 text-red-500 text-xs font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" /> Delete Message
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- WORKOUTS & CONTENT TAB --- */}
                {activeTab === 'workouts' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* FORM */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 h-fit sticky top-6 lg:col-span-1">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><PlusCircle className="w-6 h-6"/></div>
                                    <h3 className="font-black text-xl text-slate-800">{isEditing ? 'Edit Workout' : 'Create Workout'}</h3>
                                </div>
                                {isEditing && (
                                    <button onClick={resetForm} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                                        <X className="w-3 h-3" /> Cancel
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSave} className="space-y-5">
                                <Input label="Exercise Title" val={newItem.title} set={v => setNewItem({...newItem, title: v})} />
                                <Input label="Video URL" val={newItem.videoUrl} set={v => setNewItem({...newItem, videoUrl: v})} placeholder="/videos/squat.mp4" />
                                <TextArea label="Instructions" val={newItem.description} set={v => setNewItem({...newItem, description: v})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Sets" type="number" val={newItem.sets} set={v => setNewItem({...newItem, sets: v})} />
                                    <Input label="Reps" val={newItem.reps} set={v => setNewItem({...newItem, reps: v})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Rest (sec)" type="number" val={newItem.restTimeSeconds} set={v => setNewItem({...newItem, restTimeSeconds: v})} />
                                    <Select label="Difficulty" val={newItem.difficultyLevel} set={v => setNewItem({...newItem, difficultyLevel: v})} opts={['BEGINNER','INTERMEDIATE','ADVANCED']} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
                                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {WORKOUT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <Select label="Access Tier" val={newItem.accessLevel} set={v => setNewItem({...newItem, accessLevel: v})} opts={['FREE','PREMIUM']} />
                                <button className={`w-full py-4 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 flex justify-center items-center gap-2 mt-4 ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-800'}`}>
                                    {isEditing ? <RotateCcw className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />} 
                                    {isEditing ? 'Update Workout' : 'Publish Workout'}
                                </button>
                            </form>
                        </div>

                        {/* LIST WITH FILTERS */}
                        <div className="lg:col-span-2 flex flex-col h-full">
                            {/* FILTERS ROW */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center sticky top-0 z-10">
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider">
                                    <Filter className="w-4 h-4" /> Filters:
                                </div>
                                <div className="flex gap-3">
                                    <select 
                                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors"
                                        value={workoutCategoryFilter}
                                        onChange={(e) => setWorkoutCategoryFilter(e.target.value)}
                                    >
                                        <option value="ALL">All Categories</option>
                                        {WORKOUT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <select 
                                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors"
                                        value={workoutAccessFilter}
                                        onChange={(e) => setWorkoutAccessFilter(e.target.value)}
                                    >
                                        <option value="ALL">All Tiers</option>
                                        <option value="FREE">Free</option>
                                        <option value="PREMIUM">Premium</option>
                                    </select>
                                </div>
                                <span className="ml-auto text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Showing {getFilteredContent('WORKOUT').length} Items
                                </span >
                            </div>

                            {/* SCROLLABLE LIST */}
                            <div className="space-y-6 overflow-y-auto max-h-[800px] pr-2 pb-20 custom-scrollbar">
                                {getFilteredContent('WORKOUT').map(item => (
                                    <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center hover:shadow-lg transition-all duration-300 group">
                                        <div className="flex gap-6 items-center">
                                            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shrink-0 border border-blue-100">
                                                <Dumbbell className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-lg text-slate-900">{item.title}</h4>
                                                    <Badge label={item.category} color="slate" />
                                                </div>
                                                <div className="flex flex-wrap gap-3 mt-3">
                                                    <Badge label={`${item.sets || 3} Sets`} color="blue" />
                                                    <Badge label={`${item.reps || '12'} Reps`} color="blue" />
                                                    <Badge label={`${item.restTimeSeconds || 60}s Rest`} color="blue" />
                                                    {item.accessLevel === 'PREMIUM' && <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-200 tracking-wide">PREMIUM</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                <Pencil className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {getFilteredContent('WORKOUT').length === 0 && (
                                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
                                        <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold">No workouts match your filters.</p>
                                        <button onClick={() => {setWorkoutCategoryFilter('ALL'); setWorkoutAccessFilter('ALL');}} className="text-blue-600 text-sm font-bold mt-2 hover:underline">Clear Filters</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TIPS & RECIPES TAB --- */}
                {(activeTab === 'tips' || activeTab === 'recipes') && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-6 lg:col-span-1">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                    <div className={`p-2 rounded-lg ${activeTab === 'tips' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                        <PlusCircle className="w-5 h-5"/>
                                    </div>
                                    {isEditing ? 'Edit Item' : `Add ${activeTab === 'tips' ? 'Tip' : 'Recipe'}`}
                                </h3>
                                {isEditing && (
                                    <button onClick={resetForm} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                                        <X className="w-3 h-3" /> Cancel
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSave} className="space-y-5">
                                <Input label="Title" val={newItem.title} set={v => setNewItem({...newItem, title: v})} />
                                <TextArea label="Content / Steps" val={newItem.description} set={v => setNewItem({...newItem, description: v})} />
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {OTHER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <Select label="Access" val={newItem.accessLevel} set={v => setNewItem({...newItem, accessLevel: v})} opts={['FREE','PREMIUM']} />
                                <button className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 mt-4 ${activeTab === 'tips' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}>
                                    {isEditing ? 'Update' : 'Publish'}
                                </button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            {getFilteredContent(activeTab === 'tips' ? 'STUDY_TIP' : 'RECIPE').map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex gap-5 items-center">
                                        <div className={`p-4 rounded-2xl shrink-0 ${activeTab === 'tips' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                            {activeTab === 'tips' ? <BookOpen className="w-6 h-6" /> : <Coffee className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <Pencil className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// UI Helpers
const NavBtn = ({ id, icon: Icon, label, active, set, badge }) => (
    <button onClick={() => set(id)} className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-bold text-sm group relative overflow-hidden ${active === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <Icon className={`w-5 h-5 ${active === id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} /> 
        <span className="relative z-10">{label}</span>
        {badge > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm relative z-10">{badge}</span>}
        {active === id && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 w-1/2 -skew-x-12 animate-shimmer"></div>}
    </button>
);

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
        <div className={`absolute top-0 right-0 p-6 opacity-5 ${color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-28 h-28" />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
            {trend && <div className="flex items-center gap-1 mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg w-fit"><TrendingUp className="w-3 h-3"/> {trend}</div>}
        </div>
    </div>
);

const Input = ({ label, val, set, type="text", placeholder="" }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">{label}</label>
        <input required type={type} placeholder={placeholder} className="w-full px-5 py-3.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium" value={val} onChange={e => set(e.target.value)} />
    </div>
);

const TextArea = ({ label, val, set }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">{label}</label>
        <textarea required className="w-full px-5 py-3.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium resize-none" rows="3" value={val} onChange={e => set(e.target.value)} />
    </div>
);

const Select = ({ label, val, set, opts }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">{label}</label>
        <div className="relative">
            <select className="w-full px-5 py-3.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium appearance-none cursor-pointer" value={val} onChange={e => set(e.target.value)}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);

const Badge = ({ label, color="blue" }) => (
    <span className={`bg-${color}-50 text-${color}-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-${color}-100 uppercase tracking-wide`}>{label}</span>
);