import { useState } from 'react';
import { ArrowLeft, BookOpen, Brain, Clock, Star, Lightbulb } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

export function StudyTips() {
  const navigate = useNavigate();
  const { incrementStudySessions } = useAuth();

  // --- Pagination Setup ---
  const [currentPage, setCurrentPage] = useState(1);
  const tipsPerPage = 6;
  // --- End Pagination Setup ---

  const tips = [
    {
      id: 1,
      title: 'Pomodoro Technique',
      category: 'Time Management',
      icon: Clock,
      description: 'Study for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer 15-30 minute break.',
      benefits: ['Improved focus', 'Reduced burnout', 'Better time awareness'],
    },
    {
      id: 2,
      title: 'Active Recall',
      category: 'Memory',
      icon: Brain,
      description: 'Test yourself on the material rather than passively reading. This strengthens neural pathways and improves retention.',
      benefits: ['Enhanced memory', 'Better understanding', 'Long-term retention'],
    },
    {
      id: 3,
      title: 'Spaced Repetition',
      category: 'Learning Strategy',
      icon: Star,
      description: 'Review material at increasing intervals over time. Study today, review tomorrow, then in 3 days, then a week later.',
      benefits: ['Combat forgetting curve', 'Efficient learning', 'Strong retention'],
    },
    {
      id: 4,
      title: 'Feynman Technique',
      category: 'Understanding',
      icon: Lightbulb,
      description: 'Explain concepts in simple terms as if teaching someone else. Identify gaps in your understanding and fill them.',
      benefits: ['Deep understanding', 'Identify knowledge gaps', 'Simplify complex topics'],
    },
    {
      id: 5,
      title: 'Mind Mapping',
      category: 'Organization',
      icon: BookOpen,
      description: 'Create visual diagrams connecting related concepts. Start with a central idea and branch out to related topics.',
      benefits: ['Visual learning', 'See connections', 'Creative thinking'],
    },
    {
      id: 6,
      title: 'Environment Optimization',
      category: 'Productivity',
      icon: Star,
      description: 'Create a dedicated study space free from distractions. Good lighting, comfortable seating, and organized materials.',
      benefits: ['Better focus', 'Reduced distractions', 'Consistent routine'],
    },
    {
      id: 7,
      title: 'SQ3R Method',
      category: 'Reading',
      icon: BookOpen,
      description: 'Survey, Question, Read, Recite, Review—an active reading strategy improving comprehension and retention.',
      benefits: ['Improved reading', 'Active studying', 'Better retention'],
    },
    {
      id: 8,
      title: 'Leitner System',
      category: 'Memory',
      icon: Star,
      description: 'Use spaced flashcards boxes that move as you master each card, focusing your review where it’s needed most.',
      benefits: ['Maximized retention', 'Targeted practice', 'Efficient study'],
    },
    {
      id: 9,
      title: 'Note-Taking Styles',
      category: 'Organization',
      icon: BookOpen,
      description: 'Try Cornell, Mapping or Charting styles to summarize and clarify key points in your notes.',
      benefits: ['Better organization', 'More clarity', 'Quick review'],
    },
    {
      id: 10,
      title: 'Visualization',
      category: 'Memory',
      icon: Brain,
      description: 'Create mental images for concepts or information you want to remember.',
      benefits: ['Enhanced recall', 'Creative memory', 'Faster learning'],
    },
  ];

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
  // --- End Pagination Logic ---

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
        
        {/* Card Layout with Pagination */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTips.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <div
                key={tip.id}
                // Card Alignment Fix: Added 'flex flex-col h-full'
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
                
                {/* Card Body: Added 'flex flex-col flex-grow' to push content down */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{tip.description}</p>
                  
                  {/* Added mt-auto to separate this block and allow button to align */}
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
                  
                  {/* Button Alignment Fix: Added 'mt-4' for spacing and 'mt-auto' (already included in container) */}
                  <button
                    className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    onClick={incrementStudySessions}
                  >
                    Learn More
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