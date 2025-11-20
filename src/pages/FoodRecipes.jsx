import { ArrowLeft, UtensilsCrossed, Clock, Users, ChefHat, Leaf } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export const FoodRecipes = () => {
  const navigate = useNavigate();

  const recipes = [
    {
      id: 1,
      title: 'Grilled Chicken Salad',
      category: 'Lunch',
      prepTime: '20 min',
      servings: 2,
      calories: '350 kcal',
      type: 'High Protein',
      ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Olive oil', 'Lemon juice'],
      image: 'salad',
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
      image: 'smoothie',
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
      image: 'bowl',
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
      image: 'juice',
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
      image: 'salmon',
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
      image: 'balls',
    },
  ];

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => {
            const IconComponent = getCategoryIcon();
            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 h-32 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IconComponent className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
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
                  <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                    View Recipe
                  </button>
                </div>
              </div>
            );
          })}
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
