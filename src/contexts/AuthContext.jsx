import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    workouts: 0,
    studySessions: 0,
    recipesTried: 0
  });

  useEffect(() => {
if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
  const storedUser = localStorage.getItem("iqfit_user");
  const storedStats = localStorage.getItem("iqfit_stats");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  if (storedStats) {
    setStats(JSON.parse(storedStats));
  }
}

    setIsLoading(false);
  }, []);

  // --- NEW FUNCTION TO UPDATE USER PROFILE ---
  const updateProfile = (profileData) => {
    // 1. Update the user object
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    
    // 2. Persist the updated user to localStorage
    localStorage.setItem('iqfit_user', JSON.stringify(updatedUser));
  };
  // -------------------------------------------

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockUser = {
        id: '1',
        email,
        fullName: 'John Doe',
        bio: 'Fitness enthusiast and lifelong learner'
      };
      setUser(mockUser);
      localStorage.setItem('iqfit_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockUser = {
        id: '1',
        email,
        fullName,
        bio: ''
      };
      setUser(mockUser);
      localStorage.setItem('iqfit_user', JSON.stringify(mockUser));
      // Reset stats for new user
      setStats({
        workouts: 0,
        studySessions: 0,
        recipesTried: 0
      });
      localStorage.setItem('iqfit_stats', JSON.stringify({
        workouts: 0,
        studySessions: 0,
        recipesTried: 0
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStats({
      workouts: 0,
      studySessions: 0,
      recipesTried: 0
    });
    localStorage.removeItem('iqfit_user');
    localStorage.removeItem('iqfit_stats');
  };

  // Functions for incrementing progress
  const incrementWorkouts = () => {
    const newStats = { ...stats, workouts: stats.workouts + 1 };
    setStats(newStats);
    localStorage.setItem('iqfit_stats', JSON.stringify(newStats));
  };

  const incrementStudySessions = () => {
    const newStats = { ...stats, studySessions: stats.studySessions + 1 };
    setStats(newStats);
    localStorage.setItem('iqfit_stats', JSON.stringify(newStats));
  };

  const incrementRecipesTried = () => {
    const newStats = { ...stats, recipesTried: stats.recipesTried + 1 };
    setStats(newStats);
    localStorage.setItem('iqfit_stats', JSON.stringify(newStats));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      stats,
      updateProfile, // <-- EXPORTING NEW FUNCTION
      incrementWorkouts,
      incrementStudySessions,
      incrementRecipesTried
    }}>
      {children}
    </AuthContext.Provider>
  );
};