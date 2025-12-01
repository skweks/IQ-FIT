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
import Plans from './pages/Plans';  // <--- 1. Import is kept here
import { AdminDashboard } from './pages/AdminDashboard';

// We deleted the first "function App()" that was here.

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

  // Redirect logic: If not logged in and trying to access protected pages
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
    // 2. Add this case inside the switch(currentPath) block:
    case '/admin':
      return user?.role === 'ADMIN' ? <AdminDashboard /> : <Dashboard />;
      
    // 2. Add the new Case for Plans here
    case '/plans':
      return user ? <Plans /> : <LoginPage />;

    default:
      return user ? <Dashboard /> : <LandingPage />;
  }
}

// 3. This is the ONLY export default allowed
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}