import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, UtensilsCrossed, Clock, Users, ChefHat, Leaf, Play, Pause, Check, SkipForward, Flame, Trophy,Dumbbell, Info, List, ChevronLeft, Lock } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- HELPER: Format Time ---
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- HELPER: Embed URL ---
const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        if (url.includes('embed')) return url;
        if (url.includes('/shorts/')) return `https://www.youtube.com/embed/${url.split('/shorts/')[1]?.split('?')[0]}`;
        if (url.includes('v=')) return `https://www.youtube.com/embed/${url.split('v=')[1]?.split('&')[0]}`;
        if (url.includes('youtu.be')) return `https://www.youtube.com/embed/${url.split('/').pop()?.split('?')[0]}`;
    }
    return null; 
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

  // Get Macros
  const nutrition = details?.nutrition || { calories: 'N/A', protein: 'N/A', fats: 'N/A', carbs: 'N/A' };
  
  // Get Video
  const videoEmbed = getEmbedUrl(recipe.videoUrl);

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
      setIsRunning(false); 
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
    <div className="min-h-screen bg-slate-50 font-sans">
        {/* Header / Nav */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
            <button onClick={() => onBack(null)} className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Nutrition Kitchen</span>
            <div className="w-16"></div> 
        </div>

        <div className="max-w-6xl mx-auto p-6 md:p-12">
            
            {/* Title Section */}
            <div className="text-center mb-10">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide mb-3 inline-block">
                    {recipe.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">{recipe.title}</h1>
                <div className="flex justify-center gap-6 text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {recipe.durationMinutes || 15} min</span>
                    <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500"/> {nutrition.calories} kcal</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LEFT COL: Player & Ingredients */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Media / Video */}
                    <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
                        {videoEmbed ? (
                            <iframe className="w-full h-full" src={videoEmbed} title="Cooking Guide" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                                <UtensilsCrossed className="w-16 h-16 mb-4 opacity-50" />
                                <p className="font-medium">No video guide available.</p>
                            </div>
                        )}
                    </div>

                    {/* Blog Style Steps */}
                    {!isFinished ? (
                         <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Instructions</h3>
                            <div className="space-y-8">
                                {steps.map((step, index) => (
                                    <div key={index} className={`relative pl-8 border-l-2 ${index === stepIndex ? 'border-emerald-500' : 'border-slate-200'}`}>
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${index <= stepIndex ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}></div>
                                        <h4 className={`font-bold text-lg ${index === stepIndex ? 'text-emerald-700' : 'text-slate-800'}`}>Step {index + 1}: {step.name}</h4>
                                        <p className="text-slate-600 mt-2 leading-relaxed">{step.instructions}</p>
                                        
                                        {/* Active Step Timer Control */}
                                        {index === stepIndex && step.time > 0 && (
                                            <div className="mt-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-emerald-600" />
                                                    <span className="font-mono text-2xl font-bold text-emerald-800">{formatTime(secondsRemaining)}</span>
                                                </div>
                                                <button onClick={handleStartStop} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                                                    {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                                                    {isRunning ? 'Pause' : 'Start Timer'}
                                                </button>
                                            </div>
                                        )}

                                        {index === stepIndex && (
                                            <div className="mt-6 flex gap-3">
                                                <button onClick={handleNextStep} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                                                    Next Step <ChevronLeft className="w-4 h-4 rotate-180"/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                         </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-emerald-100">
                             <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-emerald-600" />
                             </div>
                             <h2 className="text-3xl font-black text-slate-900 mb-4">Meal Complete!</h2>
                             <p className="text-slate-500 mb-8 max-w-md mx-auto">Great job! You've cooked a healthy meal. We've logged this to your nutrition stats.</p>
                             <button onClick={handleComplete} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all">
                                Return to Kitchen
                             </button>
                        </div>
                    )}
                </div>

                {/* RIGHT COL: Nutrition & Ingredients */}
                <div className="space-y-6">
                    {/* Macros Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500"/> Nutrition Facts</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Protein</span>
                                <span className="font-black text-slate-900">{nutrition.protein}g</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Fats</span>
                                <span className="font-black text-slate-900">{nutrition.fats}g</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-yellow-50/50 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Carbs</span>
                                <span className="font-black text-slate-900">{nutrition.carbs}g</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-slate-400 text-sm">Total Calories</span>
                                <span className="font-black text-xl text-slate-900">{nutrition.calories}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-500"/> Ingredients</h3>
                        <ul className="space-y-3">
                            {details?.ingredients?.map((ing, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                                    {ing}
                                </li>
                            ))}
                            {(!details?.ingredients || details.ingredients.length === 0) && <li className="text-slate-400 italic text-sm">No ingredients listed.</li>}
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

  const handleOpenRecipe = (recipe) => {
      // Premium Check
      if (recipe.accessLevel === 'PREMIUM' && !user?.isPremium) {
          if(window.confirm("This recipe is exclusive to Premium members. Upgrade to unlock?")) navigate('/plans');
          return;
      }
      setSelectedRecipe(recipe);
  };

  if (selectedRecipe) {
      return <RecipeCookthrough recipe={selectedRecipe} onComplete={incrementRecipesTried} onBack={setSelectedRecipe} />;
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
          <p className="text-lg text-slate-500 leading-relaxed">Fuel your body with chef-curated, macro-friendly recipes.</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-4 no-scrollbar justify-center">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200 hover:text-emerald-600'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Recipe Grid */}
        {loading ? (
            <div className="text-center py-32 text-slate-400 animate-pulse">Loading recipes...</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.length > 0 ? filteredRecipes.map((recipe) => {
                // Safely parse details for preview stats
                let details = {};
                try { details = JSON.parse(recipe.details || '{}'); } catch(e) {}
                const cals = details?.nutrition?.calories || 'N/A';
                const protein = details?.nutrition?.protein || 'N/A';

                return (
                  <div key={recipe.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer" onClick={() => handleOpenRecipe(recipe)}>
                    <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center relative overflow-hidden">
                        {recipe.videoUrl ? (
                             <img src={`https://img.youtube.com/vi/${recipe.videoUrl.split('v=')[1]?.split('&')[0] || ''}/mqdefault.jpg`} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Recipe" />
                        ) : (
                             <div className="text-white opacity-80"><UtensilsCrossed className="w-16 h-16" /></div>
                        )}
                        {recipe.accessLevel === 'PREMIUM' && !user?.isPremium && (
                            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg flex items-center gap-1"><Lock className="w-3 h-3"/> PREMIUM</div>
                        )}
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">{recipe.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2">{recipe.description}</p>
                      
                      <div className="mt-auto flex items-center gap-4 text-xs font-bold text-slate-400">
                         <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500"/> {cals} kcal</span>
                         <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3 text-blue-500"/> {protein}g Protein</span>
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