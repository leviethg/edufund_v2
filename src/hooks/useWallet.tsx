
import { useCallback } from 'react';
import { useWalletContext, MOCK_OWNER_ADDRESS as OWNER_ADDR } from '../context/WalletContext';
import { useSystemConfig } from '../context/SystemConfigContext';

// Re-export constant for compatibility
export const MOCK_OWNER_ADDRESS = OWNER_ADDR;

export const useWallet = () => {
  const { address, isConnected, isConnecting, chainId, requiredNetwork, connectWallet, disconnectWallet, switchToLocalNetwork } = useWalletContext();
  const { mode } = useSystemConfig();

  // Ký Message (Xác thực hành động)
  const signAction = useCallback(async (actionName: string, payload?: any) => {
    if (!isConnected || !address) {
      throw new Error("Ví chưa được kết nối. Vui lòng kết nối ví để tiếp tục.");
    }
    
    // === REAL MODE SIGNING ===
    if (mode === 'real') {
        const ethereum = (window as any).ethereum;
        if (!ethereum) throw new Error("Không tìm thấy MetaMask");

        try {
            // Create a message to sign
            const message = `Yêu cầu xác thực từ EduFund:\n\nHành động: ${actionName}\nThời gian: ${new Date().toLocaleString()}\nDữ liệu: ${JSON.stringify(payload)}`;
            const hexMessage = "0x" + Array.from(new TextEncoder().encode(message))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            // Request Personal Sign from MetaMask
            const signature = await ethereum.request({
                method: 'personal_sign',
                params: [hexMessage, address],
            });

            return {
                hash: signature,
                status: "success"
            };
        } catch (error: any) {
            console.error("Signing error:", error);
            throw new Error("Bạn đã từ chối ký giao dịch trên MetaMask.");
        }
    }

    // === MOCK MODE SIGNING ===
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        hash: "0x" + Math.random().toString(16).substr(2, 64),
        status: "success"
    }; 
  }, [isConnected, address, mode]);

  // Gửi ETH thật (Chuyển tiền)
  const sendTransaction = useCallback(async (toAddress: string, amountEth: number) => {
      if (!isConnected || !address) {
        throw new Error("Ví chưa được kết nối.");
      }

      if (mode === 'real') {
        const ethereum = (window as any).ethereum;
        if (!ethereum) throw new Error("Không tìm thấy MetaMask");
        
        try {
            // Chuyển đổi ETH sang Wei (Hex)
            // 1 ETH = 10^18 Wei. Sử dụng BigInt để tránh lỗi số lớn
            const weiValue = BigInt(Math.floor(amountEth * 1e18));
            const hexValue = "0x" + weiValue.toString(16);

            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: address,
                        to: toAddress,
                        value: hexValue,
                        // Gas sẽ do MetaMask tự tính
                    },
                ],
            });
            return { hash: txHash, status: "success" };
        } catch (error: any) {
            console.error("Tx error:", error);
            throw new Error(error.message || "Giao dịch bị từ chối.");
        }
      } 
      
      // Mock Mode
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { hash: "0xMockTxHash...", status: "success" };

  }, [isConnected, address, mode]);

  return {
    address,
    isConnected,
    isConnecting,
    chainId,
    requiredNetwork,
    connectWallet,
    disconnectWallet,
    signAction,
    sendTransaction,
    switchToLocalNetwork
  };
};