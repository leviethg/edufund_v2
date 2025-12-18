import React from 'react';
import TopNav from './src/components/TopNav';
import Footer from './src/components/Footer';
import Home from './src/pages/Home';
import CreateFund from './src/pages/CreateFund';
import FundDetail from './src/pages/FundDetail';
import Settings from './src/pages/Settings';
import ProtectedRoute from './src/components/ProtectedRoute';
import { ToastProvider } from './src/context/ToastContext';
import { RouterProvider, useRouter } from './src/context/RouterContext';
import { WalletProvider } from './src/context/WalletContext';
import { SystemConfigProvider } from './src/context/SystemConfigContext';

const AppContent: React.FC = () => {
  const { route } = useRouter();

  const renderPage = () => {
    // Route guard: Wrap CreateFund in ProtectedRoute
    if (route.startsWith('#/create')) {
      return (
        <ProtectedRoute>
          <CreateFund />
        </ProtectedRoute>
      );
    }
    
    if (route.startsWith('#/fund/')) return <FundDetail />;
    if (route.startsWith('#/settings')) return <Settings />;
    return <Home />;
  };

  return (
    <div className="font-sans text-text-main antialiased selection:bg-primary-50 selection:text-primary">
      <TopNav />
      {renderPage()}
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SystemConfigProvider>
      <ToastProvider>
        <WalletProvider>
          <RouterProvider>
            <AppContent />
          </RouterProvider>
        </WalletProvider>
      </ToastProvider>
    </SystemConfigProvider>
  );
};

export default App;