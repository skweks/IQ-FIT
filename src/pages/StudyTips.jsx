import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Star, Clock, Filter,MoreVertical,Check, ArrowRight, BookOpen, Crown, CheckCircle, X, ChevronsRight, Award, Zap, LayoutGrid, Pause, Play, LogOut, ArrowLeft, Lightbulb, SkipForward } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// NOTE: The large TIPS_DATA array has been removed/commented out.
// Data is now fetched from the API.

const STUDY_CATEGORIES = ['MEMORY', 'TIME_MANAGEMENT', 'PRODUCTIVITY', 'CRITICAL_THINKING', 'READING', 'UNDERSTANDING'];
const ALL_FILTERS = ['ALL', 'FAVORITES', ...STUDY_CATEGORIES];

const API_URL = 'http://localhost:8080/api'; 

// --- TOAST NOTIFICATION COMPONENT (Reusable) ---
const ToastNotification = ({ message, type, onClose }) => {
    if (!message) return null;

    let icon, colorClasses, title;

    switch (type) {
        case 'success':
            icon = <CheckCircle className="w-5 h-5 text-emerald-600" />;
            colorClasses = "border-emerald-500 bg-emerald-50";
            title = "Success";
            break;
        case 'error':
            icon = <X className="w-5 h-5 text-red-600" />;
            colorClasses = "border-red-500 bg-red-50";
            title = "Error";
            break;
        case 'info':
        default:
            icon = <MoreVertical className="w-5 h-5 text-purple-600" />;
            colorClasses = "border-purple-500 bg-purple-50";
            title = "Info";
            break;
    }

    return (
        <div className="fixed top-6 right-6 z-50 transition-all duration-500 animate-in slide-in-from-right-10 fade-in">
            <div className={`w-full max-w-sm border-l-4 shadow-2xl rounded-xl p-4 flex items-start gap-4 ${colorClasses}`}>
                <div className="p-2 rounded-full shrink-0">
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-0.5">{title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{message}</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


// --- STUDY SESSION MODAL COMPONENT (Re-used from previous step) ---
const StudySession = ({ tip, onComplete, onBack }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(tip.steps[0].time);
    
    const currentStep = tip.steps[stepIndex];
    const isFinished = stepIndex >= tip.steps.length;

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Timer useEffect hook
    useEffect(() => {
        let interval = null;
        if (isRunning && secondsRemaining > 0 && !isFinished) {
            interval = setInterval(() => {
                setSecondsRemaining((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else if (secondsRemaining === 0 && !isFinished) {
            setIsRunning(false);
            setStepIndex((prevIndex) => prevIndex + 1);
        }
        return () => clearInterval(interval);
    }, [isRunning, secondsRemaining, isFinished]);
    
    // Update seconds when stepIndex changes
    useEffect(() => {
        if (!isFinished) {
            setSecondsRemaining(currentStep.time);
            if (currentStep.time > 0) {
                setIsRunning(false); 
            }
        }
    }, [stepIndex, isFinished, currentStep]);

    const handleNextStep = useCallback(() => {
        if (stepIndex < tip.steps.length - 1) {
            setStepIndex(stepIndex + 1);
            setIsRunning(false);
        } else if (!isFinished) {
            setStepIndex(tip.steps.length);
            setIsRunning(false);
        }
    }, [stepIndex, tip.steps.length, isFinished]);

    const handleStartStop = () => {
        if (isFinished) {
            setStepIndex(0);
            setSecondsRemaining(tip.steps[0].time);
            setIsRunning(true);
            return;
        }
        setIsRunning(!isRunning);
    };
    
    const handleSkip = () => {
         handleNextStep();
    };

    const handleComplete = () => {
        if (isFinished) {
            onComplete();
            onBack(null);
        }
    };
    
    const IconComponent = tip.icon || Lightbulb; // Use Lightbulb fallback

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => onBack(null)}
                    className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Tips
                </button>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Timer and Instructions Column */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 h-fit lg:sticky lg:top-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{tip.title}</h2>
                        <p className="text-lg text-slate-600 mb-6">Interactive Study Session</p>

                        {isFinished ? (
                            <div className="text-center py-10">
                              <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                              <h3 className="text-2xl font-bold text-green-600 mb-4">Session Complete!</h3>
                              <p className="text-slate-700 mb-6">Log your successful study session to the dashboard.</p>
                              <button
                                onClick={handleComplete}
                                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                              >
                                <Check className="w-5 h-5" />
                                Log & Finish Session
                              </button>
                            </div>
                        ) : (
                            <>
                                {/* Current Step and Timer */}
                                <div className="mb-6 p-4 rounded-xl border-2 border-cyan-200 bg-cyan-50">
                                    <p className="text-sm font-semibold uppercase text-slate-500">Current Step ({currentStep.type})</p>
                                    <h3 className="text-xl font-bold text-cyan-700">{currentStep.name}</h3>
                                </div>
                                
                                {/* Step Instructions */}
                                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Instructions:</p>
                                    <p className="text-slate-600 italic">{currentStep.instructions}</p>
                                </div>

                                {/* Timer Display */}
                                <div className={`text-center p-8 rounded-2xl mb-8 transition-colors duration-500 
                                    ${currentStep.type === 'Study' ? 'bg-blue-100 shadow-lg border-2 border-blue-300' : 'bg-green-100 shadow-lg border-2 border-green-300'}`}>
                                    <p className="text-sm font-semibold uppercase text-slate-600 mb-2">Time Remaining</p>
                                    <div className="text-7xl font-extrabold text-slate-900">
                                      {formatTime(secondsRemaining)}
                                    </div>
                                </div>
                                
                                {/* Controls */}
                                <div className="flex gap-4 mb-4">
                                  <button
                                    onClick={handleStartStop}
                                    disabled={secondsRemaining === 0 && !isFinished || currentStep.type === 'Note' || currentStep.time === 0}
                                    className={`flex-1 py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 
                                      ${isRunning 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-cyan-600 hover:bg-cyan-700'} 
                                      disabled:opacity-50`}
                                  >
                                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    {isRunning ? 'Pause' : 'Start / Resume'}
                                  </button>
                                   <button
                                     onClick={handleSkip}
                                     className="py-3 px-6 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                                   >
                                     <SkipForward className="w-5 h-5" />
                                     Skip
                                   </button>
                                </div>
                                <p className="text-center text-sm text-slate-500">Step {stepIndex + 1} of {tip.steps.length}</p>
                            </>
                        )}
                    </div>
                    
                    {/* Full Plan Column */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <IconComponent className="w-6 h-6 text-cyan-600" />
                            Full Study Plan
                        </h3>
                        <ul className="space-y-4">
                            {tip.steps.map((step, index) => (
                                <li 
                                    key={index} 
                                    className={`p-4 rounded-xl transition-all duration-300 border 
                                        ${index === stepIndex 
                                            ? 'bg-cyan-100 border-cyan-400 shadow-md transform scale-[1.02]'
                                            : index < stepIndex 
                                            ? 'bg-green-50 border-green-200 text-slate-500 line-through opacity-70'
                                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className={`font-semibold ${index === stepIndex ? 'text-cyan-800' : 'text-slate-800'}`}>
                                            {index + 1}. {step.name}
                                        </p>
                                        <span className={`text-sm px-2 py-1 rounded-full ${step.type === 'Study' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                                            {step.time > 0 ? formatTime(step.time) : step.type}
                                        </span>
                                    </div>
                                    {(index === stepIndex && step.type !== 'Note') && (
                                        <p className="text-xs text-slate-600 italic mt-1">
                                            {step.instructions}
                                        </p>
                                    )}
                                    {index < stepIndex && (
                                        <Check className="w-4 h-4 text-green-600 inline-block mr-1" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- End Timer Utility Component (StudySession) ---


export function StudyTips() {
    const { user, stats, incrementStudySessions } = useAuth();
    const navigate = useNavigate();
    
    // UI State
    const [studyTips, setStudyTips] = useState([]); // Initial state is now empty, waiting for API fetch
    const [selectedTip, setSelectedTip] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(false);
    
    // Timer/Pagination setup is removed for simplicity, relying on the API fetch below.

    // --- Toast State ---
    const [toast, setToast] = useState({ message: '', type: 'info' });

    // Function to easily show the toast
    const showToast = useCallback((message, type) => {
        setToast({ message, type });
    }, []);

    // --- FIX: Implement API Fetching for Content ---
    const fetchTips = useCallback(async () => {
        setIsLoading(true);
        try {
            // FIX: Use API endpoint to get real data saved by Admin Dashboard
            const response = await fetch(`${API_URL}/content/search?type=STUDY_TIP`); 
            
            if (!response.ok) {
                // If API fails, fall back to an empty array
                showToast("Failed to load tips from server.", 'error');
                setStudyTips([]);
                return;
            }
            
            const data = await response.json();
            
            // Load favorites status from local storage and merge with fetched data
            const savedFavorites = JSON.parse(localStorage.getItem(`iqfit_favorites_study_${user?.id}`)) || {};
            
            const tipsWithFavorites = data.map(tip => ({
                 ...tip,
                 isFavorite: !!savedFavorites[tip.id],
                 // FIX: Ensure tip has necessary structure for UI and Session Modal
                 icon: Lightbulb, // Default icon since API model doesn't specify one
                 steps: tip.instructions || [ // Provide a safe fallback for session steps
                    { name: 'Study', time: 1500, type: 'Study', instructions: tip.description || 'Focus on learning.' }
                 ] 
            }));

            setStudyTips(tipsWithFavorites);

        } catch(error) {
            showToast("Could not load latest tips. Check network.", 'error');
            setStudyTips([]);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, showToast]);

    // --- useEffect: Fetch Data on Load ---
    useEffect(() => {
        fetchTips();
    }, [fetchTips]);


    // --- FAVORITE LOGIC ---
    const handleFavoriteToggle = (id) => {
        if (!user?.isPremium) {
            showToast("Upgrade to Premium to unlock Favoriting!", 'error');
            return;
        }

        const updatedTips = studyTips.map(tip => 
            tip.id === id ? { ...tip, isFavorite: !tip.isFavorite } : tip
        );
        
        setStudyTips(updatedTips);
        
        // Update Local Storage
        const favoritesMap = updatedTips.reduce((map, tip) => {
            if (tip.isFavorite) {
                map[tip.id] = true;
            }
            return map;
        }, {});
        localStorage.setItem(`iqfit_favorites_study_${user?.id}`, JSON.stringify(favoritesMap));
        
        const tipName = studyTips.find(t => t.id === id)?.title;
        showToast(updatedTips.find(t => t.id === id).isFavorite ? `${tipName} favorited.` : `${tipName} removed from favorites.`, 'info');
    };

    // --- SESSION MODAL HANDLERS ---
    const handleStartSession = (tip) => {
        if (!user?.isPremium && tip.accessLevel === 'PREMIUM') {
             return;
        }
        setSelectedTip(tip);
    };

    const handleModalClose = () => {
        setSelectedTip(null);
    };

    const handleSessionComplete = () => {
        incrementStudySessions();
        showToast("Study Session Complete! Great work.", 'success');
    };

    // --- Filter Logic ---
    const getFilteredTips = () => {
        return studyTips.filter(tip => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'FAVORITES') return tip.isFavorite;
            // The API returns category as a string, but the mock array used to use the long form.
            // We need to check if the category (which should be stored on the tip object) matches the filter.
            const tipCategory = tip.category?.toUpperCase() || tip.contentType; 
            return tipCategory === activeFilter;
        });
    };
    
    // --- UI Helpers ---
    const getCategoryColor = (category) => {
        const colors = {
            'ORGANIZATION': 'bg-pink-100 text-pink-700',
            'READING': 'bg-red-100 text-red-700',
            'UNDERSTANDING': 'bg-orange-100 text-orange-700',
        };
        return colors[category.toUpperCase()] || 'bg-slate-100 text-slate-700';
    };

    const totalMinutesStudied = stats?.studySessions * 25 || 0; // Assume 25 min/session
    
    const StudyStatCard = ({ icon: Icon, value, label, color }) => (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
            </div>
        </div>
    );

    const ContentCard = ({ tip }) => {
        const isDisabled = !user?.isPremium && tip.accessLevel === 'PREMIUM';
        
        return (
            <div className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all duration-300 ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                
                <div className="flex justify-between items-start mb-4">
                    <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${tip.accessLevel === 'PREMIUM' ? 'bg-amber-500/20 text-amber-700' : 'bg-green-500/20 text-green-700'}`}>
                        {tip.accessLevel}
                    </div>
                    
                    {/* FAVORITE TOGGLE */}
                    <button 
                        onClick={() => handleFavoriteToggle(tip.id)} 
                        className="p-2 -mr-2 text-amber-500 hover:scale-110 transition-transform disabled:opacity-50"
                        disabled={!user?.isPremium}
                    >
                        <Star className={`w-5 h-5 ${tip.isFavorite ? 'fill-current' : 'fill-transparent'}`} />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{tip.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{tip.description}</p>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Clock className="w-4 h-4 text-purple-400" /> 
                        {tip.durationMinutes || Math.round(tip.totalDurationSeconds / 60)} minutes
                    </div>
                    
                    <button 
                        onClick={() => handleStartSession(tip)}
                        disabled={isDisabled}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all 
                            ${isDisabled
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/30' 
                            }`}
                    >
                        Start Session <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };
    
    const PremiumUpsellCard = () => (
        <div className="lg:col-span-2 bg-gradient-to-br from-amber-500 to-yellow-600 p-8 rounded-3xl shadow-xl border border-yellow-400 text-white flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 fill-white/20 text-white" />
                <h3 className="text-2xl font-black">Upgrade to Premium</h3>
            </div>
            
            <p className="text-sm font-medium mb-6 opacity-90">
                Unlock exclusive routines, save your favorites, and dedicated session tracking.
            </p>

            <button 
                onClick={() => navigate('/plans')}
                className="w-full py-3.5 rounded-xl text-amber-600 font-bold bg-white hover:bg-slate-100 transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2"
            >
                Upgrade Now <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Render Modal */}
            {selectedTip && (
                <StudySession 
                    tip={selectedTip} 
                    onBack={handleModalClose} 
                    onComplete={handleSessionComplete} 
                />
            )}
             {/* Render Toast */}
            <ToastNotification 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ message: '', type: 'info' })}
            />


            <header className="pt-20 pb-12 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Brain className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-black">Study Techniques</h1>
                        </div>
                        <p className="text-indigo-200 text-lg">Sharpen your mind and maximize focus with proven strategies.</p>
                    </div>
                    
                    {/* BACK TO DASHBOARD BUTTON */}
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors mt-2"
                    >
                        <LayoutGrid className="w-4 h-4" /> Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                
                {/* STATS AND TIMER/UPSELL ROW */}
                <div className="grid lg:grid-cols-4 gap-6 mb-12">
                    <StudyStatCard 
                        icon={BookOpen} 
                        value={stats?.studySessions || 0} 
                        label="Total Sessions Started" 
                        color="bg-purple-500" 
                    />
                    <StudyStatCard 
                        icon={Clock} 
                        value={`${totalMinutesStudied} min`} 
                        label="Minutes Studied" 
                        color="bg-indigo-500" 
                    />
                    
                    {/* CONDITIONAL TIMER/UPSELL CARD */}
                    {user?.isPremium ? (
                         <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-slate-200 flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Session Player Available</h3>
                            <p className="text-slate-500 text-sm mb-4">Click "Start Session" on any technique to begin a focused session.</p>
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <span className="text-sm font-bold text-purple-600">Premium Active</span>
                                <Crown className="w-5 h-5 text-purple-500 fill-purple-300" />
                            </div>
                        </div>
                    ) : (
                        <PremiumUpsellCard />
                    )}
                </div>

                {/* CONTENT AREA: FILTERS AND LIST */}
                <div className="py-8">
                    
                    {/* FILTER BAR */}
                    <div className="flex flex-wrap gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mr-4">
                            <Filter className="w-4 h-4" /> Categories:
                        </div>
                        {ALL_FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    activeFilter === filter 
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {filter === 'FAVORITES' ? <Star className="w-4 h-4 inline mr-1 fill-current" /> : null}
                                {filter.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* TIPS GRID */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <p className="col-span-full text-center py-12 text-slate-500">Loading study techniques...</p>
                        ) : getFilteredTips().length === 0 ? (
                            <div className="col-span-full text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
                                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold">No techniques match your filter.</p>
                                <button onClick={() => setActiveFilter('ALL')} className="text-purple-600 text-sm font-bold mt-2 hover:underline">Clear Filters</button>
                            </div>
                        ) : (
                            getFilteredTips().map(tip => (
                                <ContentCard key={tip.id} tip={tip} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}