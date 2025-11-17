import { useCallback } from 'react';

export const useNavigate = () => {
  const navigate = useCallback((path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);
  return navigate;
};
