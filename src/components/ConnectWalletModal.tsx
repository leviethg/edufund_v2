import React from 'react';
import Modal from './ui/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  isConnecting?: boolean;
  onConnected?: () => void; // Optional callback after successful connection
}

const ConnectWalletModal: React.FC<Props> = ({ isOpen, onClose, onConnect, isConnecting, onConnected }) => {
  
  const handleConnect = async () => {
    try {
      await onConnect();
      if (onConnected) {
        onConnected();
      }
      onClose();
    } catch (error) {
      console.error("Connection failed inside modal", error);
      // We don't close the modal if error, so user can try again or cancel
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kết nối ví để tiếp tục">
      <div className="space-y-6">
        <div className="flex justify-center py-4">
           <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center animate-pulse">
             <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
           </div>
        </div>
        <p className="text-gray-600 text-center leading-relaxed">
          Bạn cần kết nối ví để thực hiện hành động này (Tạo quỹ, Ký giao dịch). <br/>
          EduFund <strong>không thể</strong> rút tiền tự động từ ví của bạn.
        </p>
        <div className="flex gap-3 justify-center pt-2">
           <button 
             onClick={onClose} 
             className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
           >
             Hủy bỏ
           </button>
           <button 
             onClick={handleConnect} 
             disabled={isConnecting}
             className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
           >
             {isConnecting ? (
               <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Đang kết nối...
               </>
             ) : 'Kết nối Ví ngay'}
           </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;