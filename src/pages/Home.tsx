import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import HowItWorks from '../components/HowItWorks';
import FundCard from '../components/FundCard';
import FundFilterBar from '../components/FundFilterBar';
import { CardSkeleton } from '../components/ui/Skeleton';
import { EmptyStateIllustration } from '../assets/svgs';
import { FundFilter, SortOption, Fund } from '../types';
import { api } from '../api/api';
import { useToast } from '../context/ToastContext';

const ITEMS_PER_PAGE = 6;

const Home: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [filters, setFilters] = useState<FundFilter>({
    search: '',
    status: 'All',
    category: '',
    minAmount: 0,
    maxAmount: 999999
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  /** LOAD FUNDS */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getFunds(filters);
        setFunds(data);
      } catch (error: any) {
        console.error(error);
        addToast("Không tải được danh sách quỹ. Vui lòng kiểm tra kết nối.", "error");
        setFunds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, addToast]);

  /** SORT — sửa lại cho phù hợp backend */
  const processedFunds = [...funds].sort((a, b) => {
    if (sortBy === 'newest') {
      // backend không có deadline → sort theo tên mới nhất giả định hoặc theo id
      return b.id.localeCompare(a.id);
    }
    if (sortBy === 'most_applicants') {
      return (b.applicantsCount ?? 0) - (a.applicantsCount ?? 0);
    }
    if (sortBy === 'highest_amount') {
      return b.targetAmount - a.targetAmount;
    }
    return 0;
  });

  const totalPages = Math.ceil(processedFunds.length / ITEMS_PER_PAGE);
  const displayedFunds = processedFunds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    document.getElementById('funds')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen">
      <Hero />
      <AboutSection />
      <HowItWorks />

      <section id="funds" className="py-20 bg-background border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Khám phá Quỹ Học Bổng</h2>
              <p className="text-text-secondary">Tìm kiếm cơ hội phù hợp nhất với bạn.</p>
            </div>
          </div>

          {/** FILTER BAR vẫn hoạt động, nhưng category/status thực chất không được backend lọc. */}
          <FundFilterBar 
            filters={filters} 
            setFilters={setFilters} 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : displayedFunds.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-fade-in-up">
                {displayedFunds.map(fund => (
                  <FundCard key={fund.id} fund={fund} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button 
                    disabled={page === 1} 
                    onClick={() => handlePageChange(page - 1)} 
                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    ← Trước
                  </button>

                  <span className="px-4 py-2 text-sm text-text-secondary flex items-center bg-white rounded-lg border border-gray-100">
                    Trang {page} / {totalPages}
                  </span>

                  <button 
                    disabled={page === totalPages} 
                    onClick={() => handlePageChange(page + 1)} 
                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 animate-fade-in-up">
              <EmptyStateIllustration className="w-48 h-32 mx-auto mb-6 opacity-60" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy quỹ nào</h3>
              <p className="text-text-secondary mb-6">Thử xoá bộ lọc hoặc thay đổi từ khoá tìm kiếm.</p>
              <button 
                onClick={() => setFilters({ search: '', status: 'All', category: '', minAmount: 0, maxAmount: 999999 })}
                className="text-primary font-medium hover:underline"
              >
                Xoá bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
