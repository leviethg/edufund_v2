import React from 'react';
import { Fund } from '../types';
import { useRouter } from '../context/RouterContext';

interface FundCardProps {
  fund: Fund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
  const { navigate } = useRouter();

  const safeTarget = fund.targetAmount || 1;
  const percent = Math.min(100, Math.round(((fund.raisedAmount || 0) / safeTarget) * 100));

  const handleClick = () => {
    navigate(`/fund/${fund.id}`);
  };

  return (
    <div 
        onClick={handleClick}
        className="group bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full cursor-pointer"
    >
      {/* bỏ phần status cũ — dùng màu xanh cố định */}
      <div className="h-2 bg-primary"></div>

      <div className="p-6 flex-1 flex flex-col">
        
        {/* Category không tồn tại → bỏ hoàn toàn */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
            Scholarship
          </span>
          <span className="text-xs text-text-muted font-medium">
            {fund.applicantsCount || 0} đơn
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {fund.title}
        </h3>

        <p className="text-text-secondary text-sm mb-6 line-clamp-3 flex-1">
          {fund.description}
        </p>

        {/* Progress bar ETH */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-gray-700">{fund.raisedAmount} ETH</span>
            <span className="text-text-muted">/ {fund.targetAmount} ETH</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }}></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="text-xs text-text-muted">Ứng viên: {fund.applicantsCount}</div>
          <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">Chi tiết →</span>
        </div>
      </div>
    </div>
  );
};

export default FundCard;

