import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BookOpen, Brain, Clock, Star, Lightbulb, Play, Pause, Check, SkipForward, Coffee, List, Plus, Save, X, Trash2, Lock, Target, Filter, Trophy, Flame, Activity, ListPlus, Volume2 } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

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

// --- HELPER: Format Time ---
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- SESSION PLAYER COMPONENT ---
const StudySession = ({ tip, onComplete, onBack }) => {
  // Parse steps from the JSON details if they exist, otherwise use defaults
  const details = typeof tip.details === 'string' ? JSON.parse(tip.details || '{}') : tip.details;
  // Support both "custom list" array (which has objects directly) or "single tip" structure (which has steps inside details)
  const steps = Array.isArray(tip) ? tip : (details?.steps || [
      { name: 'Focus', time: 1500, type: 'Study', instructions: 'Focus on your material.' },
      { name: 'Break', time: 300, type: 'Rest', instructions: 'Take a short break.' }
  ]);
  
  const title = Array.isArray(tip) ? "Custom Study Session" : tip.title;

  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(steps[0]?.time || 0);
  
  const currentStep = steps[stepIndex];
  const isFinished = stepIndex >= steps.length;

  // Timer useEffect hook
  useEffect(() => {
    let interval = null;
    if (isRunning && secondsRemaining > 0 && !isFinished) {
      interval = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && !isFinished) {
       // Auto-advance logic
       handleNextStep(); 
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, isFinished]);
  
  // --- SOUND LOGIC (Your Request) ---
  useEffect(() => {
    if (isRunning) {
        if (secondsRemaining === 10) playSound('countdown'); 
        else if (secondsRemaining === 0) playSound('finish'); 
    }
  }, [secondsRemaining, isRunning]);

  // Update seconds when stepIndex changes
  useEffect(() => {
    if (!isFinished && currentStep) {
      setSecondsRemaining(currentStep.time);
      if (currentStep.time > 0) {
           setIsRunning(true); // Auto-start next step usually preferred in study apps, or set false if manual
      }
    }
  }, [stepIndex, isFinished]);

  const handleNextStep = useCallback(() => {
    if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
    } else if (!isFinished) {
        setStepIndex(steps.length);
        setIsRunning(false);
    }
  }, [stepIndex, steps.length, isFinished]);

  const handleStartStop = () => {
    if (isFinished) {
      // Restart
      setStepIndex(0);
      setSecondsRemaining(steps[0].time);
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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
            <button
              onClick={() => onBack(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Quit Session
            </button>
            
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Timer and Instructions Column */}
                <div className="bg-white rounded-3xl shadow-xl p-8 h-fit lg:sticky lg:top-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
                    <p className="text-lg text-slate-500 mb-8">Stay focused. You got this.</p>

                    {isFinished ? (
                        <div className="py-10">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                             <Check className="w-10 h-10 text-green-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-4">Session Complete!</h3>
                          <p className="text-slate-500 mb-8">Great work! You've logged this study session.</p>
                          <button
                            onClick={handleComplete}
                            className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                          >
                            Finish & Log
                          </button>
                        </div>
                    ) : (
                        <>
                            {/* Current Step */}
                            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Current Step</p>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">{currentStep?.name}</h3>
                                <p className="text-slate-600 italic">{currentStep?.instructions}</p>
                            </div>

                            {/* Timer Display */}
                            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                                <div className={`absolute inset-0 rounded-full border-8 opacity-20 ${currentStep?.type === 'Study' ? 'border-cyan-500' : 'border-green-500'}`}></div>
                                <div className="text-6xl font-black text-slate-900 font-mono tracking-tight">
                                  {formatTime(secondsRemaining)}
                                </div>
                            </div>
                            
                            {/* Controls */}
                            <div className="flex justify-center gap-4">
                              <button
                                onClick={handleStartStop}
                                disabled={secondsRemaining === 0 && !isFinished || currentStep?.type === 'Note' || currentStep?.time === 0}
                                className={`px-8 py-4 rounded-xl font-bold text-white text-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg
                                  ${isRunning 
                                    ? 'bg-amber-500 shadow-amber-200' 
                                    : 'bg-cyan-600 shadow-cyan-200'} 
                                  disabled:opacity-50`}
                              >
                                {isRunning ? <><Pause className="fill-current" /> Pause</> : <><Play className="fill-current" /> Start</>}
                              </button>
                               <button
                                  onClick={handleSkip}
                                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                              >
                                  <SkipForward /> Skip
                              </button>
                            </div>
                            <div className="w-full flex justify-end mt-4">
                                {isRunning && secondsRemaining <= 10 && <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />}
                            </div>
                            <p className="text-center text-xs font-bold text-slate-400 mt-4 uppercase tracking-wider">Step {stepIndex + 1} of {steps.length}</p>
                        </>
                    )}
                </div>
                
                {/* Full Plan Column */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <List className="w-6 h-6 text-cyan-600" />
                        Session Roadmap
                    </h3>
                    <ul className="space-y-3">
                        {steps.map((step, index) => (
                            <li 
                                key={index} 
                                className={`p-4 rounded-xl transition-all duration-300 border flex justify-between items-center
                                    ${index === stepIndex 
                                        ? 'bg-cyan-50 border-cyan-200 ring-1 ring-cyan-100'
                                        : index < stepIndex 
                                        ? 'bg-slate-50 border-slate-100 text-slate-400 opacity-70'
                                        : 'bg-white border-slate-100'
                                    }`
                                }
                            >
                                <div>
                                    <p className={`font-bold text-sm ${index === stepIndex ? 'text-cyan-900' : 'text-slate-700'}`}>
                                        {index + 1}. {step.name}
                                    </p>
                                    <span className="text-xs text-slate-500 font-medium">{step.type}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${index === stepIndex ? 'bg-cyan-200 text-cyan-800' : 'bg-slate-100 text-slate-500'}`}>
                                        {step.time > 0 ? formatTime(step.time) : '-'}
                                    </span>
                                    {index < stepIndex && <Check className="w-4 h-4 text-green-500" />}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export function StudyTips() {
  const navigate = useNavigate();
  const { user, incrementStudySessions } = useAuth();
  
  const [tips, setTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // CUSTOM LIST STATE
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedForList, setSelectedForList] = useState([]);
  const [customLists, setCustomLists] = useState([]);
  const [builderCategory, setBuilderCategory] = useState('ALL');

  // STATS STATE
  const [completedIds, setCompletedIds] = useState([]);

  const CATEGORIES = ['ALL', 'Time Management', 'Memory', 'Focus', 'Learning Strategy', 'Understanding', 'Organization', 'Productivity', 'Reading', 'Wellness'];

  useEffect(() => {
    if (!user) return;

    // Load Daily Progress
    const storageKey = `iqfit_daily_study_progress_${user.id}`;
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const today = new Date().toDateString();

    if (savedData.date === today) {
        setCompletedIds(savedData.ids || []);
    } else {
        setCompletedIds([]);
        localStorage.setItem(storageKey, JSON.stringify({ date: today, ids: [] }));
    }

    // Load Custom Lists
    const listKey = `iqfit_custom_study_routines_${user.id}`;
    setCustomLists(JSON.parse(localStorage.getItem(listKey) || '[]'));

    // Fetch Content
    fetch('http://localhost:8080/api/content/search?type=STUDY_TIP')
        .then(res => res.json())
        .then(data => {
            setTips(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, [user]);

  // -- HANDLERS --
  
  const handleStart = (tip) => {
    // Check Premium
    const isPremiumContent = Array.isArray(tip) 
        ? tip.some(t => t.accessLevel === 'PREMIUM') // For custom lists (array of steps/tips)
        : tip.accessLevel === 'PREMIUM';

    if (isPremiumContent && !user?.isPremium) {
        if(window.confirm("This content is locked for Premium members. Upgrade to access?")) navigate('/plans');
        return;
    }
    
    // If it's a custom list (array of full tip objects), we need to extract steps
    if (Array.isArray(tip)) {
         // Flatten steps from multiple tips into one session
         let combinedSteps = [];
         tip.forEach(t => {
             const details = typeof t.details === 'string' ? JSON.parse(t.details || '{}') : t.details;
             if (details?.steps) combinedSteps = [...combinedSteps, ...details.steps];
         });
         
         if (combinedSteps.length === 0) return alert("No executable steps in this list.");
         setSelectedTip(combinedSteps); // Pass raw steps array to player
    } else {
         setSelectedTip(tip);
    }
  };

  const handleCompleteSession = () => {
    incrementStudySessions();
    if (selectedTip && !Array.isArray(selectedTip) && user) {
         // Log specific tip completion if not a custom list
         const newCompleted = [...new Set([...completedIds, selectedTip.id])];
         setCompletedIds(newCompleted);
         const today = new Date().toDateString();
         const storageKey = `iqfit_daily_study_progress_${user.id}`;
         localStorage.setItem(storageKey, JSON.stringify({ date: today, ids: newCompleted }));
    }
    setSelectedTip(null);
  };

  // -- CUSTOM LIST LOGIC --
  const handleCreateClick = () => {
      if (!user?.isPremium) {
          if(window.confirm("Creating custom study lists is a Premium feature. Upgrade?")) navigate('/plans');
          return;
      }
      setIsCreating(true);
  };

  const toggleSelection = (tip) => {
      if (selectedForList.find(t => t.id === tip.id)) {
          setSelectedForList(selectedForList.filter(t => t.id !== tip.id));
      } else {
          setSelectedForList([...selectedForList, tip]);
      }
  };

  const saveCustomList = () => {
      if (!newListName || selectedForList.length === 0) return alert("Please add a name and select tips.");
      const newList = {
          id: Date.now(),
          title: newListName,
          tips: selectedForList, // We store the full tip objects
          isCustom: true
      };
      const updated = [...customLists, newList];
      setCustomLists(updated);
      localStorage.setItem(`iqfit_custom_study_routines_${user.id}`, JSON.stringify(updated));
      setIsCreating(false);
      setNewListName('');
      setSelectedForList([]);
  };

  const deleteList = (id) => {
      if(!window.confirm("Delete this list?")) return;
      const updated = customLists.filter(l => l.id !== id);
      setCustomLists(updated);
      localStorage.setItem(`iqfit_custom_study_routines_${user.id}`, JSON.stringify(updated));
  };

  // Stats
  const totalCompleted = completedIds.length;
  // Estimate minutes (avg 25 min per session)
  const focusMinutes = totalCompleted * 25; 

  const filteredTips = selectedCategory === 'ALL' 
    ? tips 
    : tips.filter(t => t.category === selectedCategory);
    
  const builderTips = builderCategory === 'ALL'
    ? tips
    : tips.filter(t => t.category === builderCategory);

  if (selectedTip) {
    return (
      <StudySession 
        tip={selectedTip} 
        onComplete={handleCompleteSession} 
        onBack={setSelectedTip}
      />
    );
  }

  // --- BUILDER VIEW ---
  if (isCreating) {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                 <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setIsCreating(false)} className="flex items-center gap-2 text-slate-600 font-bold hover:text-cyan-600">
                        <ArrowLeft className="w-5 h-5"/> Cancel
                    </button>
                    <h2 className="text-2xl font-black text-slate-900">Create Study Ritual</h2>
                    <button onClick={saveCustomList} className="bg-cyan-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-cyan-700 flex items-center gap-2">
                        <Save className="w-4 h-4"/> Save Ritual
                    </button>
                 </div>

                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ritual Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Deep Work Morning" 
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                        value={newListName}
                        onChange={e => setNewListName(e.target.value)}
                    />
                    <div className="mt-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Selected Techniques ({selectedForList.length})</p>
                        <div className="flex gap-2 flex-wrap bg-slate-50 p-4 rounded-xl min-h-[60px] border border-slate-100">
                            {selectedForList.map(t => (
                                <span key={t.id} className="bg-cyan-100 text-cyan-800 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm border border-cyan-200">
                                    {t.title} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleSelection(t)}/>
                                </span>
                            ))}
                            {selectedForList.length === 0 && <span className="text-slate-400 text-sm italic">No techniques selected. Click cards below.</span>}
                        </div>
                    </div>
                 </div>

                 <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setBuilderCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${builderCategory === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                            {cat}
                        </button>
                    ))}
                 </div>

                 <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {builderTips.map(t => {
                        const isSelected = selectedForList.find(s => s.id === t.id);
                        return (
                            <div key={t.id} onClick={() => toggleSelection(t)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-200' : 'border-slate-100 bg-white hover:border-cyan-200'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{t.title}</h4>
                                    {isSelected && <Check className="w-5 h-5 text-cyan-600 shrink-0" />}
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded">{t.category}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 transition-all mb-10 font-bold bg-white px-5 py-2.5 rounded-full w-fit shadow-md border border-slate-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl mb-5 shadow-lg shadow-cyan-500/30">
             <Brain className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-5 tracking-tight leading-tight">Study Techniques</h1>
          <p className="text-xl text-slate-600 leading-relaxed font-semibold">Master proven methods to boost focus, retention, and productivity.</p>
        </div>

        {/* MINI DASHBOARD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-[2rem] shadow-lg border border-blue-400/20 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg"><Trophy className="w-5 h-5" /></div>
                    <p className="text-xs font-black uppercase tracking-wider opacity-90">Sessions Done</p>
                </div>
                <p className="text-4xl font-black">{totalCompleted}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-[2rem] shadow-lg border border-violet-400/20 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg"><Brain className="w-5 h-5" /></div>
                    <p className="text-xs font-black uppercase tracking-wider opacity-90">Focus Minutes</p>
                </div>
                <p className="text-4xl font-black">{focusMinutes} <span className="text-base font-bold opacity-80">min</span></p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-cyan-200 md:col-span-2 flex items-center justify-between px-8 hover:shadow-xl hover:border-cyan-300 transition-all cursor-pointer group hover:-translate-y-1" onClick={handleCreateClick}>
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-cyan-600 transition-colors">Create Study Ritual</h3>
                    <p className="text-slate-500 text-sm">Combine techniques for max efficiency.</p>
                 </div>
                 <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${user?.isPremium ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {user?.isPremium ? <ListPlus className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                 </div>
            </div>
        </div>

        {/* CUSTOM LISTS SCROLL */}
        {customLists.length > 0 && (
            <div className="mb-14">
                <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-2"><Activity className="w-7 h-7 text-cyan-600"/> My Rituals</h2>
                <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar">
                    {customLists.map(list => (
                        <div key={list.id} className="min-w-[280px] snap-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative group">
                            <h3 className="text-lg font-bold mb-1 line-clamp-1">{list.title}</h3>
                            <p className="text-slate-400 text-xs mb-6 font-medium uppercase tracking-wider">{list.tips.length} Techniques</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleStart(list.tips)} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"><Play className="w-4 h-4"/> Start</button>
                                <button onClick={() => deleteList(list.id)} className="bg-slate-700 hover:bg-red-500/20 hover:text-red-400 py-2 px-3 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 overflow-x-auto pb-8 mb-6 no-scrollbar">
            {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all shrink-0 ${selectedCategory === cat ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-300/50' : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-cyan-400 hover:text-cyan-600 hover:shadow-md'}`}>
                    {cat}
                </button>
            ))}
        </div>
        
        {/* Tips Grid */}
        {loading ? (
            <div className="text-center py-32 text-slate-400 animate-pulse">Loading tips...</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTips.map((tip) => {
                const isCompleted = completedIds.includes(tip.id);
                // Parse benefits safely
                let benefits = [];
                try {
                    const details = typeof tip.details === 'string' ? JSON.parse(tip.details) : tip.details;
                    benefits = details?.benefits || [];
                } catch (e) {}

                return (
                <div
                    key={tip.id}
                    className={`bg-white rounded-[2rem] shadow-sm border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer ${isCompleted ? 'border-green-200 ring-2 ring-green-100' : 'border-slate-100'}`}
                    onClick={() => handleStart(tip)}
                >
                    <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
                        <Brain className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform duration-700" />
                        {tip.accessLevel === 'PREMIUM' && !user?.isPremium && (
                            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg flex items-center gap-1"><Lock className="w-3 h-3"/> PREMIUM</div>
                        )}
                        {isCompleted && (
                            <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg flex items-center gap-1"><Check className="w-3 h-3"/> DONE</div>
                        )}
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-cyan-600 transition-colors">{tip.title}</h3>
                        <p className="text-slate-600 text-base mb-6 line-clamp-2 font-medium leading-relaxed">{tip.description}</p>
                        
                        <div className="mt-auto flex flex-col gap-2.5 text-sm font-bold text-slate-500">
                            {benefits.slice(0, 2).map((benefit, index) => (
                                <span key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0"></div>
                                    <span className="line-clamp-1">{benefit}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                );
            })}
            {filteredTips.length === 0 && (
                 <div className="col-span-full py-20 text-center">
                    <div className="inline-block p-6 bg-slate-50 rounded-full mb-4"><BookOpen className="w-12 h-12 text-slate-300" /></div>
                    <h3 className="text-lg font-bold text-slate-900">No Tips Found</h3>
                    <p className="text-slate-500 mb-6">Try selecting a different category.</p>
                    <button onClick={() => setSelectedCategory('ALL')} className="text-cyan-600 font-bold hover:underline">View All Tips</button>
                 </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
}