
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

export type SystemMode = 'mock' | 'real';

interface SystemConfigContextType {
  mode: SystemMode;
  apiEndpoint: string;
  setMode: (mode: SystemMode) => void;
  setApiEndpoint: (url: string) => void;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

export const SystemConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<SystemMode>(() => {
    // Ưu tiên 'mock' làm mặc định cho trải nghiệm Demo tốt nhất
    return (localStorage.getItem('eduFund_mode') as SystemMode) || 'mock'; 
  });

  const [apiEndpoint, setApiEndpointState] = useState<string>(() => {
    return localStorage.getItem('eduFund_apiEndpoint') || 'http://localhost:3000/v1';
  });


  // Sync with localStorage and API config
  useEffect(() => {
    localStorage.setItem('eduFund_mode', mode);
    localStorage.setItem('eduFund_apiEndpoint', apiEndpoint);
    
    // Push config to API singleton
    api.configure({ apiEndpoint });
  }, [mode, apiEndpoint]);

  const setMode = (newMode: SystemMode) => {
    setModeState(newMode);
  };

  const setApiEndpoint = (url: string) => {
    setApiEndpointState(url);
  };

  return (
    <SystemConfigContext.Provider value={{ mode, apiEndpoint, setMode, setApiEndpoint }}>
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfig = () => {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error('useSystemConfig must be used within a SystemConfigProvider');
  }
  return context;
};
