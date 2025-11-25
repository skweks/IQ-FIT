import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, UtensilsCrossed, Clock, Users, ChefHat, Leaf, Play, Pause, Check, SkipForward } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- Recipe Data ---
const RECIPES_DATA = [
  {
    id: 1,
    title: 'Grilled Chicken Salad',
    category: 'Lunch',
    prepTime: '20 min',
    servings: 2,
    calories: '350 kcal',
    type: 'High Protein',
    ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Olive oil', 'Lemon juice'],
    totalDurationSeconds: 20 * 60,
    steps: [
      { name: 'Prep Chicken & Marinade', time: 300, type: 'Prep', instructions: 'Cut chicken into strips and marinate with olive oil, lemon juice, salt, and pepper.' },
      { name: 'Grill Chicken', time: 600, type: 'Cook', instructions: 'Grill chicken strips for 5-7 minutes per side until fully cooked (internal temp of 165°F).' },
      { name: 'Prep Vegetables', time: 180, type: 'Prep', instructions: 'Wash and chop mixed greens and slice cherry tomatoes in half.' },
      { name: 'Assemble Salad', time: 120, type: 'Prep', instructions: 'Combine greens, tomatoes, and grilled chicken in a bowl. Drizzle with remaining marinade or dressing.' },
      { name: 'Serve & Log', time: 0, type: 'Note', instructions: 'The recipe is complete. Enjoy your healthy meal!' },
    ]
  },
  {
    id: 2,
    title: 'Protein Smoothie Bowl',
    category: 'Breakfast',
    prepTime: '10 min',
    servings: 1,
    calories: '280 kcal',
    type: 'High Protein',
    ingredients: ['Banana', 'Protein powder', 'Almond milk', 'Berries', 'Granola'],
    totalDurationSeconds: 10 * 60,
    steps: [
      { name: 'Gather Ingredients', time: 60, type: 'Prep', instructions: 'Gather all ingredients: frozen banana, protein powder, almond milk, and toppings (berries, granola).' },
      { name: 'Blend Base', time: 180, type: 'Cook', instructions: 'Blend banana, protein powder, and almond milk until smooth and thick. Use minimal liquid.' },
      { name: 'Pour and Top', time: 120, type: 'Prep', instructions: 'Pour the smoothie base into a bowl. Arrange berries and granola neatly on top.' },
      { name: 'Serve & Log', time: 0, type: 'Note', instructions: 'Enjoy this quick and nutrient-dense breakfast!' },
    ]
  },
  {
    id: 3,
    title: 'Quinoa Buddha Bowl',
    category: 'Dinner',
    prepTime: '30 min',
    servings: 2,
    calories: '420 kcal',
    type: 'Vegetarian',
    ingredients: ['Quinoa', 'Roasted vegetables', 'Chickpeas', 'Tahini', 'Avocado'],
    totalDurationSeconds: 30 * 60,
    steps: [
      { name: 'Cook Quinoa', time: 900, type: 'Cook', instructions: 'Rinse 1 cup of quinoa. Cook with 2 cups of water for 15 minutes, then let rest covered for 5 minutes.' },
      { name: 'Roast Veggies', time: 120, type: 'Prep', instructions: 'Toss vegetables (broccoli, sweet potato) with oil and spices. Place them in the oven to roast (or skip if pre-roasted).' },
      { name: 'Prepare Dressing', time: 120, type: 'Prep', instructions: 'Whisk tahini, lemon juice, garlic, and water for the dressing.' },
      { name: 'Assemble Bowl', time: 120, type: 'Prep', instructions: 'Combine quinoa, roasted vegetables, chickpeas, and sliced avocado. Drizzle dressing over the top.' },
      { name: 'Serve & Log', time: 0, type: 'Note', instructions: 'Your healthy vegetarian dinner is ready!' },
    ]
  },
  {
    id: 4,
    title: 'Green Detox Juice',
    category: 'Beverage',
    prepTime: '5 min',
    servings: 1,
    calories: '120 kcal',
    type: 'Low Calorie',
    ingredients: ['Spinach', 'Cucumber', 'Green apple', 'Lemon', 'Ginger'],
    totalDurationSeconds: 5 * 60,
    steps: [
      { name: 'Wash Produce', time: 60, type: 'Prep', instructions: 'Thoroughly wash all spinach, cucumber, and apple.' },
      { name: 'Chop & Load', time: 120, type: 'Prep', instructions: 'Roughly chop produce and load into the blender/juicer, adding peeled lemon and ginger.' },
      { name: 'Blend/Juice', time: 120, type: 'Cook', instructions: 'Blend or juice until smooth. Add water if necessary for desired consistency.' },
      { name: 'Serve & Log', time: 0, type: 'Note', instructions: 'Pour over ice and enjoy immediately.' },
    ]
  },
  {
    id: 5,
    title: 'Salmon with Asparagus',
    category: 'Dinner',
    prepTime: '25 min',
    servings: 2,
    calories: '480 kcal',
    type: 'High Protein',
    ingredients: ['Salmon fillet', 'Asparagus', 'Garlic', 'Lemon', 'Olive oil'],
    totalDurationSeconds: 25 * 60,
    steps: [
      { name: 'Season Salmon', time: 120, type: 'Prep', instructions: 'Pat salmon dry. Season generously with salt, pepper, and garlic powder.' },
      { name: 'Prep Asparagus', time: 180, type: 'Prep', instructions: 'Snap the woody ends off the asparagus and toss with olive oil and a pinch of salt.' },
      { name: 'Sear Salmon', time: 300, type: 'Cook', instructions: 'Sear the salmon skin-side down in a hot pan for 4-5 minutes until crispy.' },
      { name: 'Oven Finish', time: 480, type: 'Cook', instructions: 'Transfer salmon and asparagus to a preheated oven (400°F). Bake until salmon reaches desired doneness (145°F).' },
      { name: 'Serve & Log', time: 0, type: 'Note', instructions: 'Squeeze fresh lemon juice over the fish and asparagus before eating.' },
    ]
  },
  {
    id: 6,
    title: 'Energy Balls',
    category: 'Snack',
    prepTime: '15 min',
    servings: 12,
    calories: '90 kcal',
    type: 'Healthy Snack',
    ingredients: ['Dates', 'Almonds', 'Cocoa powder', 'Coconut flakes', 'Honey'],
    totalDurationSeconds: 15 * 60,
    steps: [
      { name: 'Blend Base', time: 300, type: 'Prep', instructions: 'In a food processor, blend dates and almonds until they form a coarse paste.' },
      { name: 'Mix Ingredients', time: 180, type: 'Prep', instructions: 'Add cocoa powder and honey to the processor. Blend until the mixture forms a sticky dough.' },
      { name: 'Roll Balls', time: 360, type: 'Prep', instructions: 'Roll the mixture into small, bite-sized balls. Roll them in coconut flakes for coating.' },
      { name: 'Chill & Log', time: 0, type: 'Note', instructions: 'Chill the balls in the refrigerator for 30 minutes before serving. Enjoy as a healthy snack!' },
    ]
  },
];
// --- End Recipe Data ---

// --- Cookthrough Utility Component (RecipeCookthrough) ---
const RecipeCookthrough = ({ recipe, onComplete, onBack }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(recipe.steps[0].time);
    
    const currentStep = recipe.steps[stepIndex];
    const isFinished = stepIndex >= recipe.steps.length;
  
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
      if (stepIndex < recipe.steps.length - 1) {
          setStepIndex(stepIndex + 1);
          setIsRunning(false);
      } else if (!isFinished) {
          setStepIndex(recipe.steps.length);
          setIsRunning(false);
      }
    }, [stepIndex, recipe.steps.length, isFinished]);
  
    const handleStartStop = () => {
      if (isFinished) {
        setStepIndex(0);
        setSecondsRemaining(recipe.steps[0].time);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-6">
          <div className="max-w-4xl mx-auto">
              <button
                onClick={() => onBack(null)}
                className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors mb-6 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Recipes
              </button>
              
              <div className="grid lg:grid-cols-2 gap-8">
                  {/* Timer and Instructions Column */}
                  <div className="bg-white rounded-3xl shadow-2xl p-8 h-fit lg:sticky lg:top-12">
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">{recipe.title}</h2>
                      <p className="text-lg text-slate-600 mb-6">Interactive Cookthrough</p>
  
                      {isFinished ? (
                          <div className="text-center py-10">
                            <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-green-600 mb-4">Recipe Finished!</h3>
                            <p className="text-slate-700 mb-6">Log your successful recipe cookthrough.</p>
                            <button
                              onClick={handleComplete}
                              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Check className="w-5 h-5" />
                              Log & Finish Meal
                            </button>
                          </div>
                      ) : (
                          <>
                              {/* Current Step and Timer */}
                              <div className="mb-6 p-4 rounded-xl border-2 border-green-200 bg-green-50">
                                  <p className="text-sm font-semibold uppercase text-slate-500">Current Step ({currentStep.type})</p>
                                  <h3 className="text-xl font-bold text-green-700">{currentStep.name}</h3>
                              </div>
                              
                              {/* Step Instructions */}
                              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                  <p className="text-sm font-semibold text-slate-700 mb-2">Instructions:</p>
                                  <p className="text-slate-600 italic">{currentStep.instructions}</p>
                              </div>
  
                              {/* Timer Display */}
                              <div className={`text-center p-8 rounded-2xl mb-8 transition-colors duration-500 
                                  ${currentStep.type === 'Cook' ? 'bg-orange-100 shadow-lg border-2 border-orange-300' : 'bg-green-100 shadow-lg border-2 border-green-300'}`}>
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
                                        : 'bg-green-600 hover:bg-green-700'} 
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
                              <p className="text-center text-sm text-slate-500">Step {stepIndex + 1} of {recipe.steps.length}</p>
                          </>
                      )}
                  </div>
                  
                  {/* Full Plan Column */}
                  <div className="bg-white rounded-3xl shadow-2xl p-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <UtensilsCrossed className="w-6 h-6 text-green-600" />
                          Full Recipe Steps
                      </h3>
                      <ul className="space-y-4">
                          {recipe.steps.map((step, index) => (
                              <li 
                                  key={index} 
                                  className={`p-4 rounded-xl transition-all duration-300 border 
                                      ${index === stepIndex 
                                          ? 'bg-green-100 border-green-400 shadow-md transform scale-[1.02]'
                                          : index < stepIndex 
                                          ? 'bg-blue-50 border-blue-200 text-slate-500 line-through opacity-70'
                                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                      }`
                                  }
                              >
                                  <div className="flex justify-between items-center">
                                      <p className={`font-semibold ${index === stepIndex ? 'text-green-800' : 'text-slate-800'}`}>
                                          {index + 1}. {step.name}
                                      </p>
                                      <span className={`text-sm px-2 py-1 rounded-full ${step.type === 'Cook' ? 'bg-orange-200 text-orange-800' : 'bg-cyan-200 text-cyan-800'}`}>
                                          {step.time > 0 ? formatTime(step.time) : step.type}
                                      </span>
                                  </div>
                                  {(index === stepIndex && step.type !== 'Note') && (
                                      <p className="text-xs text-slate-600 italic mt-1">
                                          {step.instructions}
                                      </p>
                                  )}
                                  {index < stepIndex && (
                                      <Check className="w-4 h-4 text-blue-600 inline-block mr-1" />
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
// --- End Cookthrough Utility Component (RecipeCookthrough) ---


export const FoodRecipes = () => {
  const navigate = useNavigate();
  const { incrementRecipesTried } = useAuth();
  
  // NEW STATE: Tracks the recipe selected for the interactive session
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // --- Pagination Setup ---
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 3; // Set to 3 items per page for 2 pages
  // --- End Pagination Setup ---

  const getTypeColor = (type) => {
    const colors = {
      'High Protein': 'bg-blue-100 text-blue-700',
      'Vegetarian': 'bg-green-100 text-green-700',
      'Low Calorie': 'bg-cyan-100 text-cyan-700',
      'Healthy Snack': 'bg-yellow-100 text-yellow-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };

  const getCategoryIcon = () => {
    return UtensilsCrossed;
  };
  
  // --- Pagination Logic ---
  const totalPages = Math.ceil(RECIPES_DATA.length / recipesPerPage);
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = RECIPES_DATA.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // --- End Pagination Logic ---
  
  // Render the Recipe Cookthrough view if a recipe is selected
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
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-3 rounded-xl">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Food Recipes & Beverages</h1>
          </div>
          <p className="text-lg text-slate-600">Delicious and nutritious recipes to fuel your body</p>
        </div>
        <div className="mb-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Your Nutrition Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-green-100 text-sm mb-1">Recipes Tried</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Favorite Meals</p>
              <p className="text-3xl font-bold">8</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Avg Calories/Day</p>
              <p className="text-3xl font-bold">1,850</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Healthy Days</p>
              <p className="text-3xl font-bold">21</p>
            </div>
          </div>
        </div>
        
        {/* Card Layout with Pagination */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecipes.map((recipe) => {
            const IconComponent = getCategoryIcon();
            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group flex flex-col h-full"
              >
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 h-32 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IconComponent className="w-16 h-16 text-white" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{recipe.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(recipe.type)}`}>
                      {recipe.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <ChefHat className="w-4 h-4" />
                    <span>{recipe.category}</span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Leaf className="w-4 h-4" />
                      <span className="text-sm">{recipe.calories}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Main Ingredients:</p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all mt-auto"
                    onClick={() => setSelectedRecipe(recipe)} // NEW: Start Cookthrough
                  >
                    View Recipe
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
                            ? 'bg-green-600 text-white shadow-md' // Highlight color for Food Recipes (Green)
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

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Nutrition Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Eat the Rainbow</h3>
                <p className="text-sm text-slate-600">Include colorful fruits and vegetables for diverse nutrients.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Portion Control</h3>
                <p className="text-sm text-slate-600">Pay attention to serving sizes to maintain a balanced diet.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Meal Timing</h3>
                <p className="text-sm text-slate-600">Eat at regular intervals to maintain energy levels throughout the day.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Cook at Home</h3>
                <p className="text-sm text-slate-600">Preparing meals at home gives you control over ingredients and portions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};