import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Dumbbell, Activity, PlusCircle, Trash2, Ban, CheckCircle, Search, Video, BookOpen, LogOut, TrendingUp, Menu, X } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [content, setContent] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Form State for New Content
    const [newContent, setNewContent] = useState({
        title: '',
        description: '',
        contentType: 'WORKOUT',
        category: '',
        difficultyLevel: 'BEGINNER',
        accessLevel: 'FREE',
        durationMinutes: 15
    });

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('iqfit_user'));
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard'); 
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = () => {
        fetch('http://localhost:8080/api/users').then(res => res.json()).then(data => setUsers(data));
        fetch('http://localhost:8080/api/payments').then(res => res.json()).then(data => setPayments(data));
        fetch('http://localhost:8080/api/content').then(res => res.json()).then(data => setContent(data));
    };

    // --- ACTIONS ---
    const handleSuspendUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/suspend`, { method: 'PUT' });
            if (response.ok) {
                const updatedUser = await response.json();
                setUsers(users.map(u => u.id === userId ? updatedUser : u));
            }
        } catch (error) {
            console.error("Error suspending user:", error);
        }
    };

    const handleCreateContent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent)
            });
            if (response.ok) {
                alert("Content Added Successfully!");
                fetchData();
                setNewContent({ ...newContent, title: '', description: '' });
            }
        } catch (error) {
            console.error("Error creating content:", error);
        }
    };

    const handleDeleteContent = async (id) => {
        if(!window.confirm("Delete this content permanently?")) return;
        try {
            await fetch(`http://localhost:8080/api/content/${id}`, { method: 'DELETE' });
            setContent(content.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    };

    // --- FILTERS & STATS ---
    const filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // --- COMPONENTS ---
    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform ${color}`}></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-slate-700`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                {subtext && (
                    <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {subtext}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Mobile Sidebar Toggle */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>

            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed lg:static top-0 left-0 z-40 w-72 bg-slate-900 text-white min-h-screen p-6 flex flex-col shadow-2xl`}>
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                        <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">IQ-FIT <span className="text-slate-400 font-normal">Admin</span></h1>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: 'overview', icon: Activity, label: 'Overview' },
                        { id: 'users', icon: Users, label: 'User Management' },
                        { id: 'financials', icon: DollarSign, label: 'Financials' },
                        { id: 'content', icon: BookOpen, label: 'Content Manager' },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-200 font-medium ${
                                activeTab === item.id 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-900/50 text-white' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5" /> {item.label}
                        </button>
                    ))}
                </nav>

                <button 
                    onClick={() => navigate('/login')} 
                    className="mt-auto flex items-center gap-3 w-full p-4 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" /> Log Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 w-full overflow-y-auto h-screen">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'users' && 'Users'}
                            {activeTab === 'financials' && 'Revenue & Payments'}
                            {activeTab === 'content' && 'Content Library'}
                        </h2>
                        <p className="text-slate-500 mt-1">Manage your application and track performance.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-600">System Online</span>
                        </div>
                    </div>
                </header>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                title="Total Users" 
                                value={users.length} 
                                icon={Users} 
                                color="bg-blue-500" 
                                subtext="+12% from last month"
                            />
                            <StatCard 
                                title="Total Revenue" 
                                value={`$${totalRevenue.toFixed(2)}`} 
                                icon={DollarSign} 
                                color="bg-emerald-500" 
                                subtext="+8.5% growth"
                            />
                            <StatCard 
                                title="Active Content" 
                                value={content.length} 
                                icon={Video} 
                                color="bg-purple-500" 
                                subtext="5 new items this week"
                            />
                        </div>

                        {/* Recent Activity Section could go here */}
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                            <h3 className="text-lg font-bold text-slate-800">All Registered Users</h3>
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or email..." 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-5">User Profile</th>
                                        <th className="p-5">Role</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{user.fullName}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                {user.suspended ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5 text-right flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleSuspendUser(user.id)}
                                                    className={`p-2 rounded-lg transition-colors border ${
                                                        user.suspended 
                                                        ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' 
                                                        : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                                                    }`}
                                                    title={user.suspended ? "Re-activate Account" : "Suspend Account"}
                                                >
                                                    {user.suspended ? <CheckCircle className="w-4 h-4"/> : <Ban className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CONTENT MANAGER */}
                {activeTab === 'content' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Form Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <PlusCircle className="w-6 h-6 text-blue-600"/> Create Content
                                </h3>
                                <form onSubmit={handleCreateContent} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content Title</label>
                                        <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                            placeholder="e.g. 15-Min Abs"
                                            value={newContent.title} onChange={e => setNewContent({...newContent, title: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                                        <textarea required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" rows="3"
                                            placeholder="Short description..."
                                            value={newContent.description} onChange={e => setNewContent({...newContent, description: e.target.value})} />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                value={newContent.contentType} onChange={e => setNewContent({...newContent, contentType: e.target.value})}>
                                                <option value="WORKOUT">Workout</option>
                                                <option value="STUDY_TIP">Study Tip</option>
                                                <option value="RECIPE">Recipe</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                                            <input type="text" placeholder="Cardio" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={newContent.category} onChange={e => setNewContent({...newContent, category: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Difficulty</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                value={newContent.difficultyLevel} onChange={e => setNewContent({...newContent, difficultyLevel: e.target.value})}>
                                                <option value="BEGINNER">Beginner</option>
                                                <option value="INTERMEDIATE">Intermediate</option>
                                                <option value="ADVANCED">Advanced</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Access</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                value={newContent.accessLevel} onChange={e => setNewContent({...newContent, accessLevel: e.target.value})}>
                                                <option value="FREE">Free</option>
                                                <option value="PREMIUM">Premium</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                        Publish Content
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* List View */}
                        <div className="lg:col-span-2 space-y-4">
                            {content.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No content uploaded yet.</p>
                                </div>
                            ) : content.map(item => (
                                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start group hover:shadow-md transition-all">
                                    <div className="flex gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                            item.contentType === 'WORKOUT' ? 'bg-blue-100 text-blue-600' : 
                                            item.contentType === 'RECIPE' ? 'bg-green-100 text-green-600' : 
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                            {item.contentType === 'WORKOUT' ? <Dumbbell className="w-7 h-7"/> : 
                                             item.contentType === 'RECIPE' ? <Video className="w-7 h-7"/> : 
                                             <BookOpen className="w-7 h-7"/>}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${item.accessLevel === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {item.accessLevel}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm mb-3 leading-relaxed">{item.description}</p>
                                            <div className="flex gap-3 text-xs font-semibold text-slate-500">
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    Category: {item.category}
                                                </span>
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    Level: {item.difficultyLevel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteContent(item.id)}
                                        className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FINANCIALS TAB */}
                {activeTab === 'financials' && (
                    <div className="animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-5">Transaction ID</th>
                                        <th className="p-5">User</th>
                                        <th className="p-5">Amount</th>
                                        <th className="p-5">Method</th>
                                        <th className="p-5">Date</th>
                                        <th className="p-5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.map(payment => (
                                        <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-5 text-slate-500 font-mono text-xs">#{String(payment.id).padStart(6, '0')}</td>
                                            <td className="p-5 font-medium text-slate-900">{payment.user.fullName}</td>
                                            <td className="p-5 font-bold text-emerald-600">+${payment.amount}</td>
                                            <td className="p-5 text-slate-600">{payment.paymentMethod}</td>
                                            <td className="p-5 text-slate-500 text-sm">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                            <td className="p-5">
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">PAID</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}