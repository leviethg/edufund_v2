import React from 'react';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateFund from './pages/CreateFund';
import FundDetail from './pages/FundDetail';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { WalletProvider } from './context/WalletContext';
import { SystemConfigProvider } from './context/SystemConfigContext';

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