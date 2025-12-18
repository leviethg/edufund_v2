import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  route: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<string>('#/');

  useEffect(() => {
    try {
      // Sync initial state if allowed
      if (window.location.hash) {
        setRoute(window.location.hash);
      }
      
      const handler = () => {
         try { setRoute(window.location.hash); } catch(e) {}
      };
      window.addEventListener('hashchange', handler);
      return () => window.removeEventListener('hashchange', handler);
    } catch(e) {
      console.warn("Router: Window location access restricted");
    }
  }, []);

  const navigate = (path: string) => {
    let target = path;
    if (!target.startsWith('#')) {
      target = '#' + (target.startsWith('/') ? target : '/' + target);
    }
    if (target === '#') target = '#/';
    
    setRoute(target);
    try {
      window.location.hash = target;
    } catch (e) {
      // Ignore setter errors in sandboxed environments
    }
    
    // Simple scroll to top on page change
    window.scrollTo(0,0);
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouter must be used within RouterProvider");
  return context;
};

// Add useParams helper to fix FundDetail crash
export const useParams = () => {
  const { route } = useRouter();
  // Route format: #/fund/123
  // logic: remove #, split by /, get last segment or segment after 'fund'
  const parts = route.replace(/^#/, '').split('/').filter(Boolean);
  
  // Basic matching for /fund/:id
  let id: string | undefined;
  if (parts.length >= 2 && parts[0] === 'fund') {
    id = parts[1];
  }

  return { params: { id } };
};