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
    // Load user and stats from localStorage on mount
    const storedUser = localStorage.getItem("iqfit_user");
    const storedStats = localStorage.getItem("iqfit_stats");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }
    
    setIsLoading(false);
  }, []);

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('iqfit_user', JSON.stringify(updatedUser));
  };

  const login = async (email, password) => {
    // This function is mainly a placeholder if logic is handled in LoginPage
    // But typically it would fetch from API and then setUser
    setIsLoading(true);
    try {
       // Simulation or API call logic here
      // 1. Call the backend login API
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        // Handle 401 Unauthorized or other errors from the backend
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed: Invalid credentials');
      }

      const userData = await response.json();
      
      // The backend response should contain the full user object including 'isPremium' and 'role'
      setUser(userData);
      localStorage.setItem('iqfit_user', JSON.stringify(userData));

    } catch (error) {
      console.error("Login failed:", error);
      // Re-throw the error so the UI (LoginPage) can handle it
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    try {
      // 1. Call the backend registration API
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // NOTE: The backend expects fullName, email, and password
        body: JSON.stringify({ fullName, email, password }) 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed.');
      }

      const userData = await response.json();

      setUser(userData);
      localStorage.setItem('iqfit_user', JSON.stringify(userData));

      // Reset stats for new user
      const initialStats = { workouts: 0, studySessions: 0, recipesTried: 0 };
      setStats(initialStats);
      localStorage.setItem('iqfit_stats', JSON.stringify(initialStats));
      
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
       setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStats({ workouts: 0, studySessions: 0, recipesTried: 0 });
    localStorage.removeItem('iqfit_user');
    localStorage.removeItem('iqfit_stats');
    // Optional: clear other keys
    localStorage.removeItem('iqfit_daily_progress'); 
  };

  const incrementWorkouts = () => {
    const newStats = { ...stats, workouts: (stats.workouts || 0) + 1 };
    setStats(newStats);
    localStorage.setItem('iqfit_stats', JSON.stringify(newStats));
  };

  const incrementStudySessions = () => {
    const newStats = { ...stats, studySessions: (stats.studySessions || 0) + 1 };
    setStats(newStats);
    localStorage.setItem('iqfit_stats', JSON.stringify(newStats));
  };

  const incrementRecipesTried = () => {
    const newStats = { ...stats, recipesTried: (stats.recipesTried || 0) + 1 };
    setStats(newStats);
    localStorage.setItem('iqfit_stats', JSON.stringify(newStats));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      stats,
      updateProfile,
      incrementWorkouts,
      incrementStudySessions,
      incrementRecipesTried
    }}>
      {children}
    </AuthContext.Provider>
  );
};