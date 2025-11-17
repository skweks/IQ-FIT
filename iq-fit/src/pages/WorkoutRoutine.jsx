import { ArrowLeft, Dumbbell, Clock, Flame, Target } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

export function WorkoutRoutine() {
  const navigate = useNavigate();
  const { incrementWorkouts } = useAuth();

  const workouts = [
    {
      id: 1,
      title: 'Full Body Strength',
      duration: '45 min',
      calories: '350 kcal',
      difficulty: 'Intermediate',
      exercises: ['Squats', 'Push-ups', 'Deadlifts', 'Pull-ups'],
    },
    {
      id: 2,
      title: 'Cardio Blast',
      duration: '30 min',
      calories: '400 kcal',
      difficulty: 'Beginner',
      exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers', 'High Knees'],
    },
    {
      id: 3,
      title: 'Core & Abs',
      duration: '20 min',
      calories: '200 kcal',
      difficulty: 'Intermediate',
      exercises: ['Planks', 'Crunches', 'Russian Twists', 'Leg Raises'],
    },
    {
      id: 4,
      title: 'Upper Body Power',
      duration: '40 min',
      calories: '320 kcal',
      difficulty: 'Advanced',
      exercises: ['Bench Press', 'Rows', 'Shoulder Press', 'Dips'],
    },
    {
      id: 5,
      title: 'Leg Day',
      duration: '50 min',
      calories: '450 kcal',
      difficulty: 'Advanced',
      exercises: ['Lunges', 'Leg Press', 'Calf Raises', 'Leg Curls'],
    },
    {
      id: 6,
      title: 'Yoga Flow',
      duration: '35 min',
      calories: '180 kcal',
      difficulty: 'Beginner',
      exercises: ['Sun Salutation', 'Warrior Poses', 'Tree Pose', 'Child Pose'],
    },
    {
      id: 7,
      title: 'HIIT Circuit',
      duration: '25 min',
      calories: '300 kcal',
      difficulty: 'Intermediate',
      exercises: ['Jump Squats', 'Push-ups', 'Mountain Climbers', 'Burpees'],
    },
    {
      id: 8,
      title: 'Pilates Core',
      duration: '30 min',
      calories: '220 kcal',
      difficulty: 'Beginner',
      exercises: ['Roll-ups', 'Single Leg Stretch', 'Spine Twist', 'Saw'],
    },
    {
      id: 9,
      title: 'Boxing Drills',
      duration: '40 min',
      calories: '420 kcal',
      difficulty: 'Intermediate',
      exercises: ['Jab-Cross', 'Hooks', 'Uppercuts', 'Footwork'],
    },
    {
      id: 10,
      title: 'Stretching Routine',
      duration: '20 min',
      calories: '100 kcal',
      difficulty: 'Beginner',
      exercises: ['Hamstring Stretch', 'Quad Stretch', 'Shoulder Stretch', 'Neck Stretch'],
    },
    {
      id: 11,
      title: 'Kettlebell Workout',
      duration: '35 min',
      calories: '380 kcal',
      difficulty: 'Intermediate',
      exercises: ['Swings', 'Goblet Squats', 'Turkish Get-ups', 'Clean and Press'],
    },
    {
      id: 12,
      title: 'Tabata Training',
      duration: '20 min',
      calories: '280 kcal',
      difficulty: 'Advanced',
      exercises: ['Sprints', 'Jump Squats', 'Push-ups', 'Burpees'],
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
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
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Workout Routines</h1>
          </div>
          <p className="text-lg text-slate-600">Choose a workout plan that matches your fitness goals</p>
        </div>
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Your Weekly Progress</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Workouts This Week</p>
              <p className="text-3xl font-bold">Check Dashboard</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Duration</p>
              <p className="text-3xl font-bold">4h 20m</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Calories Burned</p>
              <p className="text-3xl font-bold">2,100</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Streak</p>
              <p className="text-3xl font-bold">7 Days</p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 h-32 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Dumbbell className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{workout.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{workout.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm">{workout.calories}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">{workout.exercises.length} exercises</span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Exercises:</p>
                  <div className="flex flex-wrap gap-2">
                    {workout.exercises.map((exercise, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  onClick={incrementWorkouts}
                >
                  Start Workout
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
