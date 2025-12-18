import React from 'react';
import { FundFilter, SortOption } from '../types';

interface Props {
  filters: FundFilter;
  setFilters: React.Dispatch<React.SetStateAction<FundFilter>>;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
}

const FundFilterBar: React.FC<Props> = ({ filters, setFilters, sortBy, setSortBy }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input 
          type="text"
          placeholder="Tìm theo tên, người tạo..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        <select 
          className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:border-primary outline-none cursor-pointer"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="Active">Đang mở</option>
          <option value="Closed">Đã đóng</option>
        </select>
        <select 
          className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:border-primary outline-none cursor-pointer"
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">Tất cả lĩnh vực</option>
          <option value="Tech">Công nghệ</option>
          <option value="Arts">Nghệ thuật</option>
          <option value="Science">Khoa học</option>
          <option value="Social">Xã hội</option>
        </select>
        <select 
          className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium focus:border-primary outline-none cursor-pointer"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="newest">Mới nhất</option>
          <option value="most_applicants">Nhiều hồ sơ nhất</option>
          <option value="highest_amount">Giá trị cao nhất</option>
        </select>
      </div>
    </div>
  );
};
export default FundFilterBar;