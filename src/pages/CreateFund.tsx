
import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../context/ToastContext';
import { api } from '../api/api';
import { useRouter } from '../context/RouterContext';
import ConnectWalletModal from '../components/ConnectWalletModal';

// Địa chỉ "Giả lập" Smart Contract Vault
// Đây là Account #0 mặc định của Hardhat Node - nơi sẽ giữ tiền quỹ
const EDU_FUND_CONTRACT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const CreateFund: React.FC = () => {
  const { isConnected, connectWallet, signAction, sendTransaction, address, isConnecting } = useWallet();
  const { addToast } = useToast();
  const { navigate } = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const [formData, setFormData] = useState({ 
    title: '', 
    target: '', 
    slots: '1',
    desc: '' 
  });

  useEffect(() => {
    if (!isConnected && !isConnecting) {
      setShowConnectModal(true);
    } else {
      setShowConnectModal(false);
    }
  }, [isConnected, isConnecting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setShowConnectModal(true);
      return;
    }

    // Validation
    if (!formData.title || !formData.desc) {
      addToast("Vui lòng điền đầy đủ các trường bắt buộc.", "error");
      return;
    }

    const amount = Number(formData.target);
    if (amount <= 0 || isNaN(amount)) {
      addToast("Giá trị quỹ phải là số dương.", "error");
      return;
    }

    const slotsNum = Number(formData.slots);
    if (!Number.isInteger(slotsNum) || slotsNum < 1 || slotsNum > 5) {
      addToast("Số suất phải là số nguyên từ 1 đến 5.", "error");
      return;
    }

    setLoading(true);
    try {
      // BƯỚC 1: Ký & Gửi tiền vào "Smart Contract" (Vault Address)
      addToast(`Đang gửi ${amount} ETH vào Smart Contract...`, "info");
      
      const tx = await sendTransaction(EDU_FUND_CONTRACT_ADDRESS, amount);
      addToast(`✅ Đã nạp quỹ thành công! (Tx: ${tx.hash.slice(0,6)}...)`, "success");

      // BƯỚC 2: Gọi API để lưu thông tin quỹ
      const newFund = await api.createFund({
        title: formData.title,
        targetAmount: amount,
        slots: slotsNum, 
        description: formData.desc,
        transactionHash: tx.hash
      }, address);

      addToast("Tạo hồ sơ quỹ thành công!", "success");

      if (newFund && newFund.id) {
        navigate(`/fund/${newFund.id}`);
      } else {
        navigate('/');
      }

    } catch (error: any) {
      console.error("Create error:", error);
      addToast(error.message || "Có lỗi xảy ra khi tạo quỹ.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
       <div className="py-12 bg-background min-h-screen flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
             <h2 className="text-xl font-bold text-gray-900 mb-2">Đang chờ kết nối ví...</h2>
             <button onClick={() => connectWallet()} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600">Kết nối ngay</button>
             <ConnectWalletModal 
               isOpen={showConnectModal} 
               onClose={() => setShowConnectModal(false)} 
               onConnect={connectWallet} 
               isConnecting={isConnecting} 
             />
          </div>
       </div>
    );
  }

  return (
    <div className="py-12 bg-background min-h-screen animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="text-text-secondary hover:text-primary mb-4 inline-block font-medium">← Quay lại</button>
          <h1 className="text-3xl font-bold text-gray-900">Tạo quỹ học bổng mới</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên quỹ *
              </label>
              <input 
                name="title" 
                type="text"
                required 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                placeholder="Tên quỹ học bổng"
                value={formData.title}
                onChange={handleChange} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá trị quỹ (ETH) *
                </label>
                <input 
                  name="target" 
                  type="number" 
                  required 
                  min="0.001"
                  step="0.001"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  value={formData.target}
                  onChange={handleChange} 
                />
                <p className="text-xs text-text-muted mt-1">Số ETH này sẽ được chuyển từ ví bạn vào Smart Contract.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số suất học bổng (1–5) *
                </label>
                <input 
                  name="slots" 
                  type="number"
                  min="1" 
                  max="5"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  value={formData.slots}
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả *
              </label>
              <textarea 
                name="desc" 
                rows={6}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                value={formData.desc}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
              >
                {loading ? "Đang xử lý Blockchain..." : "Nạp ETH & Tạo Quỹ"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFund;