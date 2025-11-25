import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Dumbbell, Clock, Flame, Target, Play, Pause, RefreshCw, Check, SkipForward } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- Workout Data Updated with detailed steps ---
const WORKOUT_DATA = [
  {
    id: 1,
    title: 'Full Body Strength',
    duration: '45 min',
    calories: '350 kcal',
    difficulty: 'Intermediate',
    exercises: ['Squats', 'Push-ups', 'Deadlifts', 'Pull-ups'],
    totalDurationSeconds: 45 * 60,
    steps: [
      { name: 'Warm-up', time: 300, type: 'Rest', instructions: 'Perform dynamic stretches: arm circles, leg swings, trunk twists. Get your heart rate up gently.' }, // 5 min
      { name: 'Squats (3 sets of 10 reps)', time: 60, type: 'Exercise', instructions: 'Feet shoulder-width apart, keep your back straight, and push your hips back. Focus on depth and form.' },
      { name: 'Rest', time: 60, type: 'Rest', instructions: 'Grab some water and prepare for the next exercise. Focus on slow, deep breaths.' },
      { name: 'Push-ups (3 sets of 10 reps)', time: 60, type: 'Exercise', instructions: 'Hands slightly wider than shoulder-width. Keep your body in a straight line from head to heels. Lower your chest toward the floor.' },
      { name: 'Rest', time: 60, type: 'Rest', instructions: 'Quick break! Shake out your arms and shoulders. Focus on recovery.' },
      { name: 'Deadlifts (3 sets of 8 reps)', time: 90, type: 'Exercise', instructions: 'Maintain a flat back. Lift the weight by pushing through your heels, squeezing your glutes at the top. Lower slowly and with control.' },
      { name: 'Rest', time: 60, type: 'Rest', instructions: 'Hydrate and check your heart rate. Only two exercises remaining!' },
      { name: 'Pull-ups (3 sets of 5 reps)', time: 60, type: 'Exercise', instructions: 'Grip bar slightly wider than shoulder width. Pull your chest toward the bar, leading with your elbows. Use a band if necessary.' },
      { name: 'Cool-down & Stretch', time: 600, type: 'Rest', instructions: 'Finish strong with static stretches. Hold each stretch for 30 seconds. Focus on the major muscle groups used (quads, hamstrings, chest).' }, // 10 min
    ]
  },
  {
    id: 2,
    title: 'Cardio Blast',
    duration: '30 min',
    calories: '400 kcal',
    difficulty: 'Beginner',
    exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers', 'High Knees'],
    totalDurationSeconds: 30 * 60,
    steps: [
      { name: 'Warm-up stretch', time: 180, type: 'Rest', instructions: 'Light cardio for 3 minutes (e.g., fast walking or marching in place). Dynamic leg and arm stretches.' },
      { name: 'Jumping Jacks', time: 45, type: 'Exercise', instructions: 'Full range of motion, fast pace. Focus on coordination and breathing.' },
      { name: 'Rest', time: 15, type: 'Rest', instructions: 'Transition quickly to the next exercise. Get ready!' },
      { name: 'Burpees', time: 45, type: 'Exercise', instructions: 'Full burpees, focusing on the explosive jump and landing softly.' },
      { name: 'Rest', time: 15, type: 'Rest', instructions: 'Quick 15 seconds! Deep breaths in, deep breaths out.' },
      { name: 'Mountain Climbers', time: 45, type: 'Exercise', instructions: 'Keep your hips low and stable. Drive your knees rapidly towards your chest.' },
      { name: 'Rest', time: 15, type: 'Rest', instructions: 'Don\'t stop now! Prepare for the final movement of this round.' },
      { name: 'High Knees', time: 45, type: 'Exercise', instructions: 'Bring your knees up to hip height. Engage your core for stability.' },
      { name: 'Repeat Circuit 4x', time: 0, type: 'Note', instructions: 'You have completed one round. Take a 60 second break and then repeat the circuit (Jumping Jacks to High Knees) three more times!' },
    ]
  },
  {
      id: 3,
      title: 'Core & Abs',
      duration: '20 min',
      calories: '200 kcal',
      difficulty: 'Intermediate',
      exercises: ['Planks', 'Crunches', 'Russian Twists', 'Leg Raises'],
      totalDurationSeconds: 20 * 60,
      steps: [
        { name: 'Elbow Plank', time: 60, type: 'Exercise', instructions: 'Hold a perfect straight line from head to heels. Squeeze your core and glutes. Do not let your hips sag.' },
        { name: 'Rest', time: 30, type: 'Rest', instructions: 'Short break. Roll onto your back for the next core exercise.' },
        { name: 'Standard Crunches', time: 45, type: 'Exercise', instructions: 'Focus on contracting your abs to lift your shoulders slightly off the mat. Keep your neck relaxed.' },
        { name: 'Rest', time: 30, type: 'Rest', instructions: 'Good work! Next is a dynamic movement.' },
        { name: 'Russian Twists', time: 60, type: 'Exercise', instructions: 'Lean back slightly, keep your back straight, and twist your torso side to side. Use a weight if desired.' },
        { name: 'Rest', time: 30, type: 'Rest', instructions: 'Hydrate and get ready for the final isolation move.' },
        { name: 'Hanging Leg Raises', time: 45, type: 'Exercise', instructions: 'Hanging from a bar, raise your legs as high as possible using your lower abs. Control the descent.' },
        { name: 'Repeat 3 circuits', time: 0, type: 'Note', instructions: 'You have completed 1 of 3 circuits. Rest for 90 seconds, then start again from the Elbow Plank.' },
      ]
    },
    {
      id: 4,
      title: 'Upper Body Power',
      duration: '40 min',
      calories: '320 kcal',
      difficulty: 'Advanced',
      exercises: ['Bench Press', 'Rows', 'Shoulder Press', 'Dips'],
      totalDurationSeconds: 40 * 60,
      steps: [
        { name: 'Rotator Cuff Warm-up', time: 180, type: 'Rest', instructions: 'Perform band pull-aparts and external rotations for 3 minutes to prime the shoulders for heavy lifting.' },
        { name: 'Bench Press (4 sets of 5 reps)', time: 120, type: 'Exercise', instructions: 'Keep your shoulder blades pinched and feet firmly on the ground. Explode up and control the negative phase. Use a spotter.' },
        { name: 'Rest', time: 120, type: 'Rest', instructions: 'Long rest here, focus on maximum recovery for strength.' },
        { name: 'Barbell Rows (4 sets of 8 reps)', time: 90, type: 'Exercise', instructions: 'Maintain a 45-degree back angle. Pull the bar towards your lower chest/abs, squeezing your back muscles.' },
        { name: 'Rest', time: 90, type: 'Rest', instructions: 'Focus on your posture before the next lift.' },
        { name: 'Shoulder Press (3 sets of 10 reps)', time: 60, type: 'Exercise', instructions: 'Press vertically, keeping the weight slightly in front of your head. Control the descent to protect the shoulders.' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: 'Final break before the finisher!' },
        { name: 'Triceps Dips (3 sets to failure)', time: 45, type: 'Exercise', instructions: 'Keep your elbows tucked close to your body. Only lower until your elbows are at 90 degrees to protect your joints.' },
        { name: 'Cool-down', time: 300, type: 'Rest', instructions: 'Static stretch your chest, shoulders, and triceps. Focus on deep breathing.' },
      ]
    },
    {
      id: 5,
      title: 'Leg Day',
      duration: '50 min',
      calories: '450 kcal',
      difficulty: 'Advanced',
      exercises: ['Lunges', 'Leg Press', 'Calf Raises', 'Leg Curls'],
      totalDurationSeconds: 50 * 60,
      steps: [
        { name: 'Dynamic Leg Warm-up', time: 300, type: 'Rest', instructions: 'Leg swings, bodyweight squats, and lateral lunges. Prepare your hips and knees for heavy load.' },
        { name: 'Barbell Lunges (3 sets of 12 per leg)', time: 120, type: 'Exercise', instructions: 'Ensure your knee tracks over your ankle. Push off the front heel to activate the glute and quad.' },
        { name: 'Rest', time: 90, type: 'Rest', instructions: 'Deep breaths. Keep blood flow active by walking lightly.' },
        { name: 'Leg Press (4 sets of 10 reps)', time: 90, type: 'Exercise', instructions: 'Place your feet wide on the plate. Control the negative and drive through your midfoot.' },
        { name: 'Rest', time: 120, type: 'Rest', instructions: 'Focus on stretching your quads gently during this recovery period.' },
        { name: 'Standing Calf Raises (4 sets of 15 reps)', time: 60, type: 'Exercise', instructions: 'Use a full range of motion. Hold the contraction at the top for 1 second.' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: 'Final rest before the hamstring work.' },
        { name: 'Lying Leg Curls (3 sets of 12 reps)', time: 90, type: 'Exercise', instructions: 'Slow and controlled movement. Focus on the peak contraction in your hamstrings.' },
        { name: 'Cool-down stretch', time: 600, type: 'Rest', instructions: 'Hold passive stretches for hamstrings, quads, and calves for 45 seconds each.' },
      ]
    },
    {
      id: 6,
      title: 'Yoga Flow',
      duration: '35 min',
      calories: '180 kcal',
      difficulty: 'Beginner',
      exercises: ['Sun Salutation', 'Warrior Poses', 'Tree Pose', 'Child Pose'],
      totalDurationSeconds: 35 * 60,
      steps: [
        { name: 'Centering', time: 120, type: 'Rest', instructions: 'Start sitting comfortably. Close your eyes and focus on your breath. Set an intention for the practice.' },
        { name: 'Sun Salutation (Surya Namaskar)', time: 600, type: 'Exercise', instructions: 'Flow through 5 rounds of Sun Salutations. Move fluidly with your breath, inhaling to lengthen, exhaling to fold.' },
        { name: 'Warrior Series (Left)', time: 300, type: 'Exercise', instructions: 'Hold Warrior I, II, and Reverse Warrior on the left side. Sink deep into your front knee and square your hips.' },
        { name: 'Warrior Series (Right)', time: 300, type: 'Exercise', instructions: 'Repeat the Warrior sequence on the right side. Focus on finding balance and strength.' },
        { name: 'Tree Pose (Vrikshasana)', time: 180, type: 'Rest', instructions: 'Practice balance by holding Tree Pose on both sides for 90 seconds each. Find a fixed point (drishti) for focus.' },
        { name: 'Child\'s Pose (Balasana)', time: 180, type: 'Rest', instructions: 'Relax deeply in Child\'s Pose. Let your forehead rest on the mat and release tension from your back and shoulders.' },
        { name: 'Savasana (Final Rest)', time: 600, type: 'Rest', instructions: 'Lie flat on your back, palms up. Allow your body to completely surrender and integrate the benefits of the practice.' },
      ]
    },
    {
      id: 7,
      title: 'HIIT Circuit',
      duration: '25 min',
      calories: '300 kcal',
      difficulty: 'Intermediate',
      exercises: ['Jump Squats', 'Push-ups', 'Mountain Climbers', 'Burpees'],
      totalDurationSeconds: 25 * 60,
      steps: [
        { name: 'Set 1: Jump Squats', time: 45, type: 'Exercise', instructions: 'Squat down low, then explode upwards. Land softly and immediately transition into the next rep.' },
        { name: 'Rest', time: 15, type: 'Rest', instructions: '15 seconds of rest. Stay standing and shake out your legs.' },
        { name: 'Set 2: Push-ups', time: 45, type: 'Exercise', instructions: 'Maximize reps in this 45-second window. Use knee push-ups if necessary to maintain form.' },
        { name: 'Rest', time: 15, type: 'Rest', instructions: 'Transition quickly to the Mountain Climbers position.' },
        { name: 'Set 3: Mountain Climbers', time: 45, type: 'Exercise', instructions: 'High intensity drive! Push the pace and maximize knee drives.' },
        { name: 'Rest', time: 15, type: 'Rest', instructions: 'Almost done with the first round!' },
        { name: 'Set 4: Burpees', time: 45, type: 'Exercise', instructions: 'The ultimate finisher. Full burpees with a chest-to-floor and explosive jump at the end.' },
        { name: 'Circuit Rest', time: 120, type: 'Rest', instructions: 'TAKE A 2-MINUTE BREAK. Drink water. You will repeat this circuit 3 more times.' },
        { name: 'Repeat Circuit', time: 0, type: 'Note', instructions: 'Repeat the 4 exercises + rest cycle three more times, followed by the 2-minute circuit rest after each full cycle.' },
      ]
    },
    {
      id: 8,
      title: 'Pilates Core',
      duration: '30 min',
      calories: '220 kcal',
      difficulty: 'Beginner',
      exercises: ['Roll-ups', 'Single Leg Stretch', 'Spine Twist', 'Saw'],
      totalDurationSeconds: 30 * 60,
      steps: [
        { name: 'Pilates Breathing', time: 120, type: 'Rest', instructions: 'Lie flat on your back. Focus on lateral, ribcage breathing, drawing your navel toward your spine.' },
        { name: 'The Hundred Prep', time: 60, type: 'Exercise', instructions: 'Curl head and shoulders up, pumping arms vigorously by your sides. Keep your core deeply engaged.' },
        { name: 'Roll-ups (10 reps)', time: 180, type: 'Exercise', instructions: 'Articulate your spine up and down slowly. Use core control, not momentum. Stop if you feel strain in your neck.' },
        { name: 'Single Leg Stretch', time: 120, type: 'Exercise', instructions: 'Inhale to switch legs. Keep the low back pressing down into the mat. Fluid, controlled movement.' },
        { name: 'Spine Twist', time: 120, type: 'Exercise', instructions: 'Sit tall with legs straight. Inhale to lengthen, exhale to twist. Keep your hips stationary.' },
        { name: 'The Saw', time: 180, type: 'Exercise', instructions: 'Sit wide, twist, and reach for your opposite foot. Use the core to deepen the stretch on the exhale.' },
        { name: 'Cool Down', time: 300, type: 'Rest', instructions: 'Finish with gentle static stretches for the hip flexors and lower back.' },
      ]
    },
    {
      id: 9,
      title: 'Boxing Drills',
      duration: '40 min',
      calories: '420 kcal',
      difficulty: 'Intermediate',
      exercises: ['Jab-Cross', 'Hooks', 'Uppercuts', 'Footwork'],
      totalDurationSeconds: 40 * 60,
      steps: [
        { name: 'Shadow Boxing Warm-up', time: 300, type: 'Rest', instructions: 'Move lightly on your feet. Practice basic defense (slips, rolls) and throw light punches to warm up your shoulders.' },
        { name: 'Drill 1: Jab-Cross-Hook', time: 120, type: 'Exercise', instructions: 'Focus on powerful hip rotation with each punch. Reset your guard immediately after throwing the combo.' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: 'Shake out your hands and arms. Focus on maintaining a fast, light stance.' },
        { name: 'Drill 2: Uppercut-Cross', time: 120, type: 'Exercise', instructions: 'Drop your weight slightly before the uppercut. Drive up through your hips. Finish with a powerful cross.' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: 'Grab a quick sip of water. Keep your footwork active.' },
        { name: 'Footwork: Lateral Movement', time: 180, type: 'Exercise', instructions: 'Use shuffling steps to move side-to-side. Stay balanced, ready to punch or defend at any time.' },
        { name: 'Drill 3: Power Round', time: 180, type: 'Exercise', instructions: 'Throw ANY combination with maximum speed and power. 100% effort until the timer stops!' },
        { name: 'Cool Down', time: 600, type: 'Rest', instructions: 'Slow down. Roll your neck and shoulders. Deep, intentional breaths.' },
      ]
    },
    {
      id: 10,
      title: 'Stretching Routine',
      duration: '20 min',
      calories: '100 kcal',
      difficulty: 'Beginner',
      exercises: ['Hamstring Stretch', 'Quad Stretch', 'Shoulder Stretch', 'Neck Stretch'],
      totalDurationSeconds: 20 * 60,
      steps: [
        { name: 'Seated Hamstring Stretch', time: 90, type: 'Rest', instructions: 'Sit with legs straight. Gently fold forward from the hips, reaching for your toes. Hold a static stretch.' },
        { name: 'Standing Quad Stretch (Left)', time: 60, type: 'Rest', instructions: 'Stand tall, hold your left foot and pull your heel toward your glute. Keep knees aligned.' },
        { name: 'Standing Quad Stretch (Right)', time: 60, type: 'Rest', instructions: 'Repeat the quad stretch on the right leg.' },
        { name: 'Figure-Four Glute Stretch', time: 120, type: 'Rest', instructions: 'Lie on your back. Cross one ankle over the opposite knee. Pull the non-crossed leg toward your chest.' },
        { name: 'Shoulder Cross-Body Stretch', time: 120, type: 'Rest', instructions: 'Pull your arm across your chest using the opposite forearm. Hold each side for 60 seconds.' },
        { name: 'Triceps/Lat Stretch', time: 120, type: 'Rest', instructions: 'Reach one hand behind your head and pull the elbow gently with the opposite hand. Hold each side for 60 seconds.' },
        { name: 'Neck Rolls', time: 180, type: 'Rest', instructions: 'Slowly roll your neck side-to-side and front-to-back. Do not force the motion. Focus on releasing tension.' },
        { name: 'Savasana', time: 300, type: 'Rest', instructions: 'Lie flat, close your eyes, and allow your body to relax completely for the final 5 minutes.' },
      ]
    },
    {
      id: 11,
      title: 'Kettlebell Workout',
      duration: '35 min',
      calories: '380 kcal',
      difficulty: 'Intermediate',
      exercises: ['Swings', 'Goblet Squats', 'Turkish Get-ups', 'Clean and Press'],
      totalDurationSeconds: 35 * 60,
      steps: [
        { name: 'Joint Mobility Warm-up', time: 240, type: 'Rest', instructions: 'Focus on hip, shoulder, and wrist circles to prepare for the kettlebell grip and dynamic movements.' },
        { name: 'KB Swings (4 sets of 15 reps)', time: 90, type: 'Exercise', instructions: 'Hinge at the hips, keeping the back flat. Drive the kettlebell up using an explosive hip snap, not your arms.' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: 'Keep walking lightly. This is a ballistic movement, so focus on controlling your breathing.' },
        { name: 'Goblet Squats (3 sets of 12 reps)', time: 90, type: 'Exercise', instructions: 'Hold the bell vertically against your chest. Squat deep, keeping your elbows inside your knees at the bottom.' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: 'Short break. Get ready for the technical lift.' },
        { name: 'Turkish Get-ups (5 reps per side)', time: 180, type: 'Exercise', instructions: 'Slow, controlled, and precise movement. Keep the kettlebell pressed overhead at all times. Focus on stabilization.' },
        { name: 'Rest', time: 120, type: 'Rest', instructions: 'Two-minute break. This was the hardest part. Final exercise coming up.' },
        { name: 'Clean and Press (3 sets of 8 per side)', time: 90, type: 'Exercise', instructions: 'Clean the bell to the rack position, then press it overhead. Use the legs for the press for maximal power.' },
        { name: 'Cool-down', time: 360, type: 'Rest', instructions: 'Perform a standing hip flexor stretch and a deep shoulder stretch.' },
      ]
    },
    {
      id: 12,
      title: 'Tabata Training',
      duration: '20 min',
      calories: '280 kcal',
      difficulty: 'Advanced',
      exercises: ['Sprints', 'Jump Squats', 'Push-ups', 'Burpees'],
      totalDurationSeconds: 20 * 60,
      steps: [
        { name: 'Tabata Intro & Warm-up', time: 180, type: 'Rest', instructions: '3 minutes of jump rope or high knees. Prepare for maximal effort: 20 seconds of work, 10 seconds of rest.' },
        { name: 'Sprint (Round 1)', time: 20, type: 'Exercise', instructions: 'MAXIMAL EFFORT! Sprint in place or on a machine.' },
        { name: 'Rest', time: 10, type: 'Rest', instructions: 'Quick rest. Get ready to go again.' },
        { name: 'Sprint (Round 2)', time: 20, type: 'Exercise', instructions: 'MAXIMAL EFFORT!' },
        { name: 'Rest', time: 10, type: 'Rest', instructions: 'Quick rest.' },
        { name: 'Sprint (Round 3)', time: 20, type: 'Exercise', instructions: 'MAXIMAL EFFORT!' },
        { name: 'Rest', time: 10, type: 'Rest', instructions: 'Quick rest.' },
        { name: 'Sprint (Round 4)', time: 20, type: 'Exercise', instructions: 'MAXIMAL EFFORT!' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: '1 minute recovery. Next is Jump Squats.' },
        // Repeat Tabata rounds for other exercises... (omitted for brevity, but pattern continues)
        { name: 'Jump Squats (Round 1-4)', time: 240, type: 'Exercise', instructions: 'Perform 4 rounds of Jump Squats (20s work, 10s rest).' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: '1 minute recovery. Next is Push-ups.' },
        { name: 'Push-ups (Round 1-4)', time: 240, type: 'Exercise', instructions: 'Perform 4 rounds of Push-ups (20s work, 10s rest).' },
        { name: 'Rest', time: 60, type: 'Rest', instructions: '1 minute recovery. Final exercise: Burpees.' },
        { name: 'Burpees (Round 1-4)', time: 240, type: 'Exercise', instructions: 'Perform 4 rounds of Burpees (20s work, 10s rest). Leave nothing in the tank!' },
        { name: 'Cool Down', time: 300, type: 'Rest', instructions: 'Walk it out, gentle static stretches.' },
      ]
    },
];
// --- End Workout Data ---

// --- Timer Utility Component ---
const WorkoutSession = ({ workout, onComplete, onBack }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(workout.steps[0].time);
  
  const currentStep = workout.steps[stepIndex];
  const isFinished = stepIndex >= workout.steps.length;

  // Format time (MM:SS)
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
      // Auto advance to next step
      setIsRunning(false);
      setStepIndex((prevIndex) => prevIndex + 1);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, isFinished]);
  
  // Update seconds when stepIndex changes
  useEffect(() => {
    if (!isFinished) {
      setSecondsRemaining(currentStep.time);
      // Automatically pause timer for manual start on Exercise/Rest steps
      if (currentStep.time > 0) {
          setIsRunning(false); 
      }
    }
  }, [stepIndex, isFinished, currentStep]);

  const handleNextStep = useCallback(() => {
    if (stepIndex < workout.steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setIsRunning(false);
    } else if (!isFinished) {
        setStepIndex(workout.steps.length); // Mark as finished
        setIsRunning(false);
    }
  }, [stepIndex, workout.steps.length, isFinished]);

  const handleStartStop = () => {
    if (isFinished) {
      // If finished, restart the workout
      setStepIndex(0);
      setSecondsRemaining(workout.steps[0].time);
      setIsRunning(true);
      return;
    }
    setIsRunning(!isRunning);
  };
  
  const handleSkip = () => {
      handleNextStep();
  };

  const handleComplete = () => {
    // Only call onComplete if the workout is actually finished
    if (isFinished) {
      onComplete();
      onBack(null); // Go back to the main list
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-6">
        <div className="max-w-4xl mx-auto">
            <button
              onClick={() => onBack(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Routines
            </button>
            
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Timer and Instructions Column */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 h-fit lg:sticky lg:top-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{workout.title}</h2>
                    <p className="text-lg text-slate-600 mb-6">Interactive Session</p>

                    {isFinished ? (
                        <div className="text-center py-10">
                          <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-green-600 mb-4">Workout Complete!</h3>
                          <p className="text-slate-700 mb-6">Congratulations! Log your activity to the dashboard.</p>
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
                            <div className="mb-6 p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                                <p className="text-sm font-semibold uppercase text-slate-500">Current Task ({currentStep.type})</p>
                                <h3 className="text-xl font-bold text-blue-600">{currentStep.name}</h3>
                            </div>
                            
                            {/* NEW: Step Instructions */}
                            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-sm font-semibold text-slate-700 mb-2">Instructions:</p>
                                <p className="text-slate-600 italic">{currentStep.instructions}</p>
                            </div>

                            {/* Timer Display */}
                            <div className={`text-center p-8 rounded-2xl mb-8 transition-colors duration-500 
                                ${currentStep.type === 'Exercise' ? 'bg-red-100 shadow-lg border-2 border-red-300' : 'bg-cyan-100 shadow-lg border-2 border-cyan-300'}`}>
                                <p className="text-sm font-semibold uppercase text-slate-600 mb-2">Time Remaining</p>
                                <div className="text-7xl font-extrabold text-slate-900">
                                  {formatTime(secondsRemaining)}
                                </div>
                            </div>
                            
                            {/* Controls */}
                            <div className="flex gap-4 mb-4">
                              <button
                                onClick={handleStartStop}
                                disabled={secondsRemaining === 0 && !isFinished || currentStep.type === 'Note'}
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
                            <p className="text-center text-sm text-slate-500">Step {stepIndex + 1} of {workout.steps.length}</p>
                        </>
                    )}
                </div>
                
                {/* Full Plan Column */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Dumbbell className="w-6 h-6 text-blue-600" />
                        Full Routine Steps
                    </h3>
                    <ul className="space-y-4">
                        {workout.steps.map((step, index) => (
                            <li 
                                key={index} 
                                className={`p-4 rounded-xl transition-all duration-300 border 
                                    ${index === stepIndex 
                                        ? 'bg-blue-100 border-blue-400 shadow-md transform scale-[1.02]' // Current step highlight
                                        : index < stepIndex 
                                        ? 'bg-green-50 border-green-200 text-slate-500 line-through opacity-70' // Completed step
                                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100' // Pending step
                                    }`
                                }
                            >
                                <div className="flex justify-between items-center">
                                    <p className={`font-semibold ${index === stepIndex ? 'text-blue-800' : 'text-slate-800'}`}>
                                        {index + 1}. {step.name}
                                    </p>
                                    <span className={`text-sm px-2 py-1 rounded-full ${step.type === 'Exercise' ? 'bg-red-200 text-red-800' : 'bg-cyan-200 text-cyan-800'}`}>
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
// --- End Timer Utility Component ---


export function WorkoutRoutine() {
  const navigate = useNavigate();
  const { incrementWorkouts } = useAuth();
  
  // NEW STATE: Tracks the workout selected for the interactive session
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  // --- Pagination Setup ---
  const [currentPage, setCurrentPage] = useState(1);
  const workoutsPerPage = 6;
  // --- End Pagination Setup ---

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

  // --- Pagination Logic ---
  const totalPages = Math.ceil(WORKOUT_DATA.length / workoutsPerPage); // Use WORKOUT_DATA
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = WORKOUT_DATA.slice(indexOfFirstWorkout, indexOfLastWorkout); // Use WORKOUT_DATA

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // --- End Pagination Logic ---

  // Render the Workout Session view if a workout is selected
  if (selectedWorkout) {
    // Pass incrementWorkouts and setSelectedWorkout functions down
    return (
      <WorkoutSession 
        workout={selectedWorkout} 
        onComplete={incrementWorkouts} 
        onBack={setSelectedWorkout}
      />
    );
  }

  // Render the main routine list view
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
        
        {/* Card Alignment Fix: Added 'flex-col justify-between' and 'h-full' */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group flex flex-col h-full"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 h-32 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Dumbbell className="w-16 h-16 text-white" />
              </div>
              
              <div className="p-6 flex flex-col flex-grow"> 
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
                {/* Button Alignment Fix: Added 'mt-auto' to push button to the bottom */}
                <button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all mt-auto"
                  // NEW: Sets the selected workout to render the WorkoutSession component
                  onClick={() => setSelectedWorkout(workout)}
                >
                  Start Workout
                </button>
              </div>
            </div>
          ))}
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
                            ? 'bg-blue-600 text-white shadow-md' 
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