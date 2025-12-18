import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import ConnectWalletModal from './ConnectWalletModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isConnected, connectWallet, isConnecting } = useWallet();
  const [showModal, setShowModal] = useState(true);

  if (isConnected) {
    return <>{children}</>;
  }

  // Blocking UI if not connected
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-fade-in-up">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Yêu cầu kết nối ví</h2>
        <p className="text-text-secondary mb-8">
          Bạn cần kết nối ví để truy cập trang này. Kết nối ví giúp xác thực danh tính và ký các giao dịch an toàn trên EduFund.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-md"
        >
          Kết nối Ví để tiếp tục
        </button>
      </div>

      <ConnectWalletModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onConnect={connectWallet}
        isConnecting={isConnecting}
      />
    </div>
  );
};

export default ProtectedRoute;