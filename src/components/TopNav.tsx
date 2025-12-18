
import React, { useState } from 'react';
import { Logo, WalletIcon } from '../assets/svgs';
import { useWallet } from '../hooks/useWallet';
import { useRouter } from '../context/RouterContext';
import ConnectWalletModal from './ConnectWalletModal';

const TopNav: React.FC = () => {
  // Now uses global state from Context via the hook
  const { isConnected, address, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { navigate } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsDropdownOpen(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
  };

  const handleSwitchWallet = () => {
    setIsDropdownOpen(false);
    // Gọi hàm connectWallet mới (đã có wallet_requestPermissions) để ép hiện popup chọn ví
    connectWallet();
  };

  const handleNav = (path: string) => {
    navigate(path);
  };

  const handleScrollNav = (id: string) => {
    navigate('/');
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCreateClick = () => {
    if (isConnected) {
      navigate('/create');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => handleNav('/')}>
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">Edu<span className="text-primary">Fund</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => handleScrollNav('how-it-works')} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">Cách hoạt động</button>
              <button onClick={() => handleScrollNav('funds')} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">Danh sách quỹ</button>
              <button onClick={() => handleNav('/settings')} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">Cài đặt</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                {!isConnected ? (
                  <button onClick={() => connectWallet()} disabled={isConnecting} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-primary text-white hover:bg-primary-600 hover:shadow-md transition-all shadow-sm disabled:opacity-70 disabled:cursor-wait">
                    {isConnecting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <WalletIcon className="h-4 w-4" />
                    )}
                    {isConnecting ? 'Đang kết nối...' : 'Kết nối Ví'}
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-primary-50 text-primary border border-primary-600 hover:bg-primary-100 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      {shortAddress}
                      <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in-up origin-top-right">
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-xs text-text-muted uppercase font-semibold">Ví của tôi</p>
                          <p className="text-sm font-medium text-gray-900 truncate" title={address || ''}>{address}</p>
                        </div>
                        <button onClick={handleCopyAddress} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-gray-50 hover:text-primary flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Sao chép địa chỉ
                        </button>
                        
                        <button onClick={handleSwitchWallet} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-gray-50 hover:text-primary flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> Chuyển ví
                        </button>

                        <button onClick={() => { setIsDropdownOpen(false); handleCreateClick(); }} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-gray-50 hover:text-primary block md:hidden">Tạo quỹ mới</button>
                        <div className="border-t border-gray-50 my-1"></div>
                        <button onClick={handleDisconnect} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Ngắt kết nối
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <ConnectWalletModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onConnect={connectWallet}
        isConnecting={isConnecting}
        onConnected={() => navigate('/create')}
      />
    </>
  );
};
export default TopNav;