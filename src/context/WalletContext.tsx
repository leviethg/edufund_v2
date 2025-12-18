
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useSystemConfig } from './SystemConfigContext';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  requiredNetwork: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToLocalNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Define Mock Address here to be shared
export const MOCK_OWNER_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d89A21";
// Hardhat default Chain ID is 31337. Standard Localhost is 1337.
export const HARDHAT_CHAIN_ID = 31337; 

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const { mode } = useSystemConfig();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // 1. Logic kiểm tra ví khi tải trang (Init)
  useEffect(() => {
    const initWallet = async () => {
        // Nếu đang ở Mock Mode -> Load ví giả
        if (mode === 'mock') {
            const saved = localStorage.getItem('eduFund_wallet_connected');
            if (saved === 'true') {
                setAddress(MOCK_OWNER_ADDRESS);
                setIsConnected(true);
                setChainId(HARDHAT_CHAIN_ID);
            }
            return;
        }

        // Nếu đang ở Real Mode -> Hỏi MetaMask
        const provider = (window as any).ethereum;
        if (!provider) return;

        // Chỉ tự động check nếu đã từng kết nối
        const saved = localStorage.getItem('eduFund_wallet_connected');
        if (saved === 'true') {
            try {
                // Dùng eth_accounts để check xem ví nào đang active mà KHÔNG hiện popup
                const accounts = await provider.request({ method: 'eth_accounts' });
                
                if (accounts && accounts.length > 0) {
                    setAddress(accounts[0]);
                    setIsConnected(true);
                    
                    const cId = await provider.request({ method: 'eth_chainId' });
                    setChainId(parseInt(cId, 16));
                } else {
                    // Nếu không có account nào được trả về -> User đã lock ví hoặc disconnect
                    setAddress(null);
                    setIsConnected(false);
                    localStorage.removeItem('eduFund_wallet_connected');
                }
            } catch (error) {
                console.error("Auto connect error:", error);
            }
        }
    };

    initWallet();
  }, [mode]);

  // 2. Lắng nghe sự kiện thay đổi từ MetaMask (Events)
  useEffect(() => {
    const provider = (window as any).ethereum;
    if (!provider || mode === 'mock') return;

    const handleAccountsChanged = (accounts: string[]) => {
        console.log("Event: accountsChanged", accounts);
        if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            localStorage.setItem('eduFund_wallet_connected', 'true');
            addToast(`Đã chuyển sang ví: ${accounts[0].slice(0, 6)}...`, 'info');
        } else {
            setAddress(null);
            setIsConnected(false);
            localStorage.removeItem('eduFund_wallet_connected');
            addToast("Đã ngắt kết nối ví.", 'info');
        }
    };

    const handleChainChanged = (chainIdHex: string) => {
         const newChainId = parseInt(chainIdHex, 16);
         setChainId(newChainId);
         // Reload để tránh state cũ
         window.location.reload();
    };

    const handleDisconnect = () => {
        setAddress(null);
        setIsConnected(false);
        localStorage.removeItem('eduFund_wallet_connected');
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    return () => {
        if (provider.removeListener) {
            provider.removeListener('accountsChanged', handleAccountsChanged);
            provider.removeListener('chainChanged', handleChainChanged);
            provider.removeListener('disconnect', handleDisconnect);
        }
    };
  }, [mode, addToast]);

  // 3. Hàm kết nối chủ động (User click button)
  const connectWallet = useCallback(async () => {
      setIsConnecting(true);
      
      try {
          // --- MOCK MODE ---
          if (mode === 'mock') {
            await new Promise(resolve => setTimeout(resolve, 800));
            setAddress(MOCK_OWNER_ADDRESS);
            setChainId(HARDHAT_CHAIN_ID);
            setIsConnected(true);
            localStorage.setItem('eduFund_wallet_connected', 'true');
            addToast("Đã kết nối Ví Demo (Mock Mode).", 'success');
            setIsConnecting(false);
            return;
          }

          // --- REAL MODE ---
          const provider = (window as any).ethereum;
          if (!provider) {
             throw new Error("Không tìm thấy MetaMask. Vui lòng cài đặt Extension.");
          }

          // QUAN TRỌNG: Sử dụng wallet_requestPermissions thay vì eth_requestAccounts
          // Lệnh này BẮT BUỘC MetaMask hiện popup chọn tài khoản, bỏ qua cache cũ.
          await provider.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });

          // Sau khi user chọn xong quyền, lấy lại danh sách account
          const accounts = await provider.request({ method: 'eth_requestAccounts' });
          
          if (!accounts || accounts.length === 0) {
              throw new Error("Bạn chưa chọn tài khoản nào.");
          }

          setAddress(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('eduFund_wallet_connected', 'true');
          
          try {
            const cId = await provider.request({ method: 'eth_chainId' });
            setChainId(parseInt(cId, 16));
          } catch {}

          addToast("Kết nối ví thành công!", 'success');

      } catch (error: any) {
          console.error(error);
          // User đóng popup hoặc từ chối
          if (error.code === 4001) {
              addToast("Bạn đã huỷ yêu cầu kết nối.", 'info');
          } else {
              addToast(error.message || "Lỗi kết nối ví", 'error');
          }
      } finally {
          setIsConnecting(false);
      }
  }, [addToast, mode]);

  const disconnectWallet = useCallback(() => {
      setAddress(null);
      setIsConnected(false);
      setChainId(null);
      localStorage.removeItem('eduFund_wallet_connected');
      addToast("Đã ngắt kết nối ví trên web (Vui lòng ngắt cả trên MetaMask nếu cần).", 'info');
  }, [addToast]);

  const switchToLocalNetwork = useCallback(async () => {
      if (!(window as any).ethereum) {
          addToast("Không tìm thấy MetaMask", "error");
          return;
      }
      try {
          await (window as any).ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x7a69' }], // 31337
          });
      } catch (switchError: any) {
          if (switchError.code === 4902) {
              try {
                  await (window as any).ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [
                          {
                              chainId: '0x7a69',
                              chainName: 'Hardhat Localhost',
                              rpcUrls: ['http://127.0.0.1:8545'],
                              nativeCurrency: {
                                  name: 'ETH',
                                  symbol: 'ETH',
                                  decimals: 18,
                              },
                          },
                      ],
                  });
              } catch (addError) {
                  addToast("Không thể thêm mạng Hardhat", "error");
              }
          } else {
              addToast("Lỗi khi chuyển mạng", "error");
          }
      }
  }, [addToast]);

  return (
      <WalletContext.Provider value={{ 
        address, 
        isConnected, 
        isConnecting, 
        chainId, 
        requiredNetwork: HARDHAT_CHAIN_ID,
        connectWallet, 
        disconnectWallet,
        switchToLocalNetwork
      }}>
          {children}
      </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error("useWalletContext must be used within WalletProvider");
    return context;
};
