
import React from 'react';
import { useSystemConfig } from '../context/SystemConfigContext';
import { useToast } from '../context/ToastContext';
import { useWallet } from '../hooks/useWallet';

const Settings: React.FC = () => {
  const { mode, setMode, apiEndpoint, setApiEndpoint } = useSystemConfig();
  const { switchToLocalNetwork, chainId } = useWallet();
  const { addToast } = useToast();

  const handleSave = () => {
    addToast("Đã lưu cấu hình thành công.", "success");
  };

  const toggleMode = () => {
    const newMode = mode === 'mock' ? 'real' : 'mock';
    setMode(newMode);
    if (newMode === 'real') {
      addToast("Đã chuyển sang chế độ Real. Hãy kết nối ví MetaMask.", "info");
    } else {
      addToast("Đã chuyển sang chế độ Mock. Dữ liệu sẽ được giả lập.", "info");
    }
  };

  return (
    <div className="py-12 bg-background min-h-screen animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cài đặt hệ thống</h1>
        
        <div className="space-y-6">
          
          {/* Section 1: Operation Mode */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                🎮 Chế độ hoạt động
              </h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Chế độ Mock (Giả lập)</h3>
                <p className="text-sm text-text-secondary mt-1 max-w-md">
                  Khi bật: Dùng dữ liệu mẫu và ví giả lập (không cần MetaMask). <br/>
                  Khi tắt: Kết nối Blockchain thật và gọi API Backend thực tế.
                </p>
              </div>
              
              <button 
                onClick={toggleMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${mode === 'mock' ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${mode === 'mock' ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Section 2: Blockchain Config */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                ⛓️ Cấu hình Blockchain (Localhost)
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                 <div>
                    <p className="text-sm font-medium text-gray-900">Mạng hiện tại</p>
                    <p className="text-xs text-text-muted">Chain ID: {chainId || 'Chưa kết nối'}</p>
                 </div>
                 <div className="text-right">
                    {chainId === 31337 ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Hardhat Connected</span>
                    ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Chưa kết nối Localhost</span>
                    )}
                 </div>
              </div>
              
              <p className="text-sm text-text-secondary mb-4">
                 Nếu bạn đang chạy `npx hardhat node` trên máy, hãy nhấn nút dưới đây để thêm mạng vào MetaMask.
              </p>

              <button 
                onClick={switchToLocalNetwork}
                disabled={mode === 'mock'}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚡ Thêm mạng Hardhat (Chain ID 31337)
              </button>
            </div>
          </div>

          {/* Section 3: Backend Config */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                🌐 Kết nối Backend
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className={mode === 'mock' ? 'opacity-50 pointer-events-none grayscale' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint (REST)
                </label>
                <input 
                  type="url" 
                  value={apiEndpoint} 
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="http://localhost:3000/v1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary outline-none" 
                />
                <p className="text-xs text-text-muted mt-2">
                  Địa chỉ server backend của bạn. Hệ thống sẽ gửi toàn bộ requests (Get Funds, Create, Apply) đến đây khi ở chế độ Real.
                </p>
              </div>
              
              {mode === 'mock' && (
                <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-200">
                  ⚠️ Bạn đang ở chế độ Mock. Cấu hình Backend sẽ không có hiệu lực.
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button onClick={handleSave} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors shadow-sm">
                  Lưu cấu hình
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Settings;
