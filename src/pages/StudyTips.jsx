import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BookOpen, Brain, Clock, Star, Lightbulb, Play, Pause, Check, SkipForward, Coffee, List } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- Timer Utility Component (StudySession) ---
const StudySession = ({ tip, onComplete, onBack }) => {
  // Parse steps from the JSON details if they exist, otherwise use defaults
  const details = typeof tip.details === 'string' ? JSON.parse(tip.details || '{}') : tip.details;
  const steps = details?.steps || [
      { name: 'Focus', time: 1500, type: 'Study', instructions: 'Focus on your material.' },
      { name: 'Break', time: 300, type: 'Rest', instructions: 'Take a short break.' }
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(steps[0]?.time || 0);
  
  const currentStep = steps[stepIndex];
  const isFinished = stepIndex >= steps.length;

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
    if (!isFinished && currentStep) {
      setSecondsRemaining(currentStep.time);
      if (currentStep.time > 0) {
           setIsRunning(false); 
      }
    }
  }, [stepIndex, isFinished, currentStep]);

  const handleNextStep = useCallback(() => {
    if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setIsRunning(false);
    } else if (!isFinished) {
        setStepIndex(steps.length);
        setIsRunning(false);
    }
  }, [stepIndex, steps.length, isFinished]);

  const handleStartStop = () => {
    if (isFinished) {
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
  
  // Fallback icon if none matched
  const IconComponent = BookOpen;

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
                                <p className="text-sm font-semibold uppercase text-slate-500">Current Step ({currentStep?.type})</p>
                                <h3 className="text-xl font-bold text-cyan-700">{currentStep?.name}</h3>
                            </div>
                            
                            {/* Step Instructions */}
                            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-sm font-semibold text-slate-700 mb-2">Instructions:</p>
                                <p className="text-slate-600 italic">{currentStep?.instructions}</p>
                            </div>

                            {/* Timer Display */}
                            <div className={`text-center p-8 rounded-2xl mb-8 transition-colors duration-500 
                                ${currentStep?.type === 'Study' ? 'bg-blue-100 shadow-lg border-2 border-blue-300' : 'bg-green-100 shadow-lg border-2 border-green-300'}`}>
                                <p className="text-sm font-semibold uppercase text-slate-600 mb-2">Time Remaining</p>
                                <div className="text-7xl font-extrabold text-slate-900">
                                  {formatTime(secondsRemaining)}
                                </div>
                            </div>
                            
                            {/* Controls */}
                            <div className="flex gap-4 mb-4">
                              <button
                                onClick={handleStartStop}
                                disabled={secondsRemaining === 0 && !isFinished || currentStep?.type === 'Note' || currentStep?.time === 0}
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
                            <p className="text-center text-sm text-slate-500">Step {stepIndex + 1} of {steps.length}</p>
                        </>
                    )}
                </div>
                
                {/* Full Plan Column */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <List className="w-6 h-6 text-cyan-600" />
                        Full Study Plan
                    </h3>
                    <ul className="space-y-4">
                        {steps.map((step, index) => (
                            <li 
                                key={index} 
                                className={`p-4 rounded-xl transition-all duration-300 border 
                                    ${index === stepIndex 
                                        ? 'bg-cyan-100 border-cyan-400 shadow-md transform scale-[1.02]'
                                        : index < stepIndex 
                                        ? 'bg-green-50 border-green-200 text-slate-500 line-through opacity-70'
                                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                    }`
                                }
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
  const navigate = useNavigate();
  const { incrementStudySessions } = useAuth();
  
  const [tips, setTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Pagination Setup ---
  const [currentPage, setCurrentPage] = useState(1);
  const tipsPerPage = 6;

  // FETCH FROM BACKEND
  useEffect(() => {
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
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Time Management': 'bg-blue-100 text-blue-700',
      'Memory': 'bg-cyan-100 text-cyan-700',
      'Learning Strategy': 'bg-green-100 text-green-700',
      'Understanding': 'bg-yellow-100 text-yellow-700',
      'Organization': 'bg-pink-100 text-pink-700',
      'Productivity': 'bg-purple-100 text-purple-700',
      'Reading': 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };
  
  // --- Pagination Logic ---
  const totalPages = Math.ceil(tips.length / tipsPerPage);
  const indexOfLastTip = currentPage * tipsPerPage;
  const indexOfFirstTip = indexOfLastTip - tipsPerPage;
  const currentTips = tips.slice(indexOfFirstTip, indexOfLastTip);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Render the Study Session view if a tip is selected
  if (selectedTip) {
    return (
      <StudySession 
        tip={selectedTip} 
        onComplete={incrementStudySessions} 
        onBack={setSelectedTip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-500 p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Study Tips</h1>
          </div>
          <p className="text-lg text-slate-600">Proven techniques to enhance your learning and retention</p>
        </div>
        
        {loading ? (
            <div className="text-center py-20 text-slate-400">Loading tips...</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTips.map((tip) => {
                // Parse benefits from JSON string if needed
                let benefits = [];
                try {
                    const details = typeof tip.details === 'string' ? JSON.parse(tip.details) : tip.details;
                    benefits = details?.benefits || [];
                } catch (e) {}

                return (
                <div
                    key={tip.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 group flex flex-col h-full"
                >
                    <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tip.category)}`}>
                        {tip.category}
                    </span>
                    </div>
                    
                    <div className="flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">{tip.description}</p>
                    
                    <div className="border-t border-slate-200 pt-4 mt-auto">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Benefits:</p>
                        <ul className="space-y-1">
                        {benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                            {benefit}
                            </li>
                        ))}
                        </ul>
                    </div>
                    
                    <button
                        className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        onClick={() => setSelectedTip(tip)}
                    >
                        Start Session
                    </button>
                    </div>
                </div>
                );
            })}
            </div>
        )}
        
        {/* Pagination UI */}
        <div className="flex justify-center items-center gap-2 mt-12">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-l-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
                Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 text-sm font-medium transition-colors 
                        ${currentPage === index + 1 
                            ? 'bg-cyan-600 text-white shadow-md' 
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                        }
                    `}
                >
                    {index + 1}
                </button>
            ))}

            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-r-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
}