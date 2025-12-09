import { useState, useEffect } from 'react';
import { ArrowLeft, Dumbbell, Clock, Target, Play, Pause, SkipForward, Lock, Video, Plus, Flame, Info, Check, Filter, Trophy, Activity, ListPlus, Save, X, Trash2, Volume2, Pencil, Circle, CheckCircle } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- HELPER: Embed URL ---
const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        if (url.includes('embed')) return url;

        // 1. Handle YouTube Shorts
        if (url.includes('/shorts/')) {
            const videoId = url.split('/shorts/')[1]?.split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // 2. Handle Standard Watch URLs (v=)
        if (url.includes('v=')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // 3. Handle Shortened Links (youtu.be)
        if (url.includes('youtu.be')) {
             return `https://www.youtube.com/embed/${url.split('/').pop()?.split('?')[0]}`;
        }
    }
    return null; 
};

// --- HELPER: Sound Effect ---
const playSound = (type) => {
    try {
        const file = type === 'finish' ? '/sounds/finish.mp3' : '/sounds/timer.mp3';
        const audio = new Audio(file);
        audio.volume = 0.6; 
        audio.play().catch(err => console.log("Audio play prevented:", err));
    } catch (e) {
        console.error("Sound error:", e);
    }
};

// --- SESSION PLAYER COMPONENT ---
const WorkoutPlayer = ({ playlist, onComplete, onExit }) => {
    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [phase, setPhase] = useState('WARMUP'); 
    const [currentSet, setCurrentSet] = useState(1);
    const [timer, setTimer] = useState(0); 
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const workout = playlist[exerciseIndex];

    // Default Settings
    const WARMUP_TIME = 180; 
    const TARGET_SETS = workout.sets || 3;
    const TARGET_REPS = workout.reps || "12";
    const REST_TIME = workout.restTimeSeconds || 60;

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && isTimerRunning) {
            handleTimerFinish();
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    useEffect(() => {
        if (isTimerRunning) {
            if (timer === 10) playSound('countdown'); 
            else if (timer === 0) playSound('finish'); 
        }
    }, [timer, isTimerRunning]);

    const handleTimerFinish = () => {
        setIsTimerRunning(false);
        if (phase === 'WARMUP') startExercise();
        if (phase === 'REST') startExercise();
    };

    useEffect(() => {
        if (exerciseIndex === 0 && phase === 'WARMUP') {
            setTimer(WARMUP_TIME);
            setIsTimerRunning(true);
        } else if (phase === 'WARMUP') {
             startExercise(); 
        }
    }, [exerciseIndex]);

    const startExercise = () => {
        setPhase('EXERCISE');
        setTimer(0);
        setIsTimerRunning(false);
    };

    const handleSetDone = () => {
        if (currentSet < TARGET_SETS) {
            setPhase('REST');
            setTimer(REST_TIME);
            setIsTimerRunning(true);
            setCurrentSet(prev => prev + 1);
        } else {
            if (exerciseIndex < playlist.length - 1) {
                setExerciseIndex(prev => prev + 1);
                setCurrentSet(1);
                setPhase('REST'); 
                setTimer(10); 
                setIsTimerRunning(true);
            } else {
                setPhase('FINISHED');
            }
        }
    };

    const addRestTime = () => setTimer(prev => prev + 20);
    const skipRest = () => { setTimer(0); startExercise(); };

    if (phase === 'FINISHED') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete!</h2>
                    <p className="text-slate-600 mb-8">You completed {playlist.length} exercises.</p>
                    <button onClick={onComplete} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                        Finish & Log Activity
                    </button>
                </div>
            </div>
        );
    }

    const embedUrl = getEmbedUrl(workout.videoUrl);
    const isDirectVideo = workout.videoUrl && !embedUrl;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            <div className="p-4 flex justify-between items-center bg-slate-800/50 backdrop-blur-md sticky top-0 z-10 border-b border-white/10">
                <button onClick={() => onExit(null)} className="text-slate-400 hover:text-white flex gap-2 items-center font-medium">
                    <ArrowLeft className="w-5 h-5" /> Quit
                </button>
                <div className="text-center">
                    <div className="font-bold text-lg">{workout.title}</div>
                    <div className="text-xs text-slate-400">Exercise {exerciseIndex + 1} of {playlist.length}</div>
                </div>
                <div className="w-16 flex justify-end">
                    {isTimerRunning && timer <= 10 && <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />}
                </div> 
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 relative border border-slate-700">
                    {embedUrl ? (
                        <iframe className="w-full h-full" src={embedUrl} title="Guide" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                    ) : isDirectVideo ? (
                        <video className="w-full h-full object-cover" controls src={workout.videoUrl} playsInline></video>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500">
                            <div className="text-center">
                                <Video className="w-12 h-12 mb-2 mx-auto opacity-50" />
                                <p>No Video Guide</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-white border border-white/10 shadow-lg flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${phase === 'REST' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                        {phase === 'WARMUP' && "WARM UP"}
                        {phase === 'EXERCISE' && `SET ${currentSet} / ${TARGET_SETS}`}
                        {phase === 'REST' && "REST BREAK"}
                    </div>
                </div>

                <div className="w-full bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl">
                    {phase === 'WARMUP' && (
                        <div className="text-center animate-fade-in">
                            <h2 className="text-2xl font-bold text-blue-400 mb-2">Warm Up Routine</h2>
                            <p className="text-slate-400 mb-8">Get your blood flowing. Do some jumping jacks or stretches.</p>
                            <div className="text-7xl font-mono font-bold mb-8 tracking-tighter">{Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}</div>
                            <button onClick={startExercise} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all transform active:scale-95 shadow-lg shadow-blue-900/50">
                                I'm Ready to Start
                            </button>
                        </div>
                    )}

                    {phase === 'EXERCISE' && (
                        <div className="text-center animate-fade-in">
                            <div className="flex justify-center gap-4 mb-8">
                                <div className="bg-slate-700/50 px-6 py-3 rounded-2xl border border-slate-600">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Target</p>
                                    <p className="text-2xl font-bold text-white">{TARGET_REPS} Reps</p>
                                </div>
                                <div className="bg-slate-700/50 px-6 py-3 rounded-2xl border border-slate-600">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Set</p>
                                    <p className="text-2xl font-bold text-white">{currentSet} <span className="text-slate-500 text-sm">/ {TARGET_SETS}</span></p>
                                </div>
                            </div>
                            <div className="bg-slate-700/30 p-5 rounded-2xl mb-8 text-left border border-slate-700">
                                <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wide"><Info className="w-4 h-4"/> Instructions</h4>
                                <p className="text-slate-300 leading-relaxed text-sm">{workout.description}</p>
                            </div>
                            <button onClick={handleSetDone} className="w-full py-4 bg-green-500 text-slate-900 font-bold text-xl rounded-2xl hover:bg-green-400 transition-all transform active:scale-95 shadow-lg shadow-green-900/50 flex items-center justify-center gap-2">
                                <Check className="w-6 h-6" /> SET COMPLETE
                            </button>
                        </div>
                    )}

                    {phase === 'REST' && (
                        <div className="text-center animate-fade-in">
                            <h2 className="text-2xl font-bold text-amber-400 mb-2">Rest & Recover</h2>
                            <p className="text-slate-400 mb-8">
                                {exerciseIndex < playlist.length - 1 && currentSet === TARGET_SETS 
                                    ? `Next up: ${playlist[exerciseIndex+1].title}` 
                                    : "Breathe deeply. Prepare for the next set."}
                            </p>
                            <div className="text-8xl font-mono font-bold text-white mb-8 tracking-tighter">{timer}s</div>
                            <div className="flex gap-4">
                                <button onClick={addRestTime} className="flex-1 py-4 bg-slate-700 rounded-2xl font-bold hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 border border-slate-600">
                                    <Plus className="w-5 h-5"/> 20s
                                </button>
                                <button onClick={skipRest} className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
                                    Skip Rest
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN LIBRARY COMPONENT ---
export function WorkoutRoutine() {
    const navigate = useNavigate();
    const { user, incrementWorkouts } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    
    // Custom Routine State
    const [isCreating, setIsCreating] = useState(false);
    const [editingRoutineId, setEditingRoutineId] = useState(null); 
    const [newRoutineName, setNewRoutineName] = useState('');
    const [selectedForRoutine, setSelectedForRoutine] = useState([]);
    const [customRoutines, setCustomRoutines] = useState([]);
    const [builderCategory, setBuilderCategory] = useState('ALL'); 
    
    // Stats
    const [completedIds, setCompletedIds] = useState([]);

    const CATEGORIES = ['ALL', 'FULL BODY', 'PUSH', 'PULL', 'LEGS', 'CHEST', 'ARMS', 'CORE', 'CARDIO'];

    useEffect(() => {
        if (!user) return;

        // Load Daily Progress (Local)
        const storageKey = `iqfit_daily_progress_${user.id}`;
        const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const today = new Date().toDateString();

        if (savedData.date === today) {
            setCompletedIds(savedData.ids || []);
        } else {
            setCompletedIds([]);
            localStorage.setItem(storageKey, JSON.stringify({ date: today, ids: [] }));
        }

        const routineKey = `iqfit_custom_routines_${user.id}`;
        setCustomRoutines(JSON.parse(localStorage.getItem(routineKey) || '[]'));

        fetch('http://localhost:8080/api/content/search?type=WORKOUT')
            .then(res => res.json())
            .then(data => { setWorkouts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [user]);

    const handleStart = (playlist) => {
        const hasPremium = playlist.some(w => w.accessLevel === 'PREMIUM');
        if (hasPremium && !user?.isPremium) {
            if(window.confirm("This routine contains Premium workouts. Upgrade to access?")) navigate('/plans');
            return;
        }
        setSelectedPlaylist(playlist);
    };

    const handleCreateRoutineClick = () => {
        if (!user?.isPremium) {
            if(window.confirm("Creating custom routines is a Premium feature. Upgrade to unlock this power?")) {
                navigate('/plans');
            }
            return;
        }
        setEditingRoutineId(null); 
        setNewRoutineName('');
        setSelectedForRoutine([]);
        setIsCreating(true);
    };

    const handleEditRoutine = (routine) => {
        setNewRoutineName(routine.title);
        setSelectedForRoutine(routine.exercises);
        setEditingRoutineId(routine.id);
        setIsCreating(true);
    };

    const handleWorkoutComplete = async () => {
        // 1. Update Context (Local)
        incrementWorkouts(); 
        
        // 2. Update Daily Local Stats
        if (selectedPlaylist && user) {
            const ids = selectedPlaylist.map(w => w.id);
            const newCompleted = [...new Set([...completedIds, ...ids])];
            setCompletedIds(newCompleted);
            
            const today = new Date().toDateString();
            const storageKey = `iqfit_daily_progress_${user.id}`;
            localStorage.setItem(storageKey, JSON.stringify({ date: today, ids: newCompleted }));
            
            // 3. NEW: SAVE TO DATABASE (LIFETIME STATS)
            // Loop through completed items and send to backend
            for (const workout of selectedPlaylist) {
                 try {
                     await fetch('http://localhost:8080/api/activity', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                             userId: user.id,
                             contentId: workout.id,
                             status: 'COMPLETED'
                         })
                     });
                 } catch (e) {
                     console.error("Failed to log activity to DB:", e);
                 }
            }
        }
        setSelectedPlaylist(null);
    };

    const toggleSelection = (workout) => {
        if (selectedForRoutine.find(w => w.id === workout.id)) {
            setSelectedForRoutine(selectedForRoutine.filter(w => w.id !== workout.id));
        } else {
            setSelectedForRoutine([...selectedForRoutine, workout]);
        }
    };

    const saveCustomRoutine = () => {
        if (!newRoutineName || selectedForRoutine.length === 0) return alert("Please add a name and select exercises");
        
        let updatedRoutines;
        
        if (editingRoutineId) {
            updatedRoutines = customRoutines.map(r => 
                r.id === editingRoutineId 
                ? { ...r, title: newRoutineName, exercises: selectedForRoutine }
                : r
            );
            alert("Routine Updated!");
        } else {
            const newRoutine = {
                id: Date.now(),
                title: newRoutineName,
                exercises: selectedForRoutine,
                isCustom: true
            };
            updatedRoutines = [...customRoutines, newRoutine];
            alert("Routine Created!");
        }

        setCustomRoutines(updatedRoutines);
        localStorage.setItem(`iqfit_custom_routines_${user.id}`, JSON.stringify(updatedRoutines));
        
        setIsCreating(false);
        setEditingRoutineId(null);
        setNewRoutineName('');
        setSelectedForRoutine([]);
    };

    const deleteRoutine = (id) => {
        if(!window.confirm("Delete this routine?")) return;
        const updated = customRoutines.filter(r => r.id !== id);
        setCustomRoutines(updated);
        localStorage.setItem(`iqfit_custom_routines_${user.id}`, JSON.stringify(updated));
    };

    const handleCancelCreation = () => {
        setIsCreating(false);
        setEditingRoutineId(null);
        setNewRoutineName('');
        setSelectedForRoutine([]);
    }

    // Stats
    const totalCompleted = completedIds.length;
    const estimatedCalories = totalCompleted * 150; 

    // Filter Logic with Status
    const filteredWorkouts = workouts.filter(w => {
        // 1. Category Filter
        const matchesCategory = selectedCategory === 'ALL' || w.category?.toUpperCase() === selectedCategory;
        
        // 2. Status Filter
        const isCompleted = completedIds.includes(w.id);
        const matchesStatus = statusFilter === 'ALL' 
            ? true 
            : statusFilter === 'COMPLETED' ? isCompleted : !isCompleted;
        
        return matchesCategory && matchesStatus;
    });
    
    const builderWorkouts = builderCategory === 'ALL'
        ? workouts
        : workouts.filter(w => w.category?.toUpperCase() === builderCategory);

    if (selectedPlaylist) return <WorkoutPlayer playlist={selectedPlaylist} onComplete={handleWorkoutComplete} onExit={setSelectedPlaylist} />;

    // --- BUILDER VIEW ---
    if (isCreating) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                     <div className="flex justify-between items-center mb-8">
                        <button onClick={handleCancelCreation} className="flex items-center gap-2 text-slate-600 font-bold">
                            <ArrowLeft className="w-5 h-5"/> Cancel
                        </button>
                        <h2 className="text-2xl font-black text-slate-900">{editingRoutineId ? 'Edit Routine' : 'Create Custom Routine'}</h2>
                        <button onClick={saveCustomRoutine} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2">
                            <Save className="w-4 h-4"/> {editingRoutineId ? 'Update' : 'Save'}
                        </button>
                     </div>

                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Routine Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Monday Chest Destruction" 
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500"
                            value={newRoutineName}
                            onChange={e => setNewRoutineName(e.target.value)}
                        />
                        <div className="mt-4">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Selected Exercises ({selectedForRoutine.length})</p>
                            <div className="flex gap-2 flex-wrap bg-slate-50 p-4 rounded-xl min-h-[60px] border border-slate-100">
                                {selectedForRoutine.map(w => (
                                    <span key={w.id} className="bg-white border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                                        {w.title} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleSelection(w)}/>
                                    </span>
                                ))}
                                {selectedForRoutine.length === 0 && <span className="text-slate-400 text-sm italic">No exercises selected yet. Click cards below.</span>}
                            </div>
                        </div>
                     </div>

                     {/* BUILDER FILTER */}
                     <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setBuilderCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                                    builderCategory === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                     </div>

                     <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {builderWorkouts.map(w => {
                            const isSelected = selectedForRoutine.find(s => s.id === w.id);
                            return (
                                <div key={w.id} 
                                    onClick={() => toggleSelection(w)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{w.title}</h4>
                                        {isSelected && <Check className="w-5 h-5 text-blue-600 shrink-0" />}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">{w.category}</span>
                                        <span>{w.difficultyLevel}</span>
                                    </div>
                                </div>
                            );
                        })}
                     </div>
                </div>
            </div>
        );
    }

    // --- MAIN VIEW ---
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 font-medium">
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>

                {/* MINI DASHBOARD (Stats) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Trophy className="w-5 h-5" /></div>
                            <p className="text-sm font-bold text-slate-500 uppercase">Today's Completed</p>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{totalCompleted} <span className="text-xs font-medium text-slate-400">Sessions</span></p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Flame className="w-5 h-5" /></div>
                            <p className="text-sm font-bold text-slate-500 uppercase">Today's Burned</p>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{estimatedCalories} <span className="text-xs font-medium text-slate-400">Kcal</span></p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 flex items-center justify-between px-8 hover:shadow-md transition-shadow cursor-pointer group" onClick={handleCreateRoutineClick}>
                         <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">Custom Routines</h3>
                            <p className="text-slate-500 text-sm">Build your perfect workout plan.</p>
                         </div>
                         <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${user?.isPremium ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {user?.isPremium ? <ListPlus className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                         </div>
                    </div>
                </div>

                {/* CUSTOM ROUTINES SCROLL */}
                {customRoutines.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-6 h-6 text-blue-600"/> My Custom Routines</h2>
                        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
                            {customRoutines.map(routine => (
                                <div key={routine.id} className="min-w-[280px] snap-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative group">
                                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{routine.title}</h3>
                                    <p className="text-slate-400 text-xs mb-6 font-medium uppercase tracking-wider">{routine.exercises.length} Exercises</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStart(routine.exercises)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"><Play className="w-4 h-4"/> Start</button>
                                        
                                        {/* NEW: Edit Button */}
                                        <button onClick={() => handleEditRoutine(routine)} className="bg-slate-700 hover:bg-slate-600 py-2 px-3 rounded-lg transition-colors"><Pencil className="w-4 h-4"/></button>

                                        <button onClick={() => deleteRoutine(routine.id)} className="bg-slate-700 hover:bg-red-500/20 hover:text-red-400 py-2 px-3 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Exercise Library</h1>
                        <p className="text-slate-600">Pick individual exercises or filter by body part.</p>
                    </div>
                    {user?.isPremium && (
                        <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold flex items-center gap-2 border border-amber-200">
                            <Target className="w-4 h-4" /> Premium Access Unlocked
                        </div>
                    )}
                </div>

                {/* CONTROLS: Status Filter + Category Tabs */}
                <div className="space-y-4 mb-8">
                    {/* STATUS TOGGLE */}
                    <div className="flex bg-slate-200 p-1 rounded-xl w-fit">
                        {['ALL', 'COMPLETED', 'INCOMPLETE'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    statusFilter === status 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {status === 'ALL' ? 'All' : status === 'COMPLETED' ? 'Done' : 'To Do'}
                            </button>
                        ))}
                    </div>

                    {/* CATEGORY FILTER */}
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                                    selectedCategory === cat 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                {loading ? <div className="text-center py-20 text-slate-400">Loading library...</div> : (
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar">
                        {filteredWorkouts.length > 0 ? filteredWorkouts.map(w => {
                            const isCompleted = completedIds.includes(w.id);
                            return (
                                <div key={w.id} className={`min-w-[300px] md:min-w-[350px] snap-center bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all group flex flex-col ${isCompleted ? 'border-green-200 ring-2 ring-green-100' : 'border-slate-100'}`}>
                                    <div className="h-48 bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                                        {w.videoUrl ? (
                                            <>
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                                <Play className="w-16 h-16 text-white opacity-90 relative z-10 group-hover:scale-110 transition-transform" />
                                            </>
                                        ) : (
                                            <Dumbbell className="w-16 h-16 text-white opacity-90" />
                                        )}
                                        
                                        {w.accessLevel === 'PREMIUM' && !user?.isPremium && (
                                            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg z-20">
                                                <Lock className="w-3 h-3" /> PREMIUM
                                            </div>
                                        )}
                                        {isCompleted && (
                                            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg z-20">
                                                <Check className="w-3 h-3" /> DONE
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl text-slate-900 line-clamp-1">{w.title}</h3>
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md tracking-wide ${w.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-700' : w.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {w.difficultyLevel}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{w.description}</p>
                                        
                                        <div className="flex gap-2 mb-6 mt-auto">
                                            <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 flex-1 text-center">{w.sets || 3} Sets</span>
                                            <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 flex-1 text-center">{w.reps || '12'} Reps</span>
                                        </div>

                                        <button onClick={() => handleStart([w])} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${w.accessLevel === 'PREMIUM' && !user?.isPremium ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20' : isCompleted ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
                                            {w.accessLevel === 'PREMIUM' && !user?.isPremium ? <><Lock className="w-4 h-4"/> Unlock</> : isCompleted ? <><Check className="w-4 h-4"/> Do Again</> : <><Play className="w-4 h-4"/> Start Exercise</>}
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="w-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center min-w-[300px]">
                                <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No exercises found for "{selectedCategory}"</p>
                                <button onClick={() => setSelectedCategory('ALL')} className="text-blue-600 font-bold text-sm mt-2 hover:underline">View All</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}