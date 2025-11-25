import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BookOpen, Brain, Clock, Star, Lightbulb, Play, Pause, Check, SkipForward } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- Study Tips Data ---
const TIPS_DATA = [
    {
      id: 1,
      title: 'Pomodoro Technique',
      category: 'Time Management',
      icon: Clock,
      description: 'Study for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer 15-30 minute break.',
      benefits: ['Improved focus', 'Reduced burnout', 'Better time awareness'],
      totalDurationSeconds: 30 * 60, // Mock total time for session
      steps: [
        { name: 'Setup', time: 60, type: 'Start', instructions: 'Clear your desk, grab your materials, and silence distractions. Write down your target task.' },
        { name: 'Focus Period 1', time: 1500, type: 'Study', instructions: 'Work intensely for 25 minutes. Do not check your phone or email. Focus only on the task at hand.' },
        { name: 'Short Break', time: 300, type: 'Rest', instructions: 'Step away from your work. Stretch, grab water, or look out a window. Rest your mind.' },
        { name: 'Focus Period 2', time: 1500, type: 'Study', instructions: 'Resume intense focus. Maintain the energy you established in the first block.' },
        { name: 'Short Break', time: 300, type: 'Rest', instructions: 'Another short mental break. Prepare for the final stretch.' },
        { name: 'Review & Planning', time: 600, type: 'Review', instructions: 'Review what you learned. Plan your next Pomodoro session, then finish the routine.' },
      ]
    },
    {
      id: 2,
      title: 'Active Recall',
      category: 'Memory',
      icon: Brain,
      description: 'Test yourself on the material rather than passively reading. This strengthens neural pathways and improves retention.',
      benefits: ['Enhanced memory', 'Better understanding', 'Long-term retention'],
      totalDurationSeconds: 20 * 60,
      steps: [
        { name: 'Read Section', time: 600, type: 'Study', instructions: 'Read a short section of notes or a chapter. Do not highlight or make notes yet.' },
        { name: 'Close Book', time: 30, type: 'Rest', instructions: 'Close your book or notes.' },
        { name: 'Write/Speak Recalls', time: 480, type: 'Exercise', instructions: 'Write down or verbally explain everything you remember about the section without looking at your source material.' },
        { name: 'Review Accuracy', time: 180, type: 'Review', instructions: 'Open your material and check your recalls. Fill in the missing gaps and correct errors. This is the crucial learning step.' },
        { name: 'Finish Session', time: 0, type: 'Note', instructions: 'You can now proceed to apply this technique to the next section or complete the session.' },
      ]
    },
    {
      id: 3,
      title: 'Spaced Repetition',
      category: 'Learning Strategy',
      icon: Star,
      description: 'Review material at increasing intervals over time. Study today, review tomorrow, then in 3 days, then a week later.',
      benefits: ['Combat forgetting curve', 'Efficient learning', 'Strong retention'],
      totalDurationSeconds: 15 * 60,
      steps: [
        { name: 'Introduction', time: 60, type: 'Start', instructions: 'Prepare your flashcards or notes set for the day\'s review.' },
        { name: 'Initial Review', time: 480, type: 'Study', instructions: 'Review the items you learned *yesterday*. Grade yourself immediately.' },
        { name: 'Medium Interval Review', time: 300, type: 'Study', instructions: 'Review items from 3-5 days ago. These should be harder to recall.' },
        { name: 'Long Interval Review', time: 90, type: 'Study', instructions: 'Review any "mastered" items that haven\'t been seen in a week or more.' },
        { name: 'Log & Plan', time: 30, type: 'Review', instructions: 'Update your review calendar based on today\'s performance. Finish the session.' },
      ]
    },
    {
      id: 4,
      title: 'Feynman Technique',
      category: 'Understanding',
      icon: Lightbulb,
      description: 'Explain concepts in simple terms as if teaching someone else. Identify gaps in your understanding and fill them.',
      benefits: ['Deep understanding', 'Identify knowledge gaps', 'Simplify complex topics'],
      totalDurationSeconds: 25 * 60,
      steps: [
        { name: 'Choose Topic', time: 60, type: 'Start', instructions: 'Select a specific concept or problem you want to understand deeply.' },
        { name: 'Teach (Draft 1)', time: 600, type: 'Exercise', instructions: 'Explain the topic in simple terms to an imaginary student. Write down the explanation.' },
        { name: 'Review & Simplify', time: 300, type: 'Review', instructions: 'Identify areas where you used complex jargon. Simplify the language as much as possible.' },
        { name: 'Identify Gaps', time: 480, type: 'Study', instructions: 'Go back to your source material. Where did your explanation fall short? Re-read those sections.' },
        { name: 'Refine & Finalize', time: 600, type: 'Exercise', instructions: 'Create a final, concise, and clear explanation. You have truly mastered the concept!' },
      ]
    },
    {
      id: 5,
      title: 'Mind Mapping',
      category: 'Organization',
      icon: BookOpen,
      description: 'Create visual diagrams connecting related concepts. Start with a central idea and branch out to related topics.',
      benefits: ['Visual learning', 'See connections', 'Creative thinking'],
      totalDurationSeconds: 15 * 60,
      steps: [
        { name: 'Central Idea', time: 120, type: 'Start', instructions: 'Write the central topic (e.g., "The French Revolution") in the middle of a blank page and draw a circle around it.' },
        { name: 'Main Branches', time: 300, type: 'Study', instructions: 'Draw 3-5 main branches radiating outwards (e.g., "Causes," "Key Events," "Impact"). Use keywords or images.' },
        { name: 'Sub-Branches', time: 480, type: 'Exercise', instructions: 'Add sub-branches to the main branches, providing details and examples. Draw lines connecting related concepts across different branches.' },
        { name: 'Review Flow', time: 60, type: 'Review', instructions: 'Review the map. Does the visual flow make sense? Use colored pens to denote different categories or connections.' },
      ]
    },
    {
      id: 6,
      title: 'Environment Optimization',
      category: 'Productivity',
      icon: Star,
      description: 'Create a dedicated study space free from distractions. Good lighting, comfortable seating, and organized materials.',
      benefits: ['Better focus', 'Reduced distractions', 'Consistent routine'],
      totalDurationSeconds: 10 * 60,
      steps: [
        { name: 'Remove Distractions', time: 300, type: 'Rest', instructions: 'Physically remove unnecessary items (phone, random clutter) from your desk. Only keep study materials and water.' },
        { name: 'Optimize Comfort', time: 180, type: 'Review', instructions: 'Check your lighting, chair height, and ambient temperature. Your environment should support long focus periods.' },
        { name: 'Prepare Resources', time: 120, type: 'Start', instructions: 'Lay out all necessary textbooks, notebooks, and reference sheets. Everything should be within arm\'s reach.' },
      ]
    },
    {
      id: 7,
      title: 'SQ3R Method',
      category: 'Reading',
      icon: BookOpen,
      description: 'Survey, Question, Read, Recite, Review—an active reading strategy improving comprehension and retention.',
      benefits: ['Improved reading', 'Active studying', 'Better retention'],
      totalDurationSeconds: 40 * 60,
      steps: [
        { name: 'S: Survey', time: 180, type: 'Study', instructions: 'Glance over the chapter/section headings, subheadings, captions, and summaries to get a general overview of the material.' },
        { name: 'Q: Question', time: 120, type: 'Study', instructions: 'Formulate questions based on the section headings. What do you expect to learn? What questions does the material pose?' },
        { name: 'R1: Read', time: 900, type: 'Exercise', instructions: 'Read the content actively, focusing on answering the questions you posed in the previous step. Read section by section.' },
        { name: 'R2: Recite', time: 600, type: 'Review', instructions: 'After reading a section, look away and orally summarize the key points in your own words. Check against the text to ensure accuracy.' },
        { name: 'R3: Review', time: 600, type: 'Review', instructions: 'Review your notes and original questions, confirming you can recall and understand all the material. Finish session.' },
      ]
    },
    {
      id: 8,
      title: 'Leitner System',
      category: 'Memory',
      icon: Star,
      description: 'Use spaced flashcards boxes that move as you master each card, focusing your review where it’s needed most.',
      benefits: ['Maximized retention', 'Targeted practice', 'Efficient study'],
      totalDurationSeconds: 20 * 60,
      steps: [
        { name: 'Box 1: Daily Review', time: 600, type: 'Study', instructions: 'Review cards in Box 1 (new cards/cards you failed yesterday). If correct, move to Box 2. If incorrect, keep in Box 1.' },
        { name: 'Box 2: Every 2 Days', time: 300, type: 'Study', instructions: 'Review Box 2 cards. If correct, move to Box 3. If incorrect, move back to Box 1.' },
        { name: 'Box 3: Every 4 Days', time: 180, type: 'Study', instructions: 'Review Box 3 cards. If correct, move to Box 4. If incorrect, move back to Box 1.' },
        { name: 'Box 4: Mastered', time: 120, type: 'Review', instructions: 'Review Box 4 cards (least frequent). If correct, move to Box 5 (or keep here). If incorrect, move back to Box 1.' },
        { name: 'Log & Finish', time: 0, type: 'Note', instructions: 'Update your physical or digital boxes and log your study session!' },
      ]
    },
    {
      id: 9,
      title: 'Note-Taking Styles',
      category: 'Organization',
      icon: BookOpen,
      description: 'Try Cornell, Mapping or Charting styles to summarize and clarify key points in your notes.',
      benefits: ['Better organization', 'More clarity', 'Quick review'],
      totalDurationSeconds: 15 * 60,
      steps: [
        { name: 'Select Method', time: 60, type: 'Start', instructions: 'Choose Cornell, Mapping, or Charting based on the lecture material (Cornell for linear, Mapping for complex concepts).' },
        { name: 'Setup Page', time: 120, type: 'Study', instructions: 'Format your page according to the chosen method (e.g., drawing columns/rows for Charting).' },
        { name: 'Active Listening/Reading', time: 600, type: 'Exercise', instructions: 'Take concise notes, using only key facts and short phrases. Use symbols to save time.' },
        { name: 'Review & Summarize', time: 180, type: 'Review', instructions: 'Immediately after the session, summarize the main points at the bottom of the page (especially key in Cornell style).' },
      ]
    },
    {
      id: 10,
      title: 'Visualization',
      category: 'Memory',
      icon: Brain,
      description: 'Create mental images for concepts or information you want to remember.',
      benefits: ['Enhanced recall', 'Creative memory', 'Faster learning'],
      totalDurationSeconds: 10 * 60,
      steps: [
        { name: 'Identify Concept', time: 60, type: 'Start', instructions: 'Select a dry or difficult concept to memorize (e.g., a mathematical formula or historical date).' },
        { name: 'Image Creation', time: 240, type: 'Exercise', instructions: 'Create a vivid, absurd, or emotional mental image to represent the concept. The stranger the image, the better.' },
        { name: 'Mental Walkthrough', time: 180, type: 'Review', instructions: 'Mentally "walk through" the image several times, associating each element with a piece of the concept.' },
        { name: 'Test & Recall', time: 120, type: 'Review', instructions: 'Close your eyes and try to recall the information by only recalling the visual image. Finish session.' },
      ]
    },
];

// --- Timer Utility Component (StudySession) ---
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
  
  const IconComponent = tip.icon;

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
  
  // NEW STATE: Tracks the tip selected for the interactive session
  const [selectedTip, setSelectedTip] = useState(null);

  // --- Pagination Setup ---
  const [currentPage, setCurrentPage] = useState(1);
  const tipsPerPage = 6;
  // --- End Pagination Setup ---

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
  const totalPages = Math.ceil(TIPS_DATA.length / tipsPerPage);
  const indexOfLastTip = currentPage * tipsPerPage;
  const indexOfFirstTip = indexOfLastTip - tipsPerPage;
  const currentTips = TIPS_DATA.slice(indexOfFirstTip, indexOfLastTip);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // --- End Pagination Logic ---
  
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTips.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <div
                key={tip.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tip.category)}`}>
                    {tip.category}
                  </span>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{tip.description}</p>
                  
                  <div className="border-t border-slate-200 pt-4 mt-auto">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Benefits:</p>
                    <ul className="space-y-1">
                      {tip.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    onClick={() => setSelectedTip(tip)} // NEW: Start Study Session
                  >
                    Start Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Pagination UI Upgrade */}
        <div className="flex justify-center items-center gap-2 mt-12">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-l-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
                Previous
            </button>
            
            {/* Page number button group */}
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 text-sm font-medium transition-colors 
                        ${currentPage === index + 1 
                            ? 'bg-cyan-600 text-white shadow-md' // Highlight color for Study Tips (Cyan)
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