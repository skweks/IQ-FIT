import { useState, useEffect } from 'react';
import { ArrowLeft, Dumbbell, Clock, Flame, Target, Play, Pause, Check, SkipForward, Lock } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- Helper to format seconds ---
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- Timer Component ---
const WorkoutSession = ({ workout, onComplete, onBack }) => {
    // If the workout comes from DB without steps, generate generic ones
    const steps = workout.steps || [
        { name: 'Warm Up', time: 300, type: 'Rest', instructions: 'Light jogging and stretching.' },
        { name: 'Main Workout', time: (workout.durationMinutes || 30) * 60 - 600, type: 'Exercise', instructions: workout.description },
        { name: 'Cool Down', time: 300, type: 'Rest', instructions: 'Static stretching and breathing.' }
    ];

    const [stepIndex, setStepIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(steps[0].time);
    const currentStep = steps[stepIndex];
    const isFinished = stepIndex >= steps.length;

    useEffect(() => {
        let interval = null;
        if (isRunning && secondsRemaining > 0 && !isFinished) {
            interval = setInterval(() => setSecondsRemaining(s => s - 1), 1000);
        } else if (secondsRemaining === 0 && !isFinished) {
            setIsRunning(false);
            setStepIndex(prev => prev + 1);
        }
        return () => clearInterval(interval);
    }, [isRunning, secondsRemaining, isFinished]);

    useEffect(() => {
        if (!isFinished) {
            setSecondsRemaining(currentStep.time);
            setIsRunning(false); // Auto-pause on step change
        }
    }, [stepIndex, isFinished]);

    const handleNext = () => {
        if (stepIndex < steps.length) setStepIndex(prev => prev + 1);
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
                    <Check className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Workout Complete!</h2>
                    <p className="text-slate-600 mb-8">Great job crushing {workout.title}.</p>
                    <button onClick={onComplete} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">
                        Finish & Log
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => onBack(null)} className="flex items-center gap-2 text-slate-600 mb-6">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{workout.title}</h2>
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 inline-block">
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">{currentStep.type}</p>
                        <h3 className="text-2xl font-bold text-slate-800">{currentStep.name}</h3>
                        <p className="text-slate-600 mt-1">{currentStep.instructions}</p>
                    </div>
                    <div className="text-8xl font-black text-slate-900 mb-8 font-mono">
                        {formatTime(secondsRemaining)}
                    </div>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setIsRunning(!isRunning)} className={`px-8 py-4 rounded-xl font-bold text-white text-lg flex items-center gap-2 ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}>
                            {isRunning ? <><Pause /> Pause</> : <><Play /> Start</>}
                        </button>
                        <button onClick={handleNext} className="px-8 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 flex items-center gap-2">
                            <SkipForward /> Skip
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---
export function WorkoutRoutine() {
    const navigate = useNavigate();
    const { user, incrementWorkouts } = useAuth();
    const [workouts, setWorkouts] = useState([]); // Store real data here
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Workouts from Database
    useEffect(() => {
        fetch('http://localhost:8080/api/content/search?type=WORKOUT')
            .then(res => res.json())
            .then(data => {
                setWorkouts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching workouts:", err);
                setLoading(false);
            });
    }, []);

    const handleStartClick = (workout) => {
        if (workout.accessLevel === 'PREMIUM' && !user?.isPremium) {
            if(window.confirm("This workout is locked for Premium members. Upgrade now?")) {
                navigate('/plans');
            }
            return;
        }
        setSelectedWorkout(workout);
    };

    if (selectedWorkout) {
        return <WorkoutSession workout={selectedWorkout} onComplete={() => { incrementWorkouts(); setSelectedWorkout(null); }} onBack={setSelectedWorkout} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 font-medium">
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Workout Library</h1>
                <p className="text-slate-600 mb-8">Select a routine from our database.</p>

                {loading ? (
                    <div className="text-center py-20">Loading workouts...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workouts.map((workout) => (
                            <div key={workout.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all">
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 h-40 flex items-center justify-center relative">
                                    <Dumbbell className="w-16 h-16 text-white opacity-90" />
                                    {workout.accessLevel === 'PREMIUM' && !user?.isPremium && (
                                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> LOCKED
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">{workout.title}</h3>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-bold uppercase">{workout.difficultyLevel}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{workout.description}</p>
                                    
                                    <div className="flex gap-4 text-xs font-semibold text-slate-500 mt-auto mb-6">
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {workout.durationMinutes} min</span>
                                        <span className="flex items-center gap-1"><Target className="w-4 h-4"/> {workout.category}</span>
                                    </div>

                                    <button 
                                        onClick={() => handleStartClick(workout)}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                            workout.accessLevel === 'PREMIUM' && !user?.isPremium 
                                            ? 'bg-slate-800 text-white hover:bg-slate-900' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                        }`}
                                    >
                                        {workout.accessLevel === 'PREMIUM' && !user?.isPremium ? 'Unlock Premium' : 'Start Workout'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}