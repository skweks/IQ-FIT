import './index.css';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { UserProfile } from './pages/UserProfile';
import { WorkoutRoutine } from './pages/WorkoutRoutine';
import { StudyTips } from './pages/StudyTips';
import { FoodRecipes } from './pages/FoodRecipes';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!user && currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register') {
    window.history.pushState({}, '', '/login');
    return <LoginPage />;
  }

  switch (currentPath) {
    case '/':
      return user ? <Dashboard /> : <LandingPage />;
    case '/register':
      return user ? <Dashboard /> : <RegisterPage />;
    case '/login':
      return user ? <Dashboard /> : <LoginPage />;
    case '/dashboard':
      return user ? <Dashboard /> : <LoginPage />;
    case '/profile':
      return user ? <UserProfile /> : <LoginPage />;
    case '/workouts':
      return user ? <WorkoutRoutine /> : <LoginPage />;
    case '/study-tips':
      return user ? <StudyTips /> : <LoginPage />;
    case '/recipes':
      return user ? <FoodRecipes /> : <LoginPage />;
    default:
      return user ? <Dashboard /> : <LandingPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
