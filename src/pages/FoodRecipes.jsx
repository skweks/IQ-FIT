import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, UtensilsCrossed, Clock, Users, ChefHat, Leaf, Play, Pause, Check, SkipForward, Flame, Dumbbell, Trophy, Info, List } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- HELPER: Format Time ---
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- COOKTHROUGH PLAYER COMPONENT ---
const RecipeCookthrough = ({ recipe, onComplete, onBack }) => {
  // Parse details from JSON if it's a string (from DB) or object (local)
  const details = typeof recipe.details === 'string' ? JSON.parse(recipe.details || '{}') : recipe.details;
  
  // Fallback data if details are missing
  const steps = details?.steps || [
      { name: 'Preparation', time: 300, type: 'Prep', instructions: 'Gather your ingredients.' },
      { name: 'Cooking', time: 900, type: 'Cook', instructions: 'Follow the cooking instructions.' }
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(steps[0]?.time || 0);
  
  const currentStep = steps[stepIndex];
  const isFinished = stepIndex >= steps.length;

  // Timer Hook
  useEffect(() => {
    let interval = null;
    if (isRunning && secondsRemaining > 0 && !isFinished) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && !isFinished) {
      setIsRunning(false);
      // Optional: Auto-advance or wait for user? Let's stop at 0 for recipes so food doesn't burn.
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, isFinished]);
  
  // Update timer on step change
  useEffect(() => {
    if (!isFinished && currentStep) {
      setSecondsRemaining(currentStep.time);
      setIsRunning(false); // Default to paused for safety in cooking
    }
  }, [stepIndex, isFinished, currentStep]);

  const handleNextStep = useCallback(() => {
    if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
    } else if (!isFinished) {
        setStepIndex(steps.length);
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
  
  const handleSkip = () => handleNextStep();

  const handleComplete = () => {
    if (isFinished) {
      onComplete();
      onBack(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
            <button
              onClick={() => onBack(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Quit Cooking
            </button>
            
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Active Step Column */}
                <div className="bg-white rounded-3xl shadow-xl p-8 h-fit lg:sticky lg:top-12 text-center border border-slate-100">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{recipe.title}</h2>
                    <p className="text-lg text-slate-500 mb-8 font-medium">Interactive Cook Mode</p>
  
                    {isFinished ? (
                        <div className="py-10 animate-in zoom-in duration-300">
                          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                             <Check className="w-12 h-12 text-green-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-4">Bon Appétit!</h3>
                          <p className="text-slate-500 mb-8">You've completed this recipe. Don't forget to log it!</p>
                          <button
                            onClick={handleComplete}
                            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                          >
                            <Check className="w-5 h-5" />
                            Finish & Log Meal
                          </button>
                        </div>
                    ) : (
                        <>
                            {/* Current Step Card */}
                            <div className="mb-6 p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Current Step: {currentStep?.type}</p>
                                <h3 className="text-2xl font-bold text-slate-800">{currentStep?.name}</h3>
                            </div>
                            
                            {/* Instructions */}
                            <div className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                                <div className="flex items-center gap-2 mb-3 text-slate-400">
                                    <ChefHat className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Instructions</span>
                                </div>
                                <p className="text-slate-700 text-lg leading-relaxed font-medium">{currentStep?.instructions}</p>
                            </div>
  
                            {/* Timer */}
                            <div className={`relative w-full py-10 rounded-3xl mb-8 transition-all duration-500 ${isRunning ? 'bg-orange-50 border-2 border-orange-100' : 'bg-slate-100'}`}>
                                <p className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Time Remaining</p>
                                <div className={`text-7xl font-black font-mono tracking-tighter ${isRunning ? 'text-orange-500' : 'text-slate-400'}`}>
                                  {formatTime(secondsRemaining)}
                                </div>
                            </div>
                            
                            {/* Controls */}
                            <div className="flex gap-4 mb-6">
                              <button
                                onClick={handleStartStop}
                                disabled={secondsRemaining === 0 && !isFinished || currentStep?.type === 'Note' || currentStep?.time === 0}
                                className={`flex-1 py-4 text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 
                                  ${isRunning 
                                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'} 
                                  disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                                {isRunning ? 'Pause Timer' : 'Start Timer'}
                              </button>
                               <button
                                  onClick={handleSkip}
                                  className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                              >
                                  <SkipForward className="w-6 h-6" />
                              </button>
                            </div>
                            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Step {stepIndex + 1} of {steps.length}</p>
                        </>
                    )}
                </div>
                
                {/* Full Recipe Details Column */}
                <div className="space-y-6">
                    {/* Ingredients Card */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-emerald-500" />
                            Ingredients Needed
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {details?.ingredients?.map((ing, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                                    {ing}
                                </span>
                            ))}
                            {(!details?.ingredients || details.ingredients.length === 0) && <p className="text-slate-400 text-sm italic">No ingredients listed.</p>}
                        </div>
                    </div>

                    {/* Roadmap */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <List className="w-5 h-5 text-emerald-500" />
                            Recipe Steps
                        </h3>
                        <ul className="space-y-3">
                            {steps.map((step, index) => (
                                <li 
                                    key={index} 
                                    className={`p-4 rounded-xl transition-all duration-300 border flex justify-between items-center group
                                        ${index === stepIndex 
                                            ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100'
                                            : index < stepIndex 
                                            ? 'bg-slate-50 border-slate-100 text-slate-400'
                                            : 'bg-white border-slate-100'
                                        }`
                                    }
                                >
                                    <div>
                                        <p className={`font-bold text-sm ${index === stepIndex ? 'text-emerald-900' : 'text-slate-700'}`}>
                                            {index + 1}. {step.name}
                                        </p>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">{step.type}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${index === stepIndex ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                            {step.time > 0 ? formatTime(step.time) : '-'}
                                        </span>
                                        {index < stepIndex && <Check className="w-4 h-4 text-emerald-500" />}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
// --- End Cookthrough Component ---


// --- MAIN FOOD RECIPES PAGE ---
export const FoodRecipes = () => {
  const navigate = useNavigate();
  const { user, incrementRecipesTried } = useAuth();
  
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;
  
  // Filter State
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const CATEGORIES = ['ALL', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Smoothie', 'High Protein'];

  // FETCH FROM BACKEND
  useEffect(() => {
    fetch('http://localhost:8080/api/content/search?type=RECIPE')
        .then(res => res.json())
        .then(data => {
            setRecipes(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, []);

  const getTypeColor = (type) => {
    const colors = {
      'High Protein': 'bg-blue-100 text-blue-700',
      'Vegetarian': 'bg-green-100 text-green-700',
      'Low Calorie': 'bg-cyan-100 text-cyan-700',
      'Healthy Snack': 'bg-yellow-100 text-yellow-700',
      'Vegan': 'bg-emerald-100 text-emerald-700',
      'Gluten Free': 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };
  
  // Filter Logic
  const filteredRecipes = selectedCategory === 'ALL' 
    ? recipes 
    : recipes.filter(r => r.category === selectedCategory);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (selectedRecipe) {
    return (
      <RecipeCookthrough 
        recipe={selectedRecipe} 
        onComplete={incrementRecipesTried} 
        onBack={setSelectedRecipe}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-10 font-bold bg-white px-4 py-2 rounded-full w-fit shadow-sm border border-slate-200 hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 shadow-sm">
             <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Nutrition Kitchen</h1>
          <p className="text-lg text-slate-500 leading-relaxed">Discover healthy, high-protein meals designed to fuel your workouts and recovery.</p>
        </div>

        {/* Stats Bar */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
                { label: 'Recipes Available', val: recipes.length, icon: UtensilsCrossed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Avg Calories', val: '450', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'High Protein', val: recipes.filter(r => r.category === 'High Protein').length, icon: Dumbbell, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Prep Time (Avg)', val: '15m', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-xl font-black text-slate-900">{stat.val}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar justify-center">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200 hover:text-emerald-600'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
        
        {loading ? (
            <div className="text-center py-32 text-slate-400 animate-pulse">Loading delicious recipes...</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentRecipes.length > 0 ? currentRecipes.map((recipe) => {
                // Parse details safely
                let details = {};
                try {
                    details = typeof recipe.details === 'string' ? JSON.parse(recipe.details || '{}') : recipe.details;
                } catch(e) {}
                
                const prepTime = details?.prepTime || '15 min';
                const calories = details?.calories || '300 kcal';
                const servings = details?.servings || 1;
                const ingredients = details?.ingredients || [];

                return (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center relative overflow-hidden">
                        {recipe.videoUrl ? (
                             <img src={recipe.videoUrl} alt={recipe.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" onError={(e) => e.target.style.display='none'} />
                        ) : (
                             <div className="text-white opacity-80 group-hover:scale-110 transition-transform duration-500">
                                 <UtensilsCrossed className="w-16 h-16" />
                             </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-emerald-700 shadow-lg">
                            {recipe.difficultyLevel || 'EASY'}
                        </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black text-slate-900 leading-tight">{recipe.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-6">
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Clock className="w-3 h-3" /> {prepTime}</span>
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Flame className="w-3 h-3" /> {calories}</span>
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Users className="w-3 h-3" /> {servings}</span>
                      </div>
                      
                      <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-2">{recipe.description}</p>
                      
                      <div className="mt-auto">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Ingredients</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {ingredients.slice(0, 3).map((ing, i) => (
                            <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold border border-emerald-100">
                              {ing}
                            </span>
                          ))}
                          {ingredients.length > 3 && <span className="px-2 py-1 text-xs text-slate-400">+{ingredients.length - 3} more</span>}
                        </div>
                        
                        <button 
                          className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-600"
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          <Play className="w-4 h-4 fill-current" /> Start Cooking
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                 <div className="col-span-full py-20 text-center">
                    <div className="inline-block p-6 bg-slate-50 rounded-full mb-4"><UtensilsCrossed className="w-12 h-12 text-slate-300" /></div>
                    <h3 className="text-lg font-bold text-slate-900">No Recipes Found</h3>
                    <p className="text-slate-500 mb-6">Try selecting a different category.</p>
                    <button onClick={() => setSelectedCategory('ALL')} className="text-emerald-600 font-bold hover:underline">View All Recipes</button>
                 </div>
              )}
            </div>
        )}
        
        {/* Pagination UI */}
        {filteredRecipes.length > recipesPerPage && (
            <div className="flex justify-center items-center gap-2 mt-16">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                    Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all
                            ${currentPage === index + 1 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110' 
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }
                        `}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                    Next
                </button>
            </div>
        )}
      </div>
    </div>
  );
};